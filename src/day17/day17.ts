// SOLUTION EXPLANATION AND COMMENTARY

// I had found a solution after my program first failed due to not being able to access enough memory
// The records I was making couldn't hold enough information for the whole thing, so after everything went kaboom
// I tried to clear all the positions and record when a rock creates a new floor
// it worked, for example let's say at step 20000 a rock | falls and fills a row completely, all 7 slots have a rock in a line
// this means that anything below that has become irrelevant, so I deleted everything below it
// but then the program would not stop... so I started logging everytime a new floor was created.
// there I saw the loops, it was creating a floor at the exactly same indexes of the moves and shapes every 20 or something floors
// so added more logs, count the rocks are each floor, count the height, then try to find the pattern
// surely there's a mathematical formula that could solve this faster, but anyway with a calculator and my logs I found a solution for those patterns
// pretty much `checkHeightAtTarget` is a transcription from my notes of the logs and the calculations I did
// so now I had to identify the loop, because it doesn't start or happen with indexes 0 (unless somehow your input does)
// that's where the slicing storing the heights of the slices came about
// every 5 rocks we have a group of 5 steps that would be repeated when the movelist was back at this same index
// so I store the values for every group of 5, this way when the group repeats again I can calculate the differences
// and so I found my solution...

import { getPuzzleInput } from "../getPuzzleInput";

enum RockShapes {
  Horizontal = "-",
  Plus = "+",
  LInverted = "L",
  Vertical = "|",
  Square = "#",
}

enum Moves {
  Right = ">",
  Left = "<",
}

interface RockPosition {
  shape: RockShapes;
  position: { x: number; y: number };
}

const shapes = {
  [RockShapes.Horizontal]: [["#", "#", "#", "#"]],
  [RockShapes.Plus]: [
    [" ", "#", " "],
    ["#", "#", "#"],
    [" ", "#", " "],
  ],
  [RockShapes.LInverted]: [
    ["#", "#", "#"],
    [" ", " ", "#"],
    [" ", " ", "#"],
  ],
  [RockShapes.Vertical]: [["#"], ["#"], ["#"], ["#"]],
  [RockShapes.Square]: [
    ["#", "#"],
    ["#", "#"],
  ],
};

const sizes = {
  [RockShapes.Horizontal]: { x: 4, y: 1 },
  [RockShapes.Plus]: { x: 3, y: 3 },
  [RockShapes.LInverted]: { x: 3, y: 3 },
  [RockShapes.Vertical]: { x: 1, y: 4 },
  [RockShapes.Square]: { x: 2, y: 2 },
};

const rockShapeOrder = [
  RockShapes.Horizontal,
  RockShapes.Plus,
  RockShapes.LInverted,
  RockShapes.Vertical,
  RockShapes.Square,
];

const width = 7;
const startX = 2;
const startY = (higestRockPointY: number) =>
  higestRockPointY + 3;

const isIntersected = (
  rock: RockPosition,
  rockMap: Record<number, boolean>
): boolean => {
  if (
    rock.position.x < 0 ||
    rock.position.x + sizes[rock.shape].x > width ||
    rock.position.y < 0
  ) {
    return true;
  }
  for (let y = 0; y < sizes[rock.shape].y; y++) {
    for (let x = 0; x < sizes[rock.shape].x; x++) {
      if (
        rockMap[
          (y + rock.position.y) * width +
            (x + rock.position.x)
        ] &&
        shapes[rock.shape][y][x] === "#"
      ) {
        return true;
      }
    }
  }
  return false;
};

const chunkArray = (array: number[]): number[][] => {
  const response = [];
  for (let i = 0; i < array.length; i += 5) {
    response.push(array.slice(i, i + 5));
  }
  return response;
};

const isLastAndPreviousRepeated = (
  arrayList: number[][]
): number => {
  if (arrayList.length < 3) {
    return -1;
  }
  const aux = arrayList.map((a) => JSON.stringify(a));
  const fPidx = aux.findIndex(
    (a, i) =>
      i !== aux.length - 2 && a === aux[aux.length - 2]
  );
  const fLidx = aux.findIndex(
    (a, i) =>
      i !== aux.length - 1 && a === aux[aux.length - 1]
  );
  if (fLidx === fPidx + 1 && fPidx !== -1) {
    return fLidx;
  }
  return -1;
};

const checkHeightAtTarget = (
  slices: number[][],
  sliceHeightMap: number[],
  highestPoint: number,
  step: number,
  inputLength: number,
  restingRocks: number,
  rockToHeightMap: number[],
  targetRockCount = 1000000000000
): number => {
  let heightAtTarget = 0;

  const lastRepeated = isLastAndPreviousRepeated(slices);
  if (lastRepeated > -1 && step > inputLength) {
    const heightDifference =
      highestPoint - sliceHeightMap[lastRepeated];
    const rockDifference =
      restingRocks - lastRepeated * 5 - 5;
    const maxLoopsNeeded = Math.floor(
      (targetRockCount - lastRepeated * 5) / rockDifference
    );
    const maxRockAfterLoops =
      maxLoopsNeeded * rockDifference + lastRepeated * 5;
    const maxHeightAfterLoops =
      maxLoopsNeeded * heightDifference +
      sliceHeightMap[lastRepeated];

    const missingRocks =
      targetRockCount - maxRockAfterLoops;
    const heightAtSPlusMissing =
      rockToHeightMap[lastRepeated * 5 + missingRocks];

    heightAtTarget =
      maxHeightAfterLoops +
      heightAtSPlusMissing -
      sliceHeightMap[lastRepeated];
  }

  return heightAtTarget;
};
const moveSideways = (
  input: string,
  step: number,
  droppingRock: RockPosition,
  rockMap: Record<number, boolean>
): RockPosition => {
  const move: Moves.Left | Moves.Right = input.charAt(
    step % input.length
  ) as Moves.Left | Moves.Right;

  const auxRock: RockPosition = {
    position: {
      x:
        droppingRock.position.x +
        (move === Moves.Left ? -1 : +1),
      y: droppingRock.position.y,
    },
    shape: droppingRock.shape,
  };

  if (!isIntersected(auxRock, rockMap)) {
    droppingRock = auxRock;
  }
  return droppingRock;
};
const moveDown = (
  rockMap: Record<number, boolean>,
  restingRocks: number,
  droppingRock: RockPosition,
  highestPoint: number
): {
  restingRocks: number;
  droppingRock: RockPosition | undefined;
  highestPoint: number;
} => {
  const auxRock = {
    position: {
      x: droppingRock.position.x,
      y: droppingRock.position.y - 1,
    },
    shape: droppingRock.shape,
  };
  const canMoveDown = !isIntersected(auxRock, rockMap);
  if (!canMoveDown) {
    restingRocks++;
    for (let y = 0; y < sizes[droppingRock.shape].y; y++) {
      for (
        let x = 0;
        x < sizes[droppingRock.shape].x;
        x++
      ) {
        if (shapes[droppingRock.shape][y][x] === "#") {
          rockMap[
            (droppingRock.position.y + y) * width +
              (droppingRock.position.x + x)
          ] = true;
        }
      }
    }

    highestPoint = Math.max(
      highestPoint,
      droppingRock.position.y + sizes[droppingRock.shape].y
    );
  }
  return {
    restingRocks,
    droppingRock: canMoveDown ? auxRock : undefined,
    highestPoint,
  };
};
export const day17: Exercise = async () => {
  const input = (await getPuzzleInput(17)).split("\n")[0];

  let part1 = 0;
  let part2 = 0;

  const rockMap: Record<number, boolean> = {};
  let restingRocks = 0;
  let step = 0;
  let droppingRock: RockPosition | undefined = undefined;
  let highestPoint = 0;

  // save the height after each rock is resting
  const rockToHeightMap: number[] = [];
  // how many steps it took for a rock to rest
  const rockSteps: number[] = [];
  // height when each slice is filled (each group of 5 rocks)
  const sliceHeightMap: number[] = [];

  while (part1 === 0 && part2 === 0) {
    if (!droppingRock) {
      const slices = chunkArray(rockSteps);
      // If the last slice is not 5 length then we can't check it...
      // well we actually could if we shifted all arrays and made the first one the one that's not 5.... can't be arsed to do that, too much work already refactoring all this mess
      // why 5? because that's how many rock shapes there are

      if (slices[slices.length - 1]?.length === 5) {
        sliceHeightMap[slices.length - 1] = highestPoint;
        part2 = checkHeightAtTarget(
          slices,
          sliceHeightMap,
          highestPoint,
          step,
          input.length,
          restingRocks,
          rockToHeightMap
        );
        if (part1 === 0 && part2 !== 0) {
          part1 = checkHeightAtTarget(
            slices,
            sliceHeightMap,
            highestPoint,
            step,
            input.length,
            restingRocks,
            rockToHeightMap,
            2022
          );
        }
      }
    }

    // spawn new rock
    if (droppingRock === undefined) {
      rockToHeightMap[restingRocks] = highestPoint;
      if (restingRocks === 2022) {
        part1 = highestPoint;
      }
      droppingRock = {
        position: { x: startX, y: startY(highestPoint) },
        shape:
          rockShapeOrder[
            restingRocks % rockShapeOrder.length
          ],
      };
      rockSteps.push(0);
    }

    droppingRock = moveSideways(
      input,
      step,
      droppingRock,
      rockMap
    );

    rockSteps[restingRocks]++;
    step++;

    ({ restingRocks, droppingRock, highestPoint } =
      moveDown(
        rockMap,
        restingRocks,
        droppingRock,
        highestPoint
      ));
  }

  return {
    part1,
    part2,
  };
};

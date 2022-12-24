// import { stdout } from "process";
import { getPuzzleInput } from "../getPuzzleInput";

enum Direction {
  North = "N",
  East = "E",
  South = "S",
  West = "W",
}

const MOVE_ORDER = [
  Direction.North,
  Direction.South,
  Direction.West,
  Direction.East,
];

interface Area {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const reduceArea = (
  acc: Area,
  [x, y]: [number, number, typeof MOVE_ORDER]
): Area => {
  return {
    minX: Math.min(acc.minX, x),
    maxX: Math.max(acc.maxX, x),
    minY: Math.min(acc.minY, y),
    maxY: Math.max(acc.maxY, y),
  };
};

const getProposedMove = (
  elves: [number, number, typeof MOVE_ORDER][],
  [ex, ey, directions]: [number, number, typeof MOVE_ORDER]
): [number, number] | null => {
  const surroundingElves = elves.filter(
    ([x, y]) =>
      x >= ex - 1 &&
      x <= ex + 1 &&
      y >= ey - 1 &&
      y <= ey + 1
  ).length;
  if (surroundingElves === 1) {
    return null;
  }

  for (const move of directions) {
    switch (move) {
      case Direction.North:
        if (
          elves.some(
            ([x, y]) =>
              y === ey - 1 && x >= ex - 1 && x <= ex + 1
          )
        ) {
          break;
        }
        return [ex, ey - 1];
      case Direction.South:
        if (
          elves.some(
            ([x, y]) =>
              y === ey + 1 && x >= ex - 1 && x <= ex + 1
          )
        ) {
          break;
        }
        return [ex, ey + 1];
      case Direction.West:
        if (
          elves.some(
            ([x, y]) =>
              x === ex - 1 && y >= ey - 1 && y <= ey + 1
          )
        ) {
          break;
        }
        return [ex - 1, ey];
      case Direction.East:
        if (
          elves.some(
            ([x, y]) =>
              x === ex + 1 && y >= ey - 1 && y <= ey + 1
          )
        ) {
          break;
        }
        return [ex + 1, ey];
    }
  }

  return null;
};

// const print = (
//   elves: [number, number, typeof MOVE_ORDER][],
//   reset = true
// ) => {
//   const { minX, minY, maxX, maxY } = elves.reduce<Area>(
//     reduceArea,
//     {
//       minX: Infinity,
//       maxX: -Infinity,
//       minY: Infinity,
//       maxY: -Infinity,
//     }
//   );

//   for (let y = minY; y <= maxY; y++) {
//     for (let x = minX; x <= maxX; x++) {
//       if (
//         elves.find((elf) => elf[0] === x && elf[1] === y)
//       ) {
//         stdout.write("#");
//       } else {
//         stdout.write(".");
//       }
//     }
//     stdout.write("\n");
//   }
//   if (reset) stdout.moveCursor(0, -(maxY - minY) - 1);
// };

const doRound = (
  elves: [number, number, typeof MOVE_ORDER][]
): [number, number] => {
  let moveCount = 0;
  const proposals: Record<number, [number, number]> = {};

  for (let idx = 0; idx < elves.length; idx++) {
    const elf = elves[idx];
    const proposal = getProposedMove(elves, elf);
    elves[idx][2].push(elves[idx][2].shift()!);
    if (proposal !== null) {
      proposals[idx] = proposal;
    }
  }

  const proposalList = Object.values(proposals);

  for (const elf of Object.keys(proposals)) {
    const elfNum = Number(elf);
    if (
      proposalList.filter(
        ([x, y]) =>
          x === proposals[elfNum][0] &&
          y === proposals[elfNum][1]
      ).length > 1
    ) {
      continue;
    }

    moveCount++;
    elves[elfNum][0] = proposals[elfNum][0];
    elves[elfNum][1] = proposals[elfNum][1];
  }

  const area = elves.reduce<Area>(reduceArea, {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
  });
  return [
    (area.maxX - area.minX + 1) *
      (area.maxY - area.minY + 1),
    moveCount,
  ];
};

export const day23: Exercise = async () => {
  const input = (await getPuzzleInput(23)).split("\n");

  const elves: [number, number, typeof MOVE_ORDER][] = [];

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y].charAt(x) === "#") {
        elves.push([x, y, [...MOVE_ORDER]]);
      }
    }
  }

  let part1 = 0;
  let i = 0;
  for (; i < 10; i++) {
    [part1] = doRound(elves);
    part1 -= elves.length;
  }

  let moveCount = Infinity;

  while (moveCount > 0) {
    [, moveCount] = doRound(elves);
    i++;
  }

  return {
    part1,
    part2: i,
  };
};

// import { stdout } from "process";
import { stdout } from "process";
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
  [x, y]: [number, number]
): Area => {
  return {
    minX: Math.min(acc.minX, x),
    maxX: Math.max(acc.maxX, x),
    minY: Math.min(acc.minY, y),
    maxY: Math.max(acc.maxY, y),
  };
};

const getProposedMove = (
  elves: Record<string, [number, number]>,
  [ex, ey]: [number, number]
): [number, number] | null => {
  const surroundingElves = [
    `${ex - 1},${ey - 1}`,
    `${ex},${ey - 1}`,
    `${ex + 1},${ey - 1}`,
    `${ex - 1},${ey}`,
    `${ex},${ey}`,
    `${ex + 1},${ey}`,
    `${ex - 1},${ey + 1}`,
    `${ex},${ey + 1}`,
    `${ex + 1},${ey + 1}`,
  ].filter((key) => elves[key]).length;

  if (surroundingElves === 1) {
    return null;
  }

  for (const move of MOVE_ORDER) {
    switch (move) {
      case Direction.North:
        if (
          elves[`${ex - 1},${ey - 1}`] ||
          elves[`${ex},${ey - 1}`] ||
          elves[`${ex + 1},${ey - 1}`]
        ) {
          break;
        }
        return [ex, ey - 1];
      case Direction.South:
        if (
          elves[`${ex - 1},${ey + 1}`] ||
          elves[`${ex},${ey + 1}`] ||
          elves[`${ex + 1},${ey + 1}`]
        ) {
          break;
        }
        return [ex, ey + 1];
      case Direction.West:
        if (
          elves[`${ex - 1},${ey - 1}`] ||
          elves[`${ex - 1},${ey}`] ||
          elves[`${ex - 1},${ey + 1}`]
        ) {
          break;
        }
        return [ex - 1, ey];
      case Direction.East:
        if (
          elves[`${ex + 1},${ey - 1}`] ||
          elves[`${ex + 1},${ey}`] ||
          elves[`${ex + 1},${ey + 1}`]
        ) {
          break;
        }
        return [ex + 1, ey];
    }
  }

  return null;
};

const doRound = (
  elves: Record<string, [number, number]>
): number => {
  let moveCount = 0;
  const proposals: Record<string, [number, number]> = {};
  const proposalsRecord: Record<string, number> = {};

  for (const key of Object.keys(elves)) {
    const elf = elves[key];
    const proposal = getProposedMove(elves, elf);
    if (proposal !== null) {
      proposals[key] = proposal;
      const pKey = `${proposal[0]},${proposal[1]}`;
      proposalsRecord[pKey] = proposalsRecord[pKey]
        ? proposalsRecord[pKey] + 1
        : 1;
    }
  }
  MOVE_ORDER.push(MOVE_ORDER.shift()!);

  for (const elf of Object.keys(proposals)) {
    const pKey = `${proposals[elf][0]},${proposals[elf][1]}`;
    if (proposalsRecord[pKey] > 1) {
      continue;
    }

    moveCount++;
    delete elves[elf];
    elves[`${proposals[elf][0]},${proposals[elf][1]}`] = [
      proposals[elf][0],
      proposals[elf][1],
    ];
  }

  return moveCount;
};

export const day23: Exercise = async () => {
  const input = (await getPuzzleInput(23)).split("\n");

  const elves: Record<string, [number, number]> = {};
  let elvesCount = 0;

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y].charAt(x) === "#") {
        elves[`${x},${y}`] = [x, y];
        elvesCount++;
      }
    }
  }

  let part1 = 0;
  let i = 0;
  for (; i < 10; i++) {
    doRound(elves);
    const area = Object.values(elves).reduce<Area>(
      reduceArea,
      {
        minX: Infinity,
        maxX: -Infinity,
        minY: Infinity,
        maxY: -Infinity,
      }
    );
    part1 =
      (area.maxX - area.minX + 1) *
        (area.maxY - area.minY + 1) -
      elvesCount;
  }

  let moveCount = Infinity;

  while (moveCount > 0) {
    moveCount = doRound(elves);
    i++;
  }

  return {
    part1,
    part2: i,
  };
};

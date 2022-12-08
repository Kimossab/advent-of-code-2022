import { getPuzzleInput } from "../getPuzzleInput";

const getTreesAround = (
  trees: number[][],
  x: number,
  y: number
): {
  top: number[];
  bottom: number[];
  left: number[];
  right: number[];
} => {
  const top = [];
  const bottom = [];
  const left = trees[y].slice(0, x);
  const right = trees[y].slice(x + 1);

  for (let iY = 0; iY < y; iY++) {
    top.push(trees[iY][x]);
  }
  for (let iY = y + 1; iY < trees.length; iY++) {
    bottom.push(trees[iY][x]);
  }
  return {
    top: top.reverse(),
    bottom,
    left: left.reverse(),
    right,
  };
};

const calculations = (
  trees: number[][],
  x: number,
  y: number
): { isVisible: boolean; scenicScore: number } => {
  const { top, bottom, left, right } = getTreesAround(
    trees,
    x,
    y
  );
  const topFirstVisible = top.findIndex(
    (t) => t >= trees[y][x]
  );
  const bottomFirstVisible = bottom.findIndex(
    (t) => t >= trees[y][x]
  );
  const leftFirstVisible = left.findIndex(
    (t) => t >= trees[y][x]
  );
  const rightFirstVisible = right.findIndex(
    (t) => t >= trees[y][x]
  );

  const topScore =
    topFirstVisible === -1
      ? top.length
      : topFirstVisible + 1;
  const bottomScore =
    bottomFirstVisible === -1
      ? bottom.length
      : bottomFirstVisible + 1;
  const leftScore =
    leftFirstVisible === -1
      ? left.length
      : leftFirstVisible + 1;
  const rightScore =
    rightFirstVisible === -1
      ? right.length
      : rightFirstVisible + 1;

  const scenicScore =
    topScore * bottomScore * leftScore * rightScore;

  return {
    isVisible:
      topFirstVisible === -1 ||
      bottomFirstVisible === -1 ||
      leftFirstVisible === -1 ||
      rightFirstVisible === -1,
    scenicScore,
  };
};

export const day8: Exercise = async () => {
  const input = (await getPuzzleInput(8)).split("\n");
  input.pop();
  const trees: number[][] = input.map((line) =>
    line.split("").map(Number)
  );
  const size = trees.length;

  let part1 = 0;
  let part2 = 0;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const { isVisible, scenicScore } = calculations(
        trees,
        x,
        y
      );
      if (isVisible) {
        part1++;
      }
      if (scenicScore > part2) {
        part2 = scenicScore;
      }
    }
  }

  return { part1, part2 };
};

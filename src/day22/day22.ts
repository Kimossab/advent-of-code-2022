// This solution for part 2 is hardcoded to my input.
// I was taking too long to come up with any kind of solution to figure out the faces manually
// so I gave up and just hardcoded the wrapping...

import { getPuzzleInput } from "../getPuzzleInput";

enum Map {
  Empty = ".",
  Wall = "#",
}

enum Turn {
  Left = "L",
  Right = "R",
}

enum Direction {
  Left = "L",
  Right = "R",
  Up = "U",
  Down = "D",
}

interface Wrap {
  x: (pos: [number, number]) => number;
  y: (pos: [number, number]) => number;
  direction: Direction;
}
type FaceWrap = Record<Direction, Wrap>;

const faceWrap: Record<number, FaceWrap> = {
  1: {
    [Direction.Up]: {
      x: () => -1,
      y: ([x]) => 150 + x - 50,
      direction: Direction.Right,
    },
    [Direction.Down]: {
      x: ([x]) => x,
      y: ([, y]) => y,
      direction: Direction.Down,
    },
    [Direction.Left]: {
      x: () => -1,
      y: ([, y]) => 100 + 49 - y,
      direction: Direction.Right,
    },
    [Direction.Right]: {
      x: ([x]) => x,
      y: ([, y]) => y,
      direction: Direction.Down,
    },
  },
  2: {
    [Direction.Up]: {
      x: ([x]) => x - 100,
      y: () => 200,
      direction: Direction.Up,
    },
    [Direction.Down]: {
      x: () => 100,
      y: ([x]) => 50 + x - 100,
      direction: Direction.Left,
    },
    [Direction.Left]: {
      x: ([x]) => x,
      y: ([y]) => y,
      direction: Direction.Left,
    },
    [Direction.Right]: {
      x: () => 100,
      y: ([, y]) => 100 + 49 - y,
      direction: Direction.Left,
    },
  },
  5: {
    [Direction.Up]: {
      x: ([x]) => x,
      y: ([, y]) => y,
      direction: Direction.Up,
    },
    [Direction.Down]: {
      x: ([x]) => x,
      y: ([, y]) => y,
      direction: Direction.Down,
    },
    [Direction.Left]: {
      x: ([, y]) => y - 50,
      y: () => 99,
      direction: Direction.Down,
    },
    [Direction.Right]: {
      x: ([, y]) => 100 + y - 50,
      y: () => 50,
      direction: Direction.Up,
    },
  },
  9: {
    [Direction.Up]: {
      x: ([x]) => x,
      y: ([, y]) => y,
      direction: Direction.Up,
    },
    [Direction.Down]: {
      x: () => 50,
      y: ([x]) => 150 + x - 50,
      direction: Direction.Left,
    },
    [Direction.Left]: {
      x: ([x]) => x,
      y: ([, y]) => y,
      direction: Direction.Left,
    },
    [Direction.Right]: {
      x: () => 150,
      y: ([, y]) => 49 - (y - 100),
      direction: Direction.Left,
    },
  },
  8: {
    [Direction.Up]: {
      x: () => 49,
      y: ([x]) => 50 + x,
      direction: Direction.Right,
    },
    [Direction.Down]: {
      x: ([x]) => x,
      y: ([, y]) => y,
      direction: Direction.Down,
    },
    [Direction.Left]: {
      x: () => 49,
      y: ([, y]) => 49 - (y - 100),
      direction: Direction.Right,
    },
    [Direction.Right]: {
      x: ([x]) => x,
      y: ([, y]) => y,
      direction: Direction.Right,
    },
  },
  12: {
    [Direction.Up]: {
      x: ([x]) => x,
      y: ([, y]) => y,
      direction: Direction.Up,
    },
    [Direction.Down]: {
      x: ([x]) => x + 100,
      y: () => -1,
      direction: Direction.Down,
    },
    [Direction.Left]: {
      x: ([, y]) => 50 + y - 150,
      y: () => -1,
      direction: Direction.Down,
    },
    [Direction.Right]: {
      x: ([, y]) => 50 + y - 150,
      y: () => 150,
      direction: Direction.Up,
    },
  },
};

const getFace = ([x, y]: [number, number]): number => {
  const nY = Math.floor(y / 50);
  const nX = Math.floor(x / 50);

  return nY * 4 + nX;
};

const minMaxY = (
  mapData: Map[][],
  x: number
): [number, number] => {
  let min = undefined;
  let max = undefined;
  let i = 0;

  while (
    i < mapData.length &&
    (min === undefined || max === undefined)
  ) {
    if (
      (mapData[i][x] === Map.Empty ||
        mapData[i][x] === Map.Wall) &&
      min === undefined
    ) {
      min = i;
    } else if (
      mapData[i][x] === undefined &&
      min !== undefined
    ) {
      max = i - 1;
    }
    i++;
  }

  return [min || 0, max || i - 1];
};

const moveMax = (
  mapData: Map[][],
  [x, y, direction]: [number, number, Direction],
  distance: number
): [number, number, Direction] => {
  switch (direction) {
    case Direction.Right: {
      const nX = x + distance;
      const last = mapData[y].length - 1;
      const first = mapData[y].findIndex(
        (o) => o === Map.Empty || o === Map.Wall
      );
      const firstWall =
        mapData[y]
          .slice(x + 1)
          .findIndex((o) => o === Map.Wall) +
        x +
        1;

      if (firstWall > x && nX >= firstWall) {
        // there's a wall in front of me and before my destination
        return [firstWall - 1, y, direction];
      }
      if (firstWall > x) {
        // there's a wall in front of me and after my destination
        return [nX, y, direction];
      }
      if (nX > last) {
        const [rx] = moveMax(
          mapData,
          [first - 1, y, direction],
          (nX - last) % (last - first)
        );
        if (rx === first - 1) {
          return [last, y, direction];
        } else {
          return [rx, y, direction];
        }
      }

      return [nX, y, direction];
    }
    case Direction.Left: {
      const nX = x - distance;
      const last = mapData[y].length - 1;
      const first = mapData[y].findIndex(
        (o) => o === Map.Empty || o === Map.Wall
      );
      const firstWall =
        x -
        mapData[y]
          .slice(first, x)
          .reverse()
          .findIndex((o) => o === Map.Wall) -
        1;

      if (firstWall < x && nX <= firstWall) {
        // there's a wall in front of me and before my destination
        return [firstWall + 1, y, direction];
      }
      if (firstWall < x) {
        // there's a wall in front of me and after my destination
        return [nX, y, direction];
      }
      if (nX < first) {
        const [rx] = moveMax(
          mapData,
          [last + 1, y, direction],
          (first - nX) % (last - first)
        );
        if (rx === last + 1) {
          return [first, y, direction];
        } else {
          return [rx, y, direction];
        }
      }

      return [nX, y, direction];
    }
    case Direction.Down: {
      const nY = y + distance;
      const [first, last] = minMaxY(mapData, x);
      const firstWall =
        y +
        1 +
        mapData
          .slice(y + 1, last + 1)
          .findIndex((o) => o[x] === Map.Wall);

      if (firstWall > y && nY >= firstWall) {
        // there's a wall in front of me and before my destination

        return [x, firstWall - 1, direction];
      }
      if (firstWall > y) {
        // there's a wall in front of me and after my destination

        return [x, nY, direction];
      }
      if (nY > last) {
        const [, rY] = moveMax(
          mapData,
          [x, first - 1, direction],
          (nY - last) % (last - first)
        );
        if (rY === first - 1) {
          return [x, last, direction];
        } else {
          return [x, rY, direction];
        }
      }
      return [x, nY, direction];
    }
    case Direction.Up: {
      const nY = y - distance;
      const [first, last] = minMaxY(mapData, x);
      const firstWall =
        y -
        mapData
          .slice(first, y)
          .reverse()
          .findIndex((o) => o[x] === Map.Wall) -
        1;

      if (firstWall < y && nY <= firstWall) {
        // there's a wall in front of me and before my destination
        return [x, firstWall + 1, direction];
      }
      if (firstWall < y) {
        // there's a wall in front of me and after my destination

        return [x, nY, direction];
      }
      if (nY < first) {
        const [, rY] = moveMax(
          mapData,
          [x, last + 1, direction],
          Math.abs(nY - first) % (last - first)
        );
        if (rY === last + 1) {
          return [x, first, direction];
        } else {
          return [x, rY, direction];
        }
      }

      return [x, nY, direction];
    }
  }
};

const cubeOverBorder = (
  mapData: Map[][],
  [x, y, direction]: [number, number, Direction],
  distance: number
): [number, number, Direction] => {
  const face = getFace([x, y]);
  const wrap = faceWrap[face][direction];
  const [rx, ry, rd] = moveMaxCube(
    mapData,
    [wrap.x([x, y]), wrap.y([x, y]), wrap.direction],
    distance
  );
  if (rx === wrap.x([x, y]) && ry === wrap.y([x, y])) {
    return [x, y, direction];
  } else {
    return [rx, ry, rd];
  }
};
const moveMaxCube = (
  mapData: Map[][],
  [x, y, direction]: [number, number, Direction],
  distance: number
): [number, number, Direction] => {
  switch (direction) {
    case Direction.Right: {
      const nX = x + distance;
      const last = mapData[y].length - 1;
      const first = mapData[y].findIndex(
        (o) => o === Map.Empty || o === Map.Wall
      );
      const firstWall =
        mapData[y]
          .slice(x + 1)
          .findIndex((o) => o === Map.Wall) +
        x +
        1;

      if (firstWall > x && nX >= firstWall) {
        // there's a wall in front of me and before my destination
        return [firstWall - 1, y, direction];
      }
      if (firstWall > x) {
        // there's a wall in front of me and after my destination
        return [nX, y, direction];
      }
      if (nX > last) {
        return cubeOverBorder(
          mapData,
          [last, y, direction],
          nX - last
        );
      }

      return [nX, y, direction];
    }
    case Direction.Left: {
      const nX = x - distance;
      const last = mapData[y].length - 1;
      const first = mapData[y].findIndex(
        (o) => o === Map.Empty || o === Map.Wall
      );
      const firstWall =
        x -
        mapData[y]
          .slice(first, x)
          .reverse()
          .findIndex((o) => o === Map.Wall) -
        1;

      if (firstWall < x && nX <= firstWall) {
        // there's a wall in front of me and before my destination
        return [firstWall + 1, y, direction];
      }
      if (firstWall < x) {
        // there's a wall in front of me and after my destination
        return [nX, y, direction];
      }
      if (nX < first) {
        return cubeOverBorder(
          mapData,
          [first, y, direction],
          (first - nX) % (last - first)
        );
      }

      return [nX, y, direction];
    }
    case Direction.Down: {
      const nY = y + distance;
      const [first, last] = minMaxY(mapData, x);
      const firstWall =
        y +
        1 +
        mapData
          .slice(y + 1, last + 1)
          .findIndex((o) => o[x] === Map.Wall);

      if (firstWall > y && nY >= firstWall) {
        // there's a wall in front of me and before my destination

        return [x, firstWall - 1, direction];
      }
      if (firstWall > y) {
        // there's a wall in front of me and after my destination

        return [x, nY, direction];
      }
      if (nY > last) {
        return cubeOverBorder(
          mapData,
          [x, last, direction],
          (nY - last) % (last - first)
        );
      }
      return [x, nY, direction];
    }
    case Direction.Up: {
      const nY = y - distance;
      const [first, last] = minMaxY(mapData, x);
      const firstWall =
        y -
        mapData
          .slice(first, y)
          .reverse()
          .findIndex((o) => o[x] === Map.Wall) -
        1;

      if (firstWall < y && nY <= firstWall) {
        // there's a wall in front of me and before my destination
        return [x, firstWall + 1, direction];
      }
      if (firstWall < y) {
        // there's a wall in front of me and after my destination

        return [x, nY, direction];
      }
      if (nY < first) {
        return cubeOverBorder(
          mapData,
          [x, first, direction],
          Math.abs(nY - first) % (last - first)
        );
      }

      return [x, nY, direction];
    }
  }
};

const doTurn = (d: Direction, t: Turn): Direction => {
  const sorted = [
    Direction.Up,
    Direction.Right,
    Direction.Down,
    Direction.Left,
  ];

  let idx = sorted.indexOf(d) + (t === Turn.Left ? -1 : 1);

  if (idx === -1) {
    idx = 3;
  } else if (idx === 4) {
    idx = 0;
  }

  return sorted[idx];
};

const move = (
  mapData: Map[][] = [],
  instructions: (number | Turn)[] = [],
  [x, y, direction]: [number, number, Direction]
): [
  [number, number, Direction],
  [number, number, Direction]
] => {
  let [nX, nY, nD] = [x, y, direction];
  let [n2X, n2Y, n2D] = [x, y, direction];
  for (const instruction of instructions) {
    if (typeof instruction === "number") {
      [nX, nY, nD] = moveMax(
        mapData,
        [nX, nY, nD],
        instruction
      );
      [n2X, n2Y, n2D] = moveMaxCube(
        mapData,
        [n2X, n2Y, n2D],
        instruction
      );
    } else {
      nD = doTurn(nD, instruction);
      n2D = doTurn(n2D, instruction);
    }
  }
  return [
    [nX, nY, nD],
    [n2X, n2Y, n2D],
  ];
};

export const day22: Exercise = async () => {
  const input = (await getPuzzleInput(22)).split("\n");

  let mapComplete = false;
  const mapData: Map[][] = [];
  const instructions: (number | Turn)[] = [];
  for (const line of input) {
    if (line !== "" && !mapComplete) {
      const mapLine: Map[] = [];
      for (let i = 0; i < line.length; i++) {
        const char = line.charAt(i);
        if (char === "." || char === "#") {
          mapLine[i] = char as Map;
        }
      }
      mapData.push(mapLine);
    } else if (!mapComplete) {
      mapComplete = true;
    } else if (line !== "") {
      let m;
      const regex = /(?<dist>\d*)(?<direction>[LR])?/gm;
      while ((m = regex.exec(line)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }
        if (m.groups?.dist) {
          instructions.push(Number(m.groups.dist));
        }
        if (m.groups?.direction) {
          instructions.push(m.groups.direction as Turn);
        }
      }
    }
  }

  const startPos: [number, number, Direction] = [
    mapData[0].findIndex((o) => o === Map.Empty),
    0,
    Direction.Right,
  ];

  const endCoordinates = move(
    mapData,
    instructions,
    startPos
  );

  const directionValue = {
    [Direction.Right]: 0,
    [Direction.Down]: 1,
    [Direction.Left]: 2,
    [Direction.Up]: 3,
  };

  const part1 =
    1000 * (endCoordinates[0][1] + 1) +
    4 * (endCoordinates[0][0] + 1) +
    directionValue[endCoordinates[0][2]];

  console.log(endCoordinates[1]);
  const part2 =
    1000 * (endCoordinates[1][1] + 1) +
    4 * (endCoordinates[1][0] + 1) +
    directionValue[endCoordinates[1][2]];

  return {
    part1,
    part2,
  };
};

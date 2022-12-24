import { getPuzzleInput } from "../getPuzzleInput";

enum BlizzardDirection {
  Up = "^",
  Right = ">",
  Down = "v",
  Left = "<",
}

interface Blizzard {
  pos: [number, number];
  direction: BlizzardDirection;
}

interface Area {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const moveBliz = {
  [BlizzardDirection.Down]: [0, 1],
  [BlizzardDirection.Right]: [1, 0],
  [BlizzardDirection.Up]: [0, -1],
  [BlizzardDirection.Left]: [-1, 0],
};

const getBlizzardsPos = (
  blizzards: Blizzard[],
  area: Area,
  time: number
): Blizzard[] =>
  blizzards.map((b) => {
    let x = b.pos[0];
    let y = b.pos[1];

    if (b.direction === BlizzardDirection.Right) {
      const dist = time % area.maxX;
      x += dist;
      if (x > area.maxX) {
        x = area.minX + x - area.maxX - 1;
      }
    }

    if (b.direction === BlizzardDirection.Left) {
      const dist = time % area.maxX;
      x -= dist;
      if (x < area.minX) {
        x = area.maxX - (area.minX - x) + 1;
      }
    }

    if (b.direction === BlizzardDirection.Down) {
      const dist = time % area.maxY;
      y += dist;
      if (y > area.maxY) {
        y = area.minY + y - area.maxY - 1;
      }
    }

    if (b.direction === BlizzardDirection.Up) {
      const dist = time % area.maxY;
      y -= dist;
      if (y < area.minY) {
        y = area.maxY - (area.minY - y) + 1;
      }
    }

    return {
      pos: [x, y],
      direction: b.direction,
    };
  });

const moveBlizzards = (
  blizzards: Blizzard[],
  area: Area
): Blizzard[] =>
  blizzards.map<Blizzard>((b) => {
    const newPos: [number, number] = [
      b.pos[0] + moveBliz[b.direction][0],
      b.pos[1] + moveBliz[b.direction][1],
    ];

    if (newPos[0] > area.maxX) {
      newPos[0] = area.minX;
    } else if (newPos[0] < area.minX) {
      newPos[0] = area.maxX;
    }
    if (newPos[1] > area.maxY) {
      newPos[1] = area.minY;
    } else if (newPos[1] < area.minY) {
      newPos[1] = area.maxY;
    }
    return {
      pos: newPos,
      direction: b.direction,
    };
  });

const isBlizzard = (
  blizzards: Blizzard[],
  [x, y]: [number, number]
) =>
  blizzards.some(
    ({ pos: [bx, by] }) => bx === x && by === y
  );

const isOutOfBounds = (
  [x, y]: [number, number],
  [sx, sy]: [number, number],
  [dx, dy]: [number, number],
  area: Area
): boolean =>
  (x !== dx || y !== dy) &&
  (x !== sx || y !== sy) &&
  (x < area.minX ||
    x > area.maxX ||
    y < area.minY ||
    y > area.maxY);

const possibleMovesDown = (
  blizzards: Blizzard[],
  [x, y]: [number, number],
  start: [number, number],
  destination: [number, number],
  area: Area
): [number, number][] =>
  (
    [
      [x + 1, y],
      [x, y + 1],
      [x, y - 1],
      [x - 1, y],
      [x, y],
    ] as [number, number][]
  ).filter(
    (pos) =>
      !isBlizzard(blizzards, pos) &&
      !isOutOfBounds(pos, start, destination, area)
  );

const possibleMovesUp = (
  blizzards: Blizzard[],
  [x, y]: [number, number],
  start: [number, number],
  destination: [number, number],
  area: Area
): [number, number][] =>
  (
    [
      [x - 1, y],
      [x, y - 1],
      [x, y + 1],
      [x + 1, y],
      [x, y],
    ] as [number, number][]
  ).filter(
    (pos) =>
      !isBlizzard(blizzards, pos) &&
      !isOutOfBounds(pos, start, destination, area)
  );

const findShortestPath = (
  blizzards: Blizzard[],
  [x, y]: [number, number],
  start: [number, number],
  [dx, dy]: [number, number],
  area: Area,
  down = true,
  elapsedTime = 0,
  best = { shortest: Infinity },
  posVisited: Record<string, number> = {}
): number => {
  const idx = `${elapsedTime % area.maxX}|${
    elapsedTime % area.maxY
  }|${x},${y}`;
  if (!!posVisited[idx] && elapsedTime >= posVisited[idx]) {
    return 0;
  }
  posVisited[idx] = elapsedTime;

  if (elapsedTime >= best.shortest) {
    return 0;
  }
  if (isBlizzard(blizzards, [x, y])) {
    return 0;
  }
  if (x === dx && y === dy) {
    return elapsedTime;
  }

  const newPositions = moveBlizzards(blizzards, area);

  const possibilities = (
    down ? possibleMovesDown : possibleMovesUp
  )(newPositions, [x, y], start, [dx, dy], area);

  for (const move of possibilities) {
    const result = findShortestPath(
      newPositions,
      move,
      start,
      [dx, dy],
      area,
      down,
      elapsedTime + 1,
      best,
      posVisited
    );

    if (result > 0 && result < best.shortest) {
      best.shortest = result;
    }
  }

  return best.shortest;
};

export const day24: Exercise = async () => {
  const input = (await getPuzzleInput(24)).split("\n");
  input.pop();
  console.log("");

  const start = input[0].indexOf(".");
  const area: Area = {
    minX: 1,
    maxX: input[0].length - 2,
    minY: 1,
    maxY: input.length - 2,
  };
  const end = input[input.length - 1].indexOf(".");
  const blizzards: Blizzard[] = [];

  for (let y = 1; y < input.length - 1; y++) {
    for (let x = 1; x < input[y].length - 1; x++) {
      const char = input[y].charAt(x);
      if (char !== ".") {
        blizzards.push({
          pos: [x, y],
          direction: char as BlizzardDirection,
        });
      }
    }
  }

  const part1 = findShortestPath(
    blizzards,
    [start, 0],
    [start, 0],
    [end, input.length - 1],
    area
  );
  const backJourney = findShortestPath(
    getBlizzardsPos(blizzards, area, part1),
    [end, input.length - 1],
    [end, input.length - 1],
    [start, 0],
    area,
    false
  );
  const part2 =
    findShortestPath(
      getBlizzardsPos(blizzards, area, part1 + backJourney),
      [start, 0],
      [start, 0],
      [end, input.length - 1],
      area
    ) +
    part1 +
    backJourney;
  return {
    part1,
    part2,
  };
};

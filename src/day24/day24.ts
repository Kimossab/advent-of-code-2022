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

// I'm only using a class so I can reduce the amount of parameters in the finder
class Solver {
  private down = true;
  private blizzards: Record<string, boolean> = {};

  constructor(
    private area: Area,
    private start: [number, number],
    private end: [number, number]
  ) {}

  private moveList = (x: number, y: number) => {
    return (
      this.down
        ? [
            [x + 1, y],
            [x, y + 1],
            [x, y - 1],
            [x - 1, y],
            [x, y],
          ]
        : [
            [x - 1, y],
            [x, y - 1],
            [x, y + 1],
            [x + 1, y],
            [x, y],
          ]
    ) as [number, number][];
  };

  private isOutOfBounds = ([x, y]: [
    number,
    number
  ]): boolean =>
    (x !== this.end[0] || y !== this.end[1]) &&
    (x !== this.start[0] || y !== this.start[1]) &&
    (x < this.area.minX ||
      x > this.area.maxX ||
      y < this.area.minY ||
      y > this.area.maxY);

  private possibleMoves = (
    time: number,
    [x, y]: [number, number]
  ): [number, number][] =>
    this.moveList(x, y).filter((pos) => {
      const hPosKey = `h${time % this.area.maxX},${
        pos[0]
      },${pos[1]}`;
      const vPosKey = `v${time % this.area.maxY},${
        pos[0]
      },${pos[1]}`;

      return (
        !this.blizzards[vPosKey] &&
        !this.blizzards[hPosKey] &&
        !this.isOutOfBounds(pos)
      );
    });

  findShortestPath = (
    [x, y]: [number, number],
    timeAdjustment = 0,
    elapsedTime = 0,
    best = { shortest: Infinity },
    posVisited: Record<string, number> = {}
  ): number => {
    const idx = `${elapsedTime % this.area.maxX}|${
      elapsedTime % this.area.maxY
    }|${x},${y}`;

    if (
      !!posVisited[idx] &&
      elapsedTime >= posVisited[idx]
    ) {
      return 0;
    }
    posVisited[idx] = elapsedTime;

    if (elapsedTime >= best.shortest) {
      return 0;
    }

    const hPosKey = `h${
      (elapsedTime + timeAdjustment) % this.area.maxX
    },${x},${y}`;
    const vPosKey = `v${
      (elapsedTime + timeAdjustment) % this.area.maxY
    },${x},${y}`;
    if (
      this.blizzards[vPosKey] ||
      this.blizzards[hPosKey]
    ) {
      return 0;
    }
    if (x === this.end[0] && y === this.end[1]) {
      if (elapsedTime < best.shortest) {
        best.shortest = elapsedTime;
      }
      return elapsedTime;
    }

    const possibilities = this.possibleMoves(
      elapsedTime + timeAdjustment + 1,
      [x, y]
    );

    for (const move of possibilities) {
      this.findShortestPath(
        move,
        timeAdjustment,
        elapsedTime + 1,
        best,
        posVisited
      );
    }

    return best.shortest;
  };

  getAllBlizzardPositionsOverTime = (
    bzData: Blizzard[]
  ): Record<string, boolean> => {
    const horizontal = bzData.filter(
      ({ direction }) =>
        direction === BlizzardDirection.Left ||
        direction === BlizzardDirection.Right
    );
    const vertical = bzData.filter(
      ({ direction }) =>
        direction === BlizzardDirection.Up ||
        direction === BlizzardDirection.Down
    );

    for (let i = 0; i < this.area.maxX; i++) {
      for (const { pos, direction } of horizontal) {
        let x = pos[0];
        const y = pos[1];

        if (direction === BlizzardDirection.Right) {
          const dist = i % this.area.maxX;
          x += dist;
          if (x > this.area.maxX) {
            x = this.area.minX + x - this.area.maxX - 1;
          }
        }

        if (direction === BlizzardDirection.Left) {
          const dist = i % this.area.maxX;
          x -= dist;
          if (x < this.area.minX) {
            x = this.area.maxX - (this.area.minX - x) + 1;
          }
        }

        const key = `h${i},${x},${y}`;
        this.blizzards[key] = true;
      }
    }
    for (let i = 0; i < this.area.maxY; i++) {
      for (const { pos, direction } of vertical) {
        const x = pos[0];
        let y = pos[1];

        if (direction === BlizzardDirection.Down) {
          const dist = i % this.area.maxY;
          y += dist;
          if (y > this.area.maxY) {
            y = this.area.minY + y - this.area.maxY - 1;
          }
        }

        if (direction === BlizzardDirection.Up) {
          const dist = i % this.area.maxY;
          y -= dist;
          if (y < this.area.minY) {
            y = this.area.maxY - (this.area.minY - y) + 1;
          }
        }

        const key = `v${i},${x},${y}`;
        this.blizzards[key] = true;
      }
    }

    return this.blizzards;
  };

  goBack = () => {
    const s = this.start;
    this.start = this.end;
    this.end = s;
    this.down = !this.down;
  };
}

export const day24: Exercise = async () => {
  const input = (await getPuzzleInput(24)).split("\n");
  input.pop();

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

  const solver = new Solver(
    area,
    [start, 0],
    [end, input.length - 1]
  );

  solver.getAllBlizzardPositionsOverTime(blizzards);

  const part1 = solver.findShortestPath([start, 0]);

  solver.goBack();

  const backJourney = solver.findShortestPath(
    [end, input.length - 1],
    part1
  );

  solver.goBack();

  const part2 =
    solver.findShortestPath(
      [start, 0],
      part1 + backJourney
    ) +
    part1 +
    backJourney;

  return {
    part1,
    part2,
  };
};

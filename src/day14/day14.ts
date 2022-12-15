import { stdout } from "process";
import { createInterface } from "readline/promises";
import { getPuzzleInput } from "../getPuzzleInput";

interface Point {
  x: number;
  y: number;
}

interface Line {
  pointA: Point;
  pointB: Point;
}
interface MinMaxXY {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const getBorders = (
  walls: Point[],
  sand: Point[]
): MinMaxXY => {
  const xS = [
    ...walls.map((w) => w.x),
    ...sand.map((s) => s.x),
  ];
  const minX = Math.min(...xS);
  const maxX = Math.max(...xS);
  const minY = 0;
  const maxY = Math.max(...walls.map((w) => w.y)) + 2;
  return { minX, maxX, minY, maxY };
};

const linesToPointList = (lines: Line[]): Point[] => {
  const pointList: Point[] = [];
  for (const line of lines) {
    if (line.pointA.y < line.pointB.y) {
      for (let y = line.pointA.y; y <= line.pointB.y; y++) {
        if (
          !pointList.find(
            (p) => p.x === line.pointA.x && p.y === y
          )
        ) {
          pointList.push({ x: line.pointA.x, y });
        }
      }
    }
    if (line.pointA.y >= line.pointB.y) {
      for (let y = line.pointB.y; y <= line.pointA.y; y++) {
        if (
          !pointList.find(
            (p) => p.x === line.pointA.x && p.y === y
          )
        ) {
          pointList.push({ x: line.pointA.x, y });
        }
      }
    }
    if (line.pointA.x < line.pointB.x) {
      for (let x = line.pointA.x; x <= line.pointB.x; x++) {
        if (
          !pointList.find(
            (p) => p.x === x && p.y === line.pointA.y
          )
        ) {
          pointList.push({ x, y: line.pointA.y });
        }
      }
    }
    if (line.pointA.x > line.pointB.x) {
      for (let x = line.pointB.x; x <= line.pointA.x; x++) {
        if (
          !pointList.find(
            (p) => p.x === x && p.y === line.pointA.y
          )
        ) {
          pointList.push({ x, y: line.pointA.y });
        }
      }
    }
  }
  return pointList;
};

const print = async (walls: Point[], sand: Point[]) => {
  const borders = getBorders(walls, sand);
  for (let y = 0; y < borders.maxY; y++) {
    for (let x = borders.minX; x <= borders.maxX; x++) {
      if (y === 0 && x === 500) {
        stdout.write("+");
      } else if (
        walls.find((p) => p.x === x && p.y === y)
      ) {
        stdout.write("#");
      } else if (sand.find((p) => p.x === x && p.y === y)) {
        stdout.write("o");
      } else {
        stdout.write(".");
      }
    }
    stdout.write("\n");
  }

  stdout.write(
    "#".repeat(borders.maxX - borders.minX + 1) + "\n"
  );

  // await rl.question("");
  // stdout.moveCursor(0, -borders.maxY - 1);
};

const canMove = (
  walls: Point[],
  sand: Point[],
  spec: Point
): { left: boolean; right: boolean } => {
  const border = getBorders(walls, sand);
  if (spec.y >= border.maxY - 1) {
    return { left: false, right: false };
  }
  return {
    left:
      !walls.find(
        ({ x, y }) => x === spec.x - 1 && y === spec.y + 1
      ) &&
      !sand.find(
        ({ x, y }) => x === spec.x - 1 && y === spec.y + 1
      ),
    right:
      !walls.find(
        ({ x, y }) => x === spec.x + 1 && y === spec.y + 1
      ) &&
      !sand.find(
        ({ x, y }) => x === spec.x + 1 && y === spec.y + 1
      ),
  };
};

const spawnSand = (
  walls: Point[],
  sand: Point[]
): Point | null => {
  let x = 500;
  let y = 0;
  do {
    y =
      Math.min(
        ...walls
          .filter((w) => w.x === x && w.y > y)
          .map((w) => w.y),
        ...sand
          .filter((s) => s.x === x && s.y > y)
          .map((s) => s.y)
      ) - 1;
    if (y === Infinity) {
      return null;
    }

    const { left, right } = canMove(walls, sand, { x, y });
    if (left) {
      x--;
      y++;
    } else if (right) {
      x++;
      y++;
    } else {
      break;
    }
  } while (y === y);
  return { x, y };
};

// the stupid one is me for only realizing this was a very easy to solve it after I had solved it manually
const stupidPart2 = (walls: Point[]): number => {
  const borders = getBorders(walls, []);
  let sand = 1;
  let minX = 499;
  let maxX = 501;
  const mapData: string[][] = [];
  mapData[0] = [];
  mapData[0][500] = "o";

  for (let y = 1; y < borders.maxY; y++) {
    mapData[y] = [];
    for (let x = minX; x <= maxX; x++) {
      const isWall = walls.find(
        (w) => w.x === x && w.y === y
      );
      if (isWall) {
        mapData[y][x] = "#";
      } else if (
        [
          mapData[y - 1][x - 1],
          mapData[y - 1][x],
          mapData[y - 1][x + 1],
        ].includes("o")
      ) {
        sand++;
        mapData[y][x] = "o";
      } else {
        mapData[y][x] = ".";
      }
    }

    minX--;
    maxX++;
  }
  return sand;
};

export const day14: Exercise = async () => {
  const input = (await getPuzzleInput(14)).split("\n");

  let part1 = 0;
  let part2 = 0;

  const lines: Line[] = [];

  for (const line of input) {
    const points = line.split(" -> ");
    for (let i = 0; i < points.length - 1; i++) {
      const [aX, aY] = points[i].split(",").map(Number);
      const [bX, bY] = points[i + 1].split(",").map(Number);
      lines.push({
        pointA: { x: aX, y: aY },
        pointB: { x: bX, y: bY },
      });
    }
  }

  const walls = linesToPointList(lines);

  const sand: Point[] = [];
  let s: Point | null;
  while ((s = spawnSand(walls, sand)) !== null) {
    sand.push(s);
  }
  part1 = sand.length;
  part2 = stupidPart2(walls);

  return { part1, part2 };
};

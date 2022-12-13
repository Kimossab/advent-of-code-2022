import { stdout } from "process";
import { createInterface } from "readline/promises";
import { getPuzzleInput } from "../getPuzzleInput";

interface Coordinates {
  x: number;
  y: number;
}

const getCoordinates = (
  index: number,
  width: number
): Coordinates => {
  return {
    y: Math.floor(index / width),
    x: index % width,
  };
};

const getIndex = (
  coordinates: Coordinates,
  width: number
): number | null => {
  if (
    coordinates.x >= width ||
    coordinates.x < 0 ||
    coordinates.y >= width ||
    coordinates.y < 0
  ) {
    return null;
  }
  return width * coordinates.y + coordinates.x;
};
const rl = createInterface(process.stdin, process.stdout);

const printPretty = async (
  visited: number[],
  width: number,
  height: number,
  objective: number
) => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = getIndex({ x, y }, width);

      if (objective === idx) {
        stdout.write("@");
      } else {
        stdout.write(visited.includes(idx!) ? "#" : ".");
      }
    }
    stdout.write("\n");
  }
  // await rl.question("");
  stdout.moveCursor(0, -height - 2);
};

const records: Record<number, number | null> = {};

const max = Infinity;

const getShortestPath = async (
  map: number[],
  width: number,
  height: number,
  pos: Coordinates,
  objective: Coordinates,
  visited: number[] = [],
  maxDistance = Infinity
): Promise<number | null> => {
  const posIdx = getIndex(pos, width);
  const destination = getIndex(objective, width);

  if (posIdx === null) {
    return null;
  }

  if (map[posIdx] === undefined) {
    return null;
  }

  if (
    visited.length >= maxDistance ||
    (records[posIdx] !== null &&
      visited.length > (records[posIdx] as number))
  ) {
    return null;
  }

  if (posIdx === destination) {
    // await printPretty(visited, width, height, destination!);
    return visited.length;
  }

  const fourSides = [
    getIndex({ x: pos.x, y: pos.y - 1 }, width),
    getIndex({ x: pos.x, y: pos.y + 1 }, width),
    getIndex({ x: pos.x + 1, y: pos.y }, width),
    getIndex({ x: pos.x - 1, y: pos.y }, width),
  ]
    .filter(
      (idx) =>
        idx !== null &&
        map[idx] <= map[posIdx] + 1 &&
        !visited.includes(idx) &&
        (records[idx] === undefined ||
          (records[idx] || 0) > visited.length + 1)
    )
    .sort((a, b) => map[b!] - map[a!]);

  for (const side of fourSides) {
    records[side!] = visited.length + 1;
  }

  const newVisited = [...visited, posIdx];
  // await printPretty(
  //   newVisited,
  //   width,
  //   height,
  //   destination!
  // );

  let nMaxDistance = maxDistance;
  for (const side of fourSides) {
    const dist = await getShortestPath(
      map,
      width,
      height,
      getCoordinates(side!, width),
      objective,
      newVisited,
      nMaxDistance
    );
    if (dist && dist < nMaxDistance) {
      nMaxDistance = dist;
    }
  }

  if (nMaxDistance === maxDistance) {
    if (records[posIdx] === undefined) {
      records[posIdx] = null;
    }
    return null;
  }

  records[posIdx] = visited.length;
  return nMaxDistance;
};

export const day12: Exercise = async () => {
  const input = (await getPuzzleInput(12)).split("\n");
  input.pop();

  const width = input[0].length;
  const height = input.length;

  const map = input
    .reduce<string>((acc, line) => acc + line, "")
    .split("")
    .map((c) =>
      ["S", "E"].includes(c)
        ? c
        : c.charCodeAt(0) - "a".charCodeAt(0)
    );

  const numberMap = map.map<number>((c) =>
    c === "S"
      ? 0
      : c === "E"
      ? "z".charCodeAt(0) - "a".charCodeAt(0)
      : (c as number)
  );

  const SIndex = map.findIndex((c) => c === "S");
  const EIndex = map.findIndex((c) => c === "E");

  const S = getCoordinates(SIndex, width);
  const E = getCoordinates(EIndex, width);
  const part1 =
    (await getShortestPath(
      numberMap,
      width,
      height,
      S,
      E
    )) || Infinity;

  let part2 = part1;
  let a = 0;
  let prev = 0;
  while (
    (a = numberMap
      .slice(prev)
      .findIndex(
        (c, index) => c === 1 && prev + index !== SIndex
      )) !== -1
  ) {
    const coord = getCoordinates(a + prev, width);
    const path =
      (await getShortestPath(
        numberMap,
        width,
        height,
        coord,
        E,
        [a + prev],
        part2
      )) || Infinity;

    if (path < part2) {
      part2 = path;
    }

    prev = a + prev + 1;
  }

  return { part1, part2 };
};

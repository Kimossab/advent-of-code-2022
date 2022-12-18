import { getPuzzleInput } from "../getPuzzleInput";

interface Cube {
  x: number;
  y: number;
  z: number;
}

enum PointType {
  Free = "free",
  Trapped = "trapped",
  Cube = "cube",
}

const key = (x: number, y: number, z: number): string => {
  return `${x.toString().padStart(2, "0")}${y
    .toString()
    .padStart(2, "0")}${z.toString().padStart(2, "0")}`;
};

const getPointType = (
  x: number,
  y: number,
  z: number,
  knownPointTypes: Record<string, PointType>,
  minMax: {
    x: [number, number];
    y: [number, number];
    z: [number, number];
  },
  visited: string[] = []
): { type: PointType | null; visited: string[] } => {
  const k = key(x, y, z);
  if (knownPointTypes[k]) {
    return { type: knownPointTypes[k], visited };
  }

  if (visited.includes(k)) {
    return { type: null, visited };
  }

  if (
    x < minMax.x[0] ||
    x > minMax.x[1] ||
    y < minMax.y[0] ||
    y > minMax.y[1] ||
    z < minMax.z[0] ||
    z > minMax.z[1]
  ) {
    knownPointTypes[k] = PointType.Free;
    return { type: PointType.Free, visited };
  }

  let nVisited = [...visited, k];

  const bottom = getPointType(
    x,
    y,
    z - 1,
    knownPointTypes,
    minMax,
    nVisited
  );
  if (
    bottom.type === PointType.Free ||
    bottom.type === PointType.Trapped
  ) {
    knownPointTypes[k] = bottom.type;
    return bottom;
  }
  nVisited = [...new Set(nVisited.concat(bottom.visited))];
  const left = getPointType(
    x,
    y - 1,
    z,
    knownPointTypes,
    minMax,
    nVisited
  );
  nVisited = [...new Set(nVisited.concat(left.visited))];
  if (
    left.type === PointType.Free ||
    left.type === PointType.Trapped
  ) {
    knownPointTypes[k] = left.type;
    return left;
  }
  const back = getPointType(
    x - 1,
    y,
    z,
    knownPointTypes,
    minMax,
    nVisited
  );
  nVisited = [...new Set(nVisited.concat(back.visited))];
  if (
    back.type === PointType.Free ||
    back.type === PointType.Trapped
  ) {
    knownPointTypes[k] = back.type;
    return back;
  }
  const top = getPointType(
    x,
    y,
    z + 1,
    knownPointTypes,
    minMax,
    nVisited
  );
  nVisited = [...new Set(nVisited.concat(top.visited))];
  if (
    top.type === PointType.Free ||
    top.type === PointType.Trapped
  ) {
    knownPointTypes[k] = top.type;
    return top;
  }
  const right = getPointType(
    x,
    y + 1,
    z,
    knownPointTypes,
    minMax,
    nVisited
  );
  nVisited = [...new Set(nVisited.concat(right.visited))];
  if (
    right.type === PointType.Free ||
    right.type === PointType.Trapped
  ) {
    knownPointTypes[k] = right.type;
    return right;
  }
  const front = getPointType(
    x + 1,
    y,
    z,
    knownPointTypes,
    minMax,
    nVisited
  );
  nVisited = [...new Set(nVisited.concat(front.visited))];
  if (
    front.type === PointType.Free ||
    front.type === PointType.Trapped
  ) {
    knownPointTypes[k] = front.type;
    return front;
  }

  return { type: null, visited: nVisited };
};

export const day18: Exercise = async () => {
  const input = (await getPuzzleInput(18)).split("\n");
  const cubeList: Cube[] = [];

  const knownPointTypes: Record<string, PointType> = {};

  const minMaxX: [number, number] = [Infinity, -Infinity];
  const minMaxY: [number, number] = [Infinity, -Infinity];
  const minMaxZ: [number, number] = [Infinity, -Infinity];

  for (const line of input) {
    if (line !== "") {
      const [x, y, z] = line.split(",").map(Number);

      cubeList.push({ x, y, z });
      const k = key(x, y, z);
      knownPointTypes[k] = PointType.Cube;

      minMaxX[0] = Math.min(minMaxX[0], x);
      minMaxX[1] = Math.max(minMaxX[1], x);
      minMaxY[0] = Math.min(minMaxY[0], y);
      minMaxY[1] = Math.max(minMaxY[1], y);
      minMaxZ[0] = Math.min(minMaxZ[0], z);
      minMaxZ[1] = Math.max(minMaxZ[1], z);
    }
  }
  for (let x = minMaxX[0] - 1; x <= minMaxX[1] + 1; x++) {
    for (let y = minMaxY[0] - 1; y <= minMaxY[1] + 1; y++) {
      for (
        let z = minMaxZ[0] - 1;
        z <= minMaxZ[1] + 1;
        z++
      ) {
        const k = key(x, y, z);

        const type = getPointType(
          x,
          y,
          z,
          knownPointTypes,
          {
            x: minMaxX,
            y: minMaxY,
            z: minMaxZ,
          }
        );
        if (type.type === null) {
          for (const visited of type.visited) {
            knownPointTypes[visited] =
              knownPointTypes[visited] || PointType.Trapped;
          }
        }
        knownPointTypes[k] = type.type || PointType.Trapped;
      }
    }
  }

  let part2 = 0;
  let part1 = 0;
  for (const { x, y, z } of cubeList) {
    const top = knownPointTypes[key(x, y, z + 1)];
    const bottom = knownPointTypes[key(x, y, z - 1)];
    const left = knownPointTypes[key(x, y - 1, z)];
    const right = knownPointTypes[key(x, y + 1, z)];
    const front = knownPointTypes[key(x + 1, y, z)];
    const back = knownPointTypes[key(x - 1, y, z)];

    const freeCount = [
      top,
      bottom,
      left,
      right,
      front,
      back,
    ].filter((t) => t === PointType.Free).length;
    const trappedCount = [
      top,
      bottom,
      left,
      right,
      front,
      back,
    ].filter((t) => t === PointType.Trapped).length;

    part1 += freeCount + trappedCount;
    part2 += freeCount;
  }
  return {
    part1,
    part2,
  };
};

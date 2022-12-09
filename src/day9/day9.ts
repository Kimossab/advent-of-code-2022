import { getPuzzleInput } from "../getPuzzleInput";

export const day9: Exercise = async () => {
  const input = (await getPuzzleInput(9)).split("\n");

  const positionHistory = [
    ["0,0"],
    ["0,0"],
    ["0,0"],
    ["0,0"],
    ["0,0"],
    ["0,0"],
    ["0,0"],
    ["0,0"],
    ["0,0"],
    ["0,0"],
  ];
  const position = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];
  for (const instruction of input) {
    const [direction, times] = instruction.split(" ");

    for (let i = 0; i < Number(times); i++) {
      switch (direction) {
        case "U":
          position[0].y++;
          break;
        case "D":
          position[0].y--;
          break;
        case "R":
          position[0].x++;
          break;
        case "L":
          position[0].x--;
          break;
      }

      for (let knot = 1; knot < position.length; knot++) {
        const xDiff =
          position[knot - 1].x - position[knot].x;
        const yDiff =
          position[knot - 1].y - position[knot].y;

        if (Math.abs(xDiff) > 1 || Math.abs(yDiff) > 1) {
          position[knot].x +=
            xDiff === 0 ? 0 : xDiff / Math.abs(xDiff); //+1 or -1 depending on the positiveness of xDiff
          position[knot].y +=
            yDiff === 0 ? 0 : yDiff / Math.abs(yDiff); //same as above but for yDiff

          if (
            !positionHistory[knot].includes(
              `${position[knot].x},${position[knot].y}`
            )
          ) {
            positionHistory[knot].push(
              `${position[knot].x},${position[knot].y}`
            );
          }
        }
      }
    }
  }

  const part1 = positionHistory[1].length;
  const part2 = positionHistory[9].length;

  return { part1, part2 };
};

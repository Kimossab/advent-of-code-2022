import { getPuzzleInput } from "../getPuzzleInput";
import { day22 } from "./day22";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 22: Monkey Map ", () => {
  const input = `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`;

  describe("Part 1", () => {
    it("should return 6032", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day22()).resolves.toMatchObject({
        part1: 6032,
      });
    });
  });
});

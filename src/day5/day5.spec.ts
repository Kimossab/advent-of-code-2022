import { getPuzzleInput } from "../getPuzzleInput";
import { day5 } from "./day5";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 5: Supply Stacks", () => {
  const input = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`;
  describe("Part 1", () => {
    it("should return CMZ", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day5()).resolves.toMatchObject({
        part1: "CMZ",
      });
    });
  });

  describe("Part 2", () => {
    it("should return 4", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day5()).resolves.toMatchObject({
        part2: "MCD",
      });
    });
  });
});

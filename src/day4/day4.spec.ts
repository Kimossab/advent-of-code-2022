import { getPuzzleInput } from "../getPuzzleInput";
import { day4 } from "./day4";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 4: Camp Cleanup", () => {
  const input = `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`;
  describe("Part 1", () => {
    it("should return 2", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day4()).resolves.toMatchObject({
        part1: 2,
      });
    });
  });

  describe("Part 2", () => {
    it("should return 4", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day4()).resolves.toMatchObject({
        part2: 4,
      });
    });
  });
});

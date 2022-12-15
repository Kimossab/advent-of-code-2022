import { getPuzzleInput } from "../getPuzzleInput";
import { day14 } from "./day14";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 13: Distress Signal", () => {
  const input = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`;
  describe("Part 1", () => {
    it("should return 24", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day14()).resolves.toMatchObject({
        part1: 24,
      });
    });
  });
  describe("Part 2", () => {
    it("should return 93", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day14()).resolves.toMatchObject({
        part2: 93,
      });
    });
  });
});

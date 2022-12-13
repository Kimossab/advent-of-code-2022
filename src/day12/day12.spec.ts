import { getPuzzleInput } from "../getPuzzleInput";
import { day12 } from "./day12";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 12: Hill Climbing Algorithm", () => {
  const input = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`;
  describe("Part 1", () => {
    it("should return 31", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day12()).resolves.toMatchObject({
        part1: 31,
      });
    });
  });
  describe("Part 2", () => {
    it("should return 29", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day12()).resolves.toMatchObject({
        part2: 29,
      });
    });
  });
});

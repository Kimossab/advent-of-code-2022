import { getPuzzleInput } from "../getPuzzleInput";
import { day2 } from "./day2";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 2: Rock Paper Scissors ", () => {
  const input = `A Y
B X
C Z`;
  describe("Part 1", () => {
    it("should return 15", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day2()).resolves.toMatchObject({
        part1: 15,
      });
    });
  });

  describe("Part 2", () => {
    it("should return 12", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day2()).resolves.toMatchObject({
        part2: 12,
      });
    });
  });
});

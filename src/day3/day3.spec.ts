import { getPuzzleInput } from "../getPuzzleInput";
import { day3 } from "./day3";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 2: Rock Paper Scissors ", () => {
  const input = `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`;
  describe("Part 1", () => {
    it("should return 157", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day3()).resolves.toMatchObject({
        part1: 157,
      });
    });
  });

  describe("Part 2", () => {
    it("should return 70", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day3()).resolves.toMatchObject({
        part2: 70,
      });
    });
  });
});

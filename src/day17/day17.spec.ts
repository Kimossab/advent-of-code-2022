import { getPuzzleInput } from "../getPuzzleInput";
import { day17 } from "./day17";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 16: Proboscidea Volcanium", () => {
  const input = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>
  `;
  describe("Part 1", () => {
    it("should return 3068", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day17()).resolves.toMatchObject({
        part1: 3068,
      });
    });
  });
  describe("Part 2", () => {
    it("should return 1514285714288", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day17()).resolves.toMatchObject({
        part2: 1514285714288,
      });
    });
  });
});

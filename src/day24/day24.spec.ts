import { getPuzzleInput } from "../getPuzzleInput";
import { day24 } from "./day24";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 24: Blizzard Basin", () => {
  const input = `#.######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#
`;
  describe("Part 1", () => {
    it("should return 18", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day24()).resolves.toMatchObject({
        part1: 18,
      });
    });
  });
  describe("Part 2", () => {
    it("should return 54", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day24()).resolves.toMatchObject({
        part2: 54,
      });
    });
  });
});

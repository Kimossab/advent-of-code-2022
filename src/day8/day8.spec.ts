import { getPuzzleInput } from "../getPuzzleInput";
import { day8 } from "./day8";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 8: Treetop Tree House", () => {
  const input = `30373
25512
65332
33549
35390
`;

  describe("Part 1", () => {
    it("should return 21", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day8()).resolves.toMatchObject({
        part1: 21,
      });
    });
  });

  describe("Part 2", () => {
    it("should return 8", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day8()).resolves.toMatchObject({
        part2: 8,
      });
    });
  });
});

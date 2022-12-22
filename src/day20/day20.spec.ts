import { getPuzzleInput } from "../getPuzzleInput";
import { day20 } from "./day20";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 20: Grove Positioning System", () => {
  const input = `1
2
-3
3
-2
0
4
`;
  describe("Part 1", () => {
    it("should return 3", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day20()).resolves.toMatchObject({
        part1: 3,
      });
    });
  });
  describe("Part 2", () => {
    it("should return 1623178306", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day20()).resolves.toMatchObject({
        part2: 1623178306,
      });
    });
  });
});

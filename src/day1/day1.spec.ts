import { getPuzzleInput } from "../getPuzzleInput";
import { day1 } from "./day1";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 1: Calorie Counting", () => {
  const input = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;
  describe("Part 1", () => {
    it("should return 24000", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day1()).resolves.toMatchObject({
        part1: 24000,
      });
    });
  });

  describe("Part 2", () => {
    it("should return 45000", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day1()).resolves.toMatchObject({
        part2: 45000,
      });
    });
  });
});

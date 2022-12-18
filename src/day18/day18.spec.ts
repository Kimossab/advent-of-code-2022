import { getPuzzleInput } from "../getPuzzleInput";
import { day18 } from "./day18";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 18: Boiling Boulders", () => {
  const input = `2,2,2
1,2,2
3,2,2
2,1,2
2,3,2
2,2,1
2,2,3
2,2,4
2,2,6
1,2,5
3,2,5
2,1,5
2,3,5
`;
  describe("Part 1", () => {
    it("should return 64", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day18()).resolves.toMatchObject({
        part1: 64,
      });
    });
  });
  describe("Part 2", () => {
    it("should return 58", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day18()).resolves.toMatchObject({
        part2: 58,
      });
    });
  });
});

import { getPuzzleInput } from "../getPuzzleInput";
import { day13 } from "./day13";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 13: Distress Signal", () => {
  const input = `[1,1,3,1,1]
  [1,1,5,1,1]
  
  [[1],[2,3,4]]
  [[1],4]
  
  [9]
  [[8,7,6]]
  
  [[4,4],4,4]
  [[4,4],4,4,4]
  
  [7,7,7,7]
  [7,7,7]
  
  []
  [3]
  
  [[[]]]
  [[]]
  
  [1,[2,[3,[4,[5,6,7]]]],8,9]
  [1,[2,[3,[4,[5,6,0]]]],8,9]
`;
  describe("Part 1", () => {
    it("should return 13", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day13()).resolves.toMatchObject({
        part1: 13,
      });
    });
  });
  describe("Part 2", () => {
    it("should return 140", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day13()).resolves.toMatchObject({
        part2: 140,
      });
    });
  });
});

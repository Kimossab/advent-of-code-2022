import { getPuzzleInput } from "../getPuzzleInput";
import { day9 } from "./day9";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 9: Rope Bridge ", () => {
  describe("Part 1", () => {
    const input = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`;
    it("should return 13", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day9()).resolves.toMatchObject({
        part1: 13,
      });
    });
  });

  describe("Part 2", () => {
    const input = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20
`;
    it("should return 36", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day9()).resolves.toMatchObject({
        part2: 36,
      });
    });
  });
});

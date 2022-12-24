import { getPuzzleInput } from "../getPuzzleInput";
import { day23 } from "./day23";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 23: Unstable Diffusion", () => {
  const input = `....#..
..###.#
#...#.#
.#...##
#.###..
##.#.##
.#..#..
`;
  describe("Part 1", () => {
    it("should return 110", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day23()).resolves.toMatchObject({
        part1: 110,
      });
    });
  });
  describe("Part 2", () => {
    it("should return 20", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day23()).resolves.toMatchObject({
        part2: 20,
      });
    });
  });
});

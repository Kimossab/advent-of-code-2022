import { getPuzzleInput } from "../getPuzzleInput";
import { day19 } from "./day19";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 19: Not Enough Minerals", () => {
  const input = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.
`;
  describe("Part 1", () => {
    it("should return 33", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day19()).resolves.toMatchObject({
        part1: 33,
      });
    });
  });
});

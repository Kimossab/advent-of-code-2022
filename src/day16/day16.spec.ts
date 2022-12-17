import { getPuzzleInput } from "../getPuzzleInput";
import { day16 } from "./day16";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 16: Proboscidea Volcanium", () => {
  const input = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
  Valve BB has flow rate=13; tunnels lead to valves CC, AA
  Valve CC has flow rate=2; tunnels lead to valves DD, BB
  Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
  Valve EE has flow rate=3; tunnels lead to valves FF, DD
  Valve FF has flow rate=0; tunnels lead to valves EE, GG
  Valve GG has flow rate=0; tunnels lead to valves FF, HH
  Valve HH has flow rate=22; tunnel leads to valve GG
  Valve II has flow rate=0; tunnels lead to valves AA, JJ
  Valve JJ has flow rate=21; tunnel leads to valve II
`;
  describe("Part 1", () => {
    it("should return 1651", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day16()).resolves.toMatchObject({
        part1: 1651,
      });
    });
  });
  describe("Part 2", () => {
    it("should return 1707", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day16()).resolves.toMatchObject({
        part2: 1707,
      });
    });
  });
});

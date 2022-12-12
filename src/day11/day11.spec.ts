import { getPuzzleInput } from "../getPuzzleInput";
import { day11 } from "./day11";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 11: Monkey in the Middle", () => {
  const input = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`;
  describe("Part 1", () => {
    it("should return 10605", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day11()).resolves.toMatchObject({
        part1: 10605,
      });
    });
  });
  describe("Part 2", () => {
    it("should return 2713310158", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day11()).resolves.toMatchObject({
        part2: 2713310158,
      });
    });
  });
});

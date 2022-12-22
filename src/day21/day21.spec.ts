import { getPuzzleInput } from "../getPuzzleInput";
import { day21 } from "./day21";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 21: Monkey Math", () => {
  const input = `root: pppw + sjmn
dbpl: 5
cczh: sllz + lgvd
zczc: 2
ptdq: humn - dvpt
dvpt: 3
lfqf: 4
humn: 5
ljgn: 2
sjmn: drzm * dbpl
sllz: 4
pppw: cczh / lfqf
lgvd: ljgn * ptdq
drzm: hmdt - zczc
hmdt: 32
`;
  describe("Part 1", () => {
    it("should return 152", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day21()).resolves.toMatchObject({
        part1: 152,
      });
    });
  });
  describe("Part 2", () => {
    it("should return 301", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day21()).resolves.toMatchObject({
        part2: 301,
      });
    });
  });
});

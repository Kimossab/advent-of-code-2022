import { getPuzzleInput } from "../getPuzzleInput";
import { day15 } from "./day15";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 15: Beacon Exclusion Zone", () => {
  const input = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
`;
  describe("Part 1", () => {
    it("should return 26", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day15(10)).resolves.toMatchObject({
        part1: 26,
      });
    });
  });
  describe("Part 2", () => {
    it("should return 56000011", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day15(10)).resolves.toMatchObject({
        part2: 56000011,
      });
    });
  });
});

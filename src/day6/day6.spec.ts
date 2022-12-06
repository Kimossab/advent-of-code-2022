import { getPuzzleInput } from "../getPuzzleInput";
import { day6 } from "./day6";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 6: Tuning Trouble", () => {
  describe("Part 1", () => {
    it.each([
      [5, "bvwbjplbgvbhsrlpgdmjqwftvncz"],
      [6, "nppdvjthqldpwncqszvftbrmjlhg"],
      [10, "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"],
      [11, "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"],
    ])("should return %d for %s", async (output, input) => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day6()).resolves.toMatchObject({
        part1: output,
      });
    });
  });

  describe("Part 2", () => {
    it.each([
      [19, "mjqjpqmgbljsphdztnvjfqwrcgsmlb"],
      [23, "bvwbjplbgvbhsrlpgdmjqwftvncz"],
      [23, "nppdvjthqldpwncqszvftbrmjlhg"],
      [29, "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"],
      [26, "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"],
    ])("should return %d for %s", async (output, input) => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day6()).resolves.toMatchObject({
        part2: output,
      });
    });
  });
});

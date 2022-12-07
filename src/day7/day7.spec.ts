import { getPuzzleInput } from "../getPuzzleInput";
import { day7 } from "./day7";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 7: No Space Left On Device", () => {
  const input = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

  describe("Part 1", () => {
    it("should return 95437", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day7()).resolves.toMatchObject({
        part1: 95437,
      });
    });
  });

  describe("Part 2", () => {
    it("should return 24933642", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day7()).resolves.toMatchObject({
        part2: 24933642,
      });
    });
  });
});

import { getPuzzleInput } from "../getPuzzleInput";
import { day25 } from "./day25";

jest.mock("../getPuzzleInput");
const mockGetPuzzleInput = getPuzzleInput as jest.Mock;

describe("Day 25: Full of Hot Air", () => {
  const input = `1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122
`;
  describe("Part 1", () => {
    it("should return 2=-1=0", async () => {
      mockGetPuzzleInput.mockResolvedValueOnce(input);

      await expect(day25()).resolves.toMatchObject({
        part1: "2=-1=0",
      });
    });
  });
});

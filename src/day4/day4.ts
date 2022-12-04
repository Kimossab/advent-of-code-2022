import { getPuzzleInput } from "../getPuzzleInput";

export const day4: Exercise = async () => {
  const input = (await getPuzzleInput(4)).split("\n");
  let part1 = 0;
  let part2 = 0;

  for (const pair of input) {
    const match =
      /(?<e1min>\d*)-(?<e1max>\d*),(?<e2min>\d*)-(?<e2max>\d*)/g.exec(
        pair
      );

    if (match && match.groups?.e1min) {
      const e1min = Number(match.groups.e1min);
      const e1max = Number(match.groups.e1max);
      const e2min = Number(match.groups.e2min);
      const e2max = Number(match.groups.e2max);

      if (
        (e1min <= e2min && e1max >= e2max) ||
        (e2min <= e1min && e2max >= e1max)
      ) {
        part1++;
        part2++;
      } else if (
        (e1max >= e2max && e1min <= e2max) ||
        (e2max >= e1max && e2min <= e1max)
      ) {
        part2++;
      }
    }
  }

  return { part1, part2 };
};

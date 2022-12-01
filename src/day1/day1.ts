import { getPuzzleInput } from "../getPuzzleInput";

export const day1: Exercise = async () => {
  const input = (await getPuzzleInput(1)).split("\n");

  const elvesCalories = input
    .reduce<number[]>(
      (acc, cur) => {
        if (cur === "") {
          acc.push(0);
        } else {
          acc[acc.length - 1] += Number(cur);
        }
        return acc;
      },
      [0]
    )
    .sort((a, b) => b - a);

  const part1 = elvesCalories[0];
  const part2 =
    elvesCalories[0] + elvesCalories[1] + elvesCalories[2];

  return { part1, part2 };
};

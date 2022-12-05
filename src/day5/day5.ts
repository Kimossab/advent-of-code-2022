import { getPuzzleInput } from "../getPuzzleInput";

export const day5: Exercise = async () => {
  const input = (await getPuzzleInput(5)).split("\n");

  const stacks: string[][] = [];
  let stacks2: string[][] = [];
  let reachedBottom = false;

  for (const line of input) {
    if (line.length === 0) {
      continue;
    }

    if (!reachedBottom) {
      const notTheBottom =
        line.charAt(1) === " " ||
        isNaN(Number(line.charAt(1)));
      //if is a number
      if (!notTheBottom) {
        reachedBottom = true;
        stacks2 = JSON.parse(JSON.stringify(stacks));
        continue;
      }

      for (let i = 0; i < line.length; i += 4) {
        const index = i / 4;
        if (line.charAt(i) === "[") {
          if (!stacks[index]) {
            stacks[index] = [];
          }
          stacks[index].push(line.charAt(i + 1));
        }
      }
    } else {
      const match =
        /move\s(?<move>\d*)\sfrom\s(?<from>\d*)\sto\s(?<to>\d*)/g.exec(
          line
        );
      if (match && match.groups?.move) {
        const move = Number(match.groups.move);
        const from = Number(match.groups.from) - 1;
        const to = Number(match.groups.to) - 1;

        const removed1 = stacks[from].splice(0, move);
        stacks[to] = [...removed1.reverse(), ...stacks[to]];
        const removed2 = stacks2[from].splice(0, move);
        stacks2[to] = [...removed2, ...stacks2[to]];
      }
    }
  }
  const part1 = stacks.reduce<string>((acc, cur) => {
    return acc + cur[0];
  }, "");
  const part2 = stacks2.reduce<string>((acc, cur) => {
    return acc + cur[0];
  }, "");

  return { part1, part2 };
};

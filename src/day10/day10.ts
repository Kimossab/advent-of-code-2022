import { getPuzzleInput } from "../getPuzzleInput";

const getSignalStrength = (
  X: number,
  clock: number,
  signal: number
): number => {
  if (clock > 220) {
    return signal;
  }
  if ((clock - 20) % 40 === 0) {
    return signal + X * clock;
  }

  return signal;
};

const handleCycle = (
  X: number,
  clock: number,
  signal: number
): number => {
  const pos = (clock % 40) - 1;
  const light = [X - 1, X, X + 1].includes(pos);
  process.stdout.write(light ? "#" : ".");
  if (clock % 40 === 0) {
    process.stdout.write("\n");
  }
  return getSignalStrength(X, clock, signal);
};

export const day10: Exercise = async () => {
  const input = (await getPuzzleInput(10)).split("\n");

  input.pop();

  process.stdout.write("\n");

  let X = 1;
  let clock = 0;
  let signal = 0;

  for (const instruction of input) {
    if (instruction === "noop") {
      signal = handleCycle(X, ++clock, signal);
    } else {
      const [, operand] = instruction.split(" ");
      signal = handleCycle(X, ++clock, signal);
      signal = handleCycle(X, ++clock, signal);
      X += Number(operand);
    }
  }

  const part1 = signal;
  const part2 = 0;

  return { part1, part2 };
};

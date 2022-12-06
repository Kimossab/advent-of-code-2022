import { getPuzzleInput } from "../getPuzzleInput";

export const day6: Exercise = async () => {
  const input = await getPuzzleInput(6);

  let part1 = -1;
  let part2 = -1;
  let buffer = "";
  let charIndex = 0;

  for (const char of input) {
    if (buffer.length === 4 && part1 === -1) {
      part1 = charIndex;
    }
    if (buffer.length === 14 && part2 === -1) {
      part2 = charIndex;
      break;
    }

    const idx = buffer.indexOf(char);

    if (idx === -1) {
      buffer += char;
    } else {
      buffer = buffer.slice(idx + 1) + char;
    }
    charIndex++;
  }

  return { part1, part2 };
};

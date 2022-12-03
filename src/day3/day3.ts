import { getPuzzleInput } from "../getPuzzleInput";

const a = "a".charCodeAt(0);
const A = "A".charCodeAt(0);

interface Rucksack {
  compartment1: string[];
  compartment2: string[];
}

const getPriority = (badge: string): number => {
  const code = badge.charCodeAt(0);
  if (code >= a) {
    return code - a + 1;
  }
  return code - A + 27;
};

export const day3: Exercise = async () => {
  const input = (await getPuzzleInput(3)).split("\n");
  let part1 = 0;
  let part2 = 0;

  for (const rucksack of input) {
    if (rucksack === "") {
      break;
    }
    const half = rucksack.length / 2;
    const compartment1 = rucksack.slice(0, half).split("");
    const compartment2 = rucksack.slice(half).split("");
    const shared: string[] = [];

    for (const item of compartment1) {
      if (
        compartment2.includes(item) &&
        !shared.includes(item)
      ) {
        shared.push(item);
        part1 += getPriority(item);
      }
    }
  }

  for (let i = 0; i < input.length; i += 3) {
    if (input[i] === "") {
      break;
    }
    const shared: string[] = [];
    const elf1 = input[i].split("");
    const elf2 = input[i + 1].split("");
    const elf3 = input[i + 2].split("");

    for (const item of elf1) {
      if (
        elf2.includes(item) &&
        elf3.includes(item) &&
        !shared.includes(item)
      ) {
        part2 += getPriority(item);
        shared.push(item);
      }
    }
  }

  return { part1, part2 };
};

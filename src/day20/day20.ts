import { getPuzzleInput } from "../getPuzzleInput";

interface Numb {
  n: number;
  p: number;
}

const mix = (
  list: Numb[],
  original: Numb[] = list
): Numb[] => {
  const result = [...list];

  for (const nn of original) {
    const p = result.indexOf(nn);
    const lenM1 = list.length - 1;
    let position = p + (nn.n % lenM1);

    if (position === p) {
      continue;
    }

    if (position <= 0) {
      position += lenM1;
    } else if (position > lenM1) {
      position -= lenM1;
    }

    result.splice(p, 1);
    result.splice(position, 0, nn);
  }

  return result;
};

export const day20: Exercise = async () => {
  const input = (await getPuzzleInput(20)).split("\n");
  input.pop();
  const numberList = input.map(Number);

  const original: Numb[] = numberList.map((n, p) => ({
    n,
    p,
  }));

  //part1

  const mixed = mix(original).map(({ n }) => n);
  const indx0 = mixed.findIndex((n) => n === 0);

  const part1 =
    mixed[(indx0 + 1000) % mixed.length] +
    mixed[(indx0 + 2000) % mixed.length] +
    mixed[(indx0 + 3000) % mixed.length];

  //part2

  const part2Original = original.map((n) => {
    n.n *= 811589153;
    return n;
  });

  let mixed10times = [...part2Original];
  for (let i = 0; i < 10; i++) {
    mixed10times = mix(mixed10times, part2Original);
  }

  const part2List = mixed10times.map(({ n }) => n);
  const indx0p2 = part2List.findIndex((n) => n === 0);
  const part2 =
    part2List[(indx0p2 + 1000) % part2List.length] +
    part2List[(indx0p2 + 2000) % part2List.length] +
    part2List[(indx0p2 + 3000) % part2List.length];

  return {
    part1,
    part2,
  };
};

import { getPuzzleInput } from "../getPuzzleInput";

type list = (number | list)[];

const compareLists = (list1: list, list2: list): number => {
  for (let i = 0; i < list1.length; i++) {
    if (list2[i] === undefined) {
      return 1;
    }

    if (
      typeof list1[i] === "number" &&
      typeof list2[i] === "number"
    ) {
      if (list1[i] < list2[i]) {
        return -1;
      } else if (list2[i] < list1[i]) {
        return 1;
      }
    } else if (
      Array.isArray(list1[i]) &&
      typeof list2[i] === "number"
    ) {
      const comparision = compareLists(list1[i] as list, [
        list2[i],
      ]);
      if (comparision !== 0) {
        return comparision;
      }
    } else if (
      Array.isArray(list2[i]) &&
      typeof list1[i] === "number"
    ) {
      const comparision = compareLists(
        [list1[i]],
        list2[i] as list
      );
      if (comparision !== 0) {
        return comparision;
      }
    } else if (
      Array.isArray(list1[i]) &&
      Array.isArray(list2[i])
    ) {
      const comparision = compareLists(
        list1[i] as list,
        list2[i] as list
      );
      if (comparision !== 0) {
        return comparision;
      }
    }
  }

  if (list2.length > list1.length) {
    return -1;
  }

  return 0;
};

export const day13: Exercise = async () => {
  const input = (await getPuzzleInput(13)).split("\n");
  let part1 = 0;

  const packets: list[] = [[[2]], [[6]]];

  for (let i = 0; i < input.length; i += 3) {
    const list1: list = JSON.parse(input[i]);
    const list2: list = JSON.parse(input[i + 1]);
    packets.push(list1, list2);

    const result = compareLists(list1, list2);

    if (result === 0 || result === -1) {
      part1 += i / 3 + 1;
    }
  }

  const sorted = packets.sort(compareLists);
  const idx1 = sorted.findIndex(
    (list) => JSON.stringify(list) === "[[2]]"
  );
  const idx2 = sorted.findIndex(
    (list) => JSON.stringify(list) === "[[6]]"
  );
  const part2 = (idx1 + 1) * (idx2 + 1);

  return { part1, part2 };
};

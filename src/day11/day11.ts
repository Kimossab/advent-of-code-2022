import { getPuzzleInput } from "../getPuzzleInput";

interface Monkey {
  items: number[];
  operation: {
    op: "+" | "*";
    opVal: string;
  };
  test: {
    divisor: number;
    true: number;
    false: number;
  };
  inspections: number;
}

export const day11: Exercise = async () => {
  const input = await getPuzzleInput(11);

  const monkeys: Record<number, Monkey> = {};

  const regex =
    /Monkey\s(?<monkey>\d*):\n\s*Starting\sitems:\s(?<items>[^\n]*)\n\s*Operation:\snew\s=\sold\s(?<op>.)\s(?<opVal>[^\n]*)\n\s*Test:\sdivisible\sby\s(?<test>\d*)\n\s*If\strue:\sthrow\sto\smonkey\s(?<trueMonke>\d)\n\s*If\sfalse:\sthrow\sto\smonkey\s(?<falseMonke>\d)/gm;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(input)) !== null) {
    const {
      monkey,
      items,
      op,
      opVal,
      test,
      trueMonke,
      falseMonke,
    } = match.groups!;
    monkeys[Number(monkey)] = {
      items: items.split(", ").map(Number),
      operation: {
        op: op as Monkey["operation"]["op"],
        opVal,
      },
      test: {
        divisor: Number(test),
        true: Number(trueMonke),
        false: Number(falseMonke),
      },
      inspections: 0,
    };
  }

  const copyMonkeys: Record<number, Monkey> = JSON.parse(
    JSON.stringify(monkeys)
  );

  //part1
  for (let i = 0; i < 20; i++) {
    for (const monke of Object.values(monkeys)) {
      let item: number | undefined;
      while ((item = monke.items.shift()) !== undefined) {
        const divisor =
          monke.operation.opVal === "old"
            ? item
            : Number(monke.operation.opVal);
        const newItem = Math.floor(
          (monke.operation.op === "*"
            ? item * divisor
            : item + divisor) / 3
        );

        monke.inspections++;

        if (newItem % monke.test.divisor === 0) {
          monkeys[monke.test.true].items.push(newItem);
        } else {
          monkeys[monke.test.false].items.push(newItem);
        }
      }
    }
  }

  const divisorsMultiplicated = Object.values(copyMonkeys)
    .map((m) => m.test.divisor)
    .reduce<number>((acc, cur) => acc * cur, 1);

  //part2
  for (let i = 0; i < 10000; i++) {
    for (const monke of Object.values(copyMonkeys)) {
      let item: number | undefined;
      while ((item = monke.items.shift()) !== undefined) {
        const divisor =
          monke.operation.opVal === "old"
            ? item
            : Number(monke.operation.opVal);
        const newItem =
          (monke.operation.op === "*"
            ? item * divisor
            : item + divisor) % divisorsMultiplicated;
        monke.inspections++;

        // let nItem = newItem;
        // if (newItem >= divisorsMultiplicated) {
        //   nItem = newItem % divisorsMultiplicated;
        // }

        if (newItem % monke.test.divisor === 0) {
          copyMonkeys[monke.test.true].items.push(newItem);
        } else {
          copyMonkeys[monke.test.false].items.push(newItem);
        }
      }
    }
  }

  const sorted = Object.values(monkeys)
    .map((m) => m.inspections)
    .sort((a, b) => b - a);
  const part1 = sorted[0] * sorted[1];
  const sorted2 = Object.values(copyMonkeys)
    .map((m) => m.inspections)
    .sort((a, b) => b - a);
  const part2 = sorted2[0] * sorted2[1];

  return { part1, part2 };
};

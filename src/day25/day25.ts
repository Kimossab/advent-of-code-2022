import { getPuzzleInput } from "../getPuzzleInput";

enum SNAFU {
  Two = "2",
  One = "1",
  Zero = "0",
  Minus = "-",
  DoubleMinus = "=",
}

const SNAFUValue = {
  [SNAFU.Two]: 2,
  [SNAFU.One]: 1,
  [SNAFU.Zero]: 0,
  [SNAFU.Minus]: -1,
  [SNAFU.DoubleMinus]: -2,
};

const decSNAFUMap: Record<number, SNAFU> = {
  [-2]: SNAFU.DoubleMinus,
  [-1]: SNAFU.Minus,
  0: SNAFU.Zero,
  1: SNAFU.One,
  2: SNAFU.Two,
};

const SNAFU2Decimal = (snafu: SNAFU[]): number => {
  let decValue = 0;
  for (let i = snafu.length - 1; i >= 0; i--) {
    const idx = snafu.length - 1 - i;
    const multiplication = Math.pow(5, idx) || 1;
    const value = SNAFUValue[snafu[i]] * multiplication;
    decValue += value;
  }

  return decValue;
};
const decimal2SNAFU = (decimal: number): SNAFU[] => {
  if (decSNAFUMap[decimal]) {
    return decSNAFUMap[decimal].split("") as SNAFU[];
  }

  const snafu: SNAFU[] = [];
  let digits = 1;
  for (; digits < 90; digits++) {
    const [min, max] = getMinMax(digits);
    if (decimal >= min && decimal <= max) {
      break;
    }
  }
  let toNegate = false;
  let num = decimal;

  while (digits > 1) {
    const [, pMax] = getMinMax(digits - 1);
    if (pMax + 1 > num) {
      snafu.push(SNAFU.Zero);
    } else {
      let diff;
      if (num < Math.pow(5, digits - 1) + pMax) {
        snafu.push(toNegate ? SNAFU.Minus : SNAFU.One);
        diff = num - Math.pow(5, digits - 1);
      } else {
        snafu.push(
          toNegate ? SNAFU.DoubleMinus : SNAFU.Two
        );
        diff = num - 2 * Math.pow(5, digits - 1);
      }
      if (diff < 0) {
        toNegate = !toNegate;
      }
      num = Math.abs(diff);
    }
    digits--;
  }

  snafu.push(decSNAFUMap[num][0] as SNAFU);

  return snafu;
};

const digit2MinMax: Record<number, [number, number]> = {};

const getMinMax = (digits: number): [number, number] => {
  if (digit2MinMax[digits]) {
    return digit2MinMax[digits];
  }

  if (digits === 1) {
    digit2MinMax[digits] = [-2, 2];
    return [-2, 2];
  }
  const [, pMax] = getMinMax(digits - 1);
  const min = pMax + 1;
  const max = 2 * Math.pow(5, digits - 1) + pMax;

  digit2MinMax[digits] = [min, max];
  return [min, max];
};

export const day25: Exercise = async () => {
  const input = (await getPuzzleInput(25)).split("\n");
  let sum = 0;
  for (const num of input) {
    if (num !== "") {
      const decValue = SNAFU2Decimal(
        num.split("") as SNAFU[]
      );
      sum += decValue;
    }
  }

  return {
    part1: decimal2SNAFU(sum).join(""),
    part2: "",
  };
};

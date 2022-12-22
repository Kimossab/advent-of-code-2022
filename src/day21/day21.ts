// not sure if all solutions would have the result in the number 2
// but in case it's not it should have on number 1
// if for some weird reason it's on both, it'll most likely be unsolvable with this code
// as all of this works with the assumption that there's only a single variable
// by this I mean that humn is only ever requested once in the whole formula
// sorry about var names and stuff, I'm too tired

import { getPuzzleInput } from "../getPuzzleInput";

enum Op {
  Multiplication = "*",
  Sum = "+",
  Division = "/",
  Sub = "-",
}

interface MathOperation {
  num1: MathOperation | number | "x";
  op: Op;
  num2: MathOperation | number | "x";
}

interface MonkeyNumber {
  value: number;
}

interface MonkeyOp {
  monkeh1: string;
  monkeh2: string;
  op: Op;
}

interface Monkey {
  name: string;
  job: MonkeyNumber | MonkeyOp;
}

const isMathOperation = (
  num: MathOperation | number | "x"
): num is MathOperation => {
  return typeof num !== "number" && num !== "x";
};

const isMonkeyNumber = (
  job: MonkeyNumber | MonkeyOp
): job is MonkeyNumber => {
  return (
    job !== undefined &&
    (job as MonkeyNumber).value !== undefined
  );
};

const yellMrMonkeh = (
  monkeyJob: Monkey[],
  mrMonkey: string,
  cache: Record<string, number> = {}
): number => {
  if (cache[mrMonkey]) {
    return cache[mrMonkey];
  }

  const mrMonkeyWithJob = monkeyJob.find(
    (m) => m.name === mrMonkey
  )!;
  const job = mrMonkeyWithJob?.job;

  if (isMonkeyNumber(job)) {
    cache[mrMonkey] = job.value;
    return cache[mrMonkey];
  } else {
    const monk1 = yellMrMonkeh(
      monkeyJob,
      job.monkeh1,
      cache
    );
    const monk2 = yellMrMonkeh(
      monkeyJob,
      job.monkeh2,
      cache
    );

    switch (job.op) {
      case Op.Division:
        cache[mrMonkey] = monk1 / monk2;
        return cache[mrMonkey];
      case Op.Multiplication:
        cache[mrMonkey] = monk1 * monk2;
        return cache[mrMonkey];
      case Op.Sub:
        cache[mrMonkey] = monk1 - monk2;
        return cache[mrMonkey];
      case Op.Sum:
        cache[mrMonkey] = monk1 + monk2;
        return cache[mrMonkey];
    }
  }
};

const yellMrMonkehWithVars = (
  monkeyJob: Monkey[],
  mrMonkey: string,
  cache: Record<string, number | MathOperation> = {}
): number | MathOperation | "x" => {
  if (mrMonkey === "humn") {
    return "x";
  }

  if (cache[mrMonkey]) {
    return cache[mrMonkey];
  }

  const mrMonkeyWithJob = monkeyJob.find(
    (m) => m.name === mrMonkey
  )!;
  const job = mrMonkeyWithJob?.job;

  if (isMonkeyNumber(job)) {
    cache[mrMonkey] = job.value;
    return cache[mrMonkey];
  } else {
    const monk1 = yellMrMonkehWithVars(
      monkeyJob,
      job.monkeh1,
      cache
    );
    const monk2 = yellMrMonkehWithVars(
      monkeyJob,
      job.monkeh2,
      cache
    );

    if (
      isMathOperation(monk1) ||
      monk1 === "x" ||
      isMathOperation(monk2) ||
      monk2 === "x"
    ) {
      cache[mrMonkey] = {
        num1: monk1,
        op: job.op,
        num2: monk2,
      };
      return cache[mrMonkey];
    }

    cache[mrMonkey] = calculate(job.op, monk1, monk2);
    return cache[mrMonkey];
  }
};

const calculate = (
  op: Op,
  num1: number,
  num2: number
): number => {
  switch (op) {
    case Op.Division:
      return num1 / num2;
    case Op.Multiplication:
      return num1 * num2;
    case Op.Sub:
      return num1 - num2;
    case Op.Sum:
      return num1 + num2;
  }
};

const safeSolve = ({
  op,
  num1,
  num2,
}: MathOperation): number => {
  if (num1 === "x" || num2 === "x") {
    throw new Error("wrong assumption");
  }

  const n1 = isMathOperation(num1) ? safeSolve(num1) : num1;
  const n2 = isMathOperation(num2) ? safeSolve(num2) : num2;

  return calculate(op, n1, n2);
};

const invert = (op: Op): Op => {
  if (op === Op.Multiplication) {
    return Op.Division;
  } else if (op === Op.Division) {
    return Op.Multiplication;
  } else if (op === Op.Sum) {
    return Op.Sub;
  } else {
    return Op.Sum;
  }
};

const calculateInvert = (
  op: Op,
  num1: number,
  num2: number,
  isLeft: boolean
): number => {
  if (op === Op.Sub) {
    return isLeft ? (num2 - num1) * -1 : num2 + num1;
  }
  if (op === Op.Sum) {
    return num2 - num1;
  }
  if (op === Op.Multiplication) {
    return num2 / num1;
  }
  if (op === Op.Division) {
    return isLeft ? num1 / num2 : num2 * num1;
  }

  return 0;
};

const solveFormula = (
  { op, num1, num2 }: MathOperation,
  result: number | "x"
): number => {
  if (
    typeof num1 === "number" &&
    typeof num2 === "number"
  ) {
    const res = calculate(op, num1, num2);
    return res;
  }
  if (typeof num1 === "number" && num2 === "x") {
    return calculateInvert(
      op,
      result as number,
      num1,
      true
    );
  }

  if (typeof num2 === "number" && num1 === "x") {
    return calculateInvert(
      op,
      result as number,
      num2,
      false
    );
  }

  if (isMathOperation(num1) && num2 === "x") {
    return solveFormula(
      {
        op: invert(op),
        num2: num1,
        num1: result,
      },
      "x"
    );
  }

  if (isMathOperation(num2) && num1 === "x") {
    return solveFormula(
      {
        op: invert(op),
        num2: num2,
        num1: result,
      },
      "x"
    );
  }

  if (isMathOperation(num1) && typeof num2 === "number") {
    if (result === "x") {
      return calculate(op, safeSolve(num1), num2);
    }
    return solveFormula(
      num1,
      calculateInvert(op, num2, result, false)
    );
  }

  if (isMathOperation(num2) && typeof num1 === "number") {
    if (result === "x") {
      return calculate(op, num1, safeSolve(num2));
    }
    return solveFormula(
      num2,
      calculateInvert(op, num1, result, true)
    );
  }

  // don't think this ever happens
  if (isMathOperation(num1) && isMathOperation(num2)) {
    if (result === "x") {
      return calculate(
        op,
        safeSolve(num1),
        safeSolve(num2)
      );
    }
    try {
      const n1 = safeSolve(num1);
      return solveFormula(
        num2,
        calculateInvert(op, n1, result, true)
      );
    } catch (e) {
      const n2 = safeSolve(num2);
      return solveFormula(
        num1,
        calculateInvert(op, n2, result, false)
      );
    }
  }

  return 0;
};

export const day21: Exercise = async () => {
  const input = (await getPuzzleInput(21)).split("\n");

  const monkies: Monkey[] = [];

  for (const monk of input) {
    const match =
      /(?<monkey>[^:]*):\s((?<monkeyop1>[^\s]*)\s(?<op>[+*/\-])\s(?<monkeyop2>.*)|(?<numberyell>\d*))/g.exec(
        monk
      );

    if (match?.groups?.monkey) {
      if (match.groups.numberyell) {
        monkies.push({
          name: match.groups.monkey,
          job: {
            value: Number(match.groups.numberyell),
          },
        });
      } else {
        monkies.push({
          name: match.groups.monkey,
          job: {
            monkeh1: match.groups.monkeyop1,
            monkeh2: match.groups.monkeyop2,
            op: match.groups.op as Op,
          },
        });
      }
    }
  }

  const cache: Record<string, MathOperation> = {};

  const part1 = yellMrMonkeh(monkies, "root");

  const root = monkies.find((m) => m.name === "root");

  const root1 = yellMrMonkehWithVars(
    monkies,
    (root?.job as MonkeyOp).monkeh1,
    cache
  );
  const root2 = yellMrMonkehWithVars(
    monkies,
    (root?.job as MonkeyOp).monkeh2,
    cache
  );

  const part2 = solveFormula(
    root1 as MathOperation,
    Number(root2)
  );

  return {
    part1,
    part2,
  };
};

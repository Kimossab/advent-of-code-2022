import * as dotenv from "dotenv";
import { createInterface } from "readline/promises";
dotenv.config();
import { getDays } from "./helpers";

const dayMap = getDays();

const days = Object.keys(dayMap)
  .map(Number)
  .sort((a, b) => a - b);

const solveProblem = async (day: number) => {
  const dName = dayMap[day];
  const dayModule = await import(`./${dName}/${dName}.ts`);

  if (!dayModule || !dayModule[dName]) {
    throw new Error(
      `${dName} needs to have a function ${dName}`
    );
  }

  process.stdout.write(`Day ${day}: `);
  console.time(` `);

  const { part1, part2 } = await (
    dayModule[dName] as Exercise
  )();

  process.stdout.write(
    `Part 1 (${part1}) | Part 2 (${part2})`
  );
  console.timeEnd(` `);
};

const main = async () => {
  const rl = createInterface(process.stdin, process.stdout);

  let dayNumber = Number.NaN;
  do {
    const day = await rl.question(
      `Pick a day (${days[0]}-${
        days[days.length - 1]
      }). Pick 0 if you want to run all puzzles: `
    );
    dayNumber = Number(day);
  } while (
    isNaN(dayNumber) ||
    dayNumber < 0 ||
    dayNumber > days.length
  );

  if (dayNumber === 0) {
    for (const day of days) {
      await solveProblem(day);
    }
  } else {
    await solveProblem(dayNumber);
  }

  console.log("Finished");
};

main();

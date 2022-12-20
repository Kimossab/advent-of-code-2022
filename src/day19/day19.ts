// I admit defeat on this one
//
// I needed to read a few comments and look at a few lines of code from other people's solutions to figure out how to solve this
// I couldn't figure out some small optimizations (and definitely not the **cheat**)
// for this I can't claim this code as mine, it's just a bit of a frankenstein's monster with a few bolts of my own doing
// https://www.reddit.com/r/adventofcode/comments/zpihwi/2022_day_19_solutions/

import { getPuzzleInput } from "../getPuzzleInput";

// =============== ore  clay    obsidian  geode
type RobotCost = [number, number, number, number];
type Blueprint = [
  RobotCost,
  RobotCost,
  RobotCost,
  RobotCost
];
type Inventory = [number, number, number, number];
type RobotList = [number, number, number, number];

interface State {
  elapsedTime: number;
  resources: Inventory;
  robots: RobotList;
  cheat: number;
}

// Thanks to stevie-o-read-it for this strange yet ingenious cheat for this solution
// https://www.reddit.com/r/adventofcode/comments/zpihwi/comment/j0wp26v/?utm_source=share&utm_medium=web2x&context=3
const cheat = (
  state: State,
  maxTime: number,
  blueprint: Blueprint
): number => {
  let newRes = [...state.resources];
  const newBot = [...state.robots];
  for (let i = state.elapsedTime; i <= maxTime + 1; i++) {
    const nnRes = [
      newRes[0],
      newRes[1] + newBot[1],
      newRes[2] + newBot[2],
      newRes[3] + newBot[3],
    ];

    newBot[1]++;
    if (newRes[1] >= blueprint[2][1]) {
      nnRes[1] -= blueprint[2][1];
      newBot[2]++;
    }
    if (newRes[2] >= blueprint[3][2]) {
      nnRes[2] -= blueprint[2][1];
      newBot[3]++;
    }

    newRes = nnRes;
  }

  return newRes[3];
};

const maxGeode = (
  blueprint: Blueprint,
  maxTime: number
): number => {
  const stateList: State[] = [
    {
      elapsedTime: 0,
      resources: [0, 0, 0, 0],
      robots: [1, 0, 0, 0],
      cheat: 99,
    },
  ];

  const maxRobots = [
    Math.max(
      blueprint[0][0],
      blueprint[1][0],
      blueprint[2][0],
      blueprint[3][0]
    ),
    Math.max(
      blueprint[0][1],
      blueprint[1][1],
      blueprint[2][1],
      blueprint[3][1]
    ),
    Math.max(
      blueprint[0][2],
      blueprint[1][2],
      blueprint[2][2],
      blueprint[3][2]
    ),
    99,
  ];

  let max = 0;
  let state: State | undefined;
  while ((state = stateList.shift())) {
    const c = cheat(state, maxTime, blueprint);
    if (c < max) {
      continue;
    }
    for (let robot = 0; robot < 4; robot++) {
      if (state.robots[robot] >= maxRobots[robot]) {
        continue;
      }
      let maxWaitTime = 0;
      for (let resource = 0; resource < 4; resource++) {
        //enough resources
        if (
          blueprint[robot][resource] <=
          state.resources[resource]
        ) {
          continue;
        }
        // no robot = never getting resources
        if (!state.robots[resource]) {
          maxWaitTime = maxTime + 1;
          break;
        }

        const waitTime = Math.ceil(
          (blueprint[robot][resource] -
            state.resources[resource]) /
            state.robots[resource]
        );
        if (waitTime > maxWaitTime) {
          maxWaitTime = waitTime;
        }
      }

      const newElapsed =
        state.elapsedTime + maxWaitTime + 1;

      const newResources: Inventory = [
        state.resources[0] +
          state.robots[0] * (maxWaitTime + 1) -
          blueprint[robot][0],
        state.resources[1] +
          state.robots[1] * (maxWaitTime + 1) -
          blueprint[robot][1],
        state.resources[2] +
          state.robots[2] * (maxWaitTime + 1) -
          blueprint[robot][2],
        state.resources[3] +
          state.robots[3] * (maxWaitTime + 1) -
          blueprint[robot][3],
      ];
      if (newElapsed >= maxTime) {
        const c =
          state.resources[3] +
          state.robots[3] * (maxTime - state.elapsedTime);
        if (c > max) {
          max = c;
        }
        continue;
      }

      const newRobots: RobotList = [...state.robots];
      newRobots[robot]++;

      stateList.push({
        elapsedTime: newElapsed,
        resources: newResources,
        robots: newRobots,
        cheat: cheat(
          {
            elapsedTime: newElapsed,
            resources: newResources,
            robots: newRobots,
            cheat: 0,
          },
          maxTime,
          blueprint
        ),
      });
    }

    stateList.sort((a, b) => {
      if (b.robots[3] > a.robots[3]) {
        return 1;
      } else if (a.robots[3] > b.robots[3]) {
        return -1;
      }

      if (b.elapsedTime > a.elapsedTime) {
        return 1;
      } else if (a.elapsedTime > b.elapsedTime) {
        return -1;
      }
      return b.cheat - a.cheat;
    });
  }
  return max;
};

export const day19: Exercise = async () => {
  const input = (await getPuzzleInput(19)).split("\n");

  const blueprintList: Blueprint[] = [];

  for (const line of input) {
    const match =
      /[^\d]*(?<id>\d*).*ore[^\d]*(?<oreore>\d)\sore.*clay[^\d]*(?<clayore>\d)\sore.*obsidian[^\d]*(?<obsidianore>\d)\sore[^\d]*(?<obsidianclay>\d*)\sclay.*geode[^\d]*(?<geodeore>\d)\sore[^\d]*(?<geodeobsidian>\d*)\sobsidian/gm.exec(
        line
      );

    if (match?.groups?.id) {
      const id = Number(match.groups.id);
      const oreore = Number(match.groups.oreore);
      const clayore = Number(match.groups.clayore);
      const obsidianore = Number(match.groups.obsidianore);
      const obsidianclay = Number(
        match.groups.obsidianclay
      );
      const geodeore = Number(match.groups.geodeore);
      const geodeobsidian = Number(
        match.groups.geodeobsidian
      );

      blueprintList.push([
        [oreore, 0, 0, 0],
        [clayore, 0, 0, 0],
        [obsidianore, obsidianclay, 0, 0],
        [geodeore, 0, geodeobsidian, 0],
      ]);
    }
  }

  let part2 = 1;
  let part1 = 0;

  for (let i = 0; i < blueprintList.length; i++) {
    const geodes = maxGeode(blueprintList[i], 24);

    part1 += (i + 1) * geodes;
  }
  for (let i = 0; i < 3; i++) {
    const geodes = maxGeode(blueprintList[i], 32);

    part2 *= geodes;
  }
  return {
    part1,
    part2,
  };
};

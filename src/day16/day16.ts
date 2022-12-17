// For the love of all that is holy and specially your sanity....
// DO NOT READ ANY FURTHER. PLEASE GO AWAY, BURN ALL OF THIS TO THE GROUND AND RUN AWAY
// ONLY GOD AND I KNEW HOW THIS WORKS WHEN I WROTE THIS, NOW NOT EVEN GOD CAN UNDERSTAND THIS MESS

import { getPuzzleInput } from "../getPuzzleInput";

interface Valve {
  pressureRate: number;
  connectedTo: string[];
}

const getShortestPath = (
  valves: Record<string, Valve>,
  start: string,
  ending: string,
  shortestPaths: Record<string, number>,
  passed: string[] = []
): number => {
  if (start === ending) {
    return 0;
  }
  if (shortestPaths[`${start}${ending}`]) {
    return shortestPaths[`${start}${ending}`];
  }

  if (valves[start].connectedTo.includes(ending)) {
    return 1;
  }

  let shortest = Infinity;

  const v = valves[start].connectedTo.filter(
    (v) => !passed.includes(v)
  );
  const newPassed = [...passed, start];

  for (const connected of v) {
    const s =
      getShortestPath(
        valves,
        connected,
        ending,
        shortestPaths,
        newPassed
      ) + 1;
    if (s !== 0 && s < shortest) {
      shortest = s;
    }

    if (shortest === 2) {
      break;
    }
  }
  return shortest;
};

const buildShortestPaths = (
  valves: Record<string, Valve>
): Record<string, number> => {
  const shortestPaths: Record<string, number> = {};
  const keys = Object.keys(valves);
  for (let i = 0; i < keys.length - 1; i++) {
    for (let e = i + 1; e < keys.length; e++) {
      const l = getShortestPath(
        valves,
        keys[i],
        keys[e],
        shortestPaths
      );
      shortestPaths[`${keys[i]}${keys[e]}`] = l;
      shortestPaths[`${keys[e]}${keys[i]}`] = l;
    }
  }
  return shortestPaths;
};

const calculateMaxPressure = (
  valves: Record<string, Valve>,
  shortestPaths: Record<string, number>,
  timeRemaining: number,
  availableValves: string[],
  currentValve: string
): number => {
  if (timeRemaining <= 0) {
    return 0;
  }
  if (!availableValves.length) {
    return (
      valves[currentValve].pressureRate * timeRemaining
    );
  }
  let maxPress = 0;
  for (let i = 0; i < availableValves.length; i++) {
    const newTR =
      timeRemaining -
      shortestPaths[`${currentValve}${availableValves[i]}`];

    const press = calculateMaxPressure(
      valves,
      shortestPaths,
      newTR - 1,
      availableValves.filter((_, idx) => idx !== i),
      availableValves[i]
    );

    if (press > maxPress) {
      maxPress = press;
    }
  }

  return (
    maxPress +
    valves[currentValve].pressureRate * timeRemaining
  );
};

const calculateMaxPressurePart2 = (
  valves: Record<string, Valve>,
  shortestPaths: Record<string, number>,
  timeRemaining: number,
  availableValves: string[],
  currentValve1: [number, string],
  currentValve2: [number, string]
): [number, string[], string[]] => {
  if (timeRemaining <= 0) {
    return [0, [], []];
  }

  let curPress = 0;
  const hasW1Arrived =
    currentValve1[0] === 0 || currentValve1[0] === Infinity;
  const hasW2Arrived =
    currentValve2[0] === 0 || currentValve2[0] === Infinity;

  if (hasW1Arrived && currentValve1[0] !== Infinity) {
    curPress +=
      valves[currentValve1[1]].pressureRate * timeRemaining;
  }
  if (hasW2Arrived && currentValve2[0] !== Infinity) {
    curPress +=
      valves[currentValve2[1]].pressureRate * timeRemaining;
  }

  if (availableValves.length === 0) {
    if (hasW1Arrived && hasW2Arrived) {
      return [
        curPress,
        [currentValve1[1]],
        [currentValve2[1]],
      ];
    }

    if (hasW1Arrived) {
      const [pressure, path1, path2] =
        calculateMaxPressurePart2(
          valves,
          shortestPaths,
          timeRemaining - currentValve2[0],
          [],
          [Infinity, currentValve1[1]],
          [0, currentValve2[1]]
        );

      return [pressure + curPress, path1, path2];
    }

    const [pressure, path1, path2] =
      calculateMaxPressurePart2(
        valves,
        shortestPaths,
        timeRemaining - currentValve1[0],
        [],
        [0, currentValve1[1]],
        [Infinity, currentValve2[1]]
      );
    return [pressure + curPress, path1, path2];
  }

  let maxPress = 0;
  if (hasW1Arrived && hasW2Arrived) {
    let max1 = -1;
    let max2 = -1;
    let maxPath1: string[] = [];
    let maxPath2: string[] = [];
    for (let i = 0; i < availableValves.length; i++) {
      if (availableValves.length > 1) {
        for (
          let j = i + 1;
          j < availableValves.length;
          j++
        ) {
          const tRI1 =
            timeRemaining -
            shortestPaths[
              `${currentValve1[1]}${availableValves[i]}`
            ] -
            1;
          const tRJ1 =
            timeRemaining -
            shortestPaths[
              `${currentValve1[1]}${availableValves[j]}`
            ] -
            1;
          const tRI2 =
            timeRemaining -
            shortestPaths[
              `${currentValve2[1]}${availableValves[i]}`
            ] -
            1;
          const tRJ2 =
            timeRemaining -
            shortestPaths[
              `${currentValve2[1]}${availableValves[j]}`
            ] -
            1;

          const tR1 = Math.max(tRI1, tRJ2);
          const tR2 = Math.max(tRJ1, tRI2);
          const [press1, pathA, pathB] =
            calculateMaxPressurePart2(
              valves,
              shortestPaths,
              tR1,
              availableValves.filter(
                (_, idx) => idx !== i && idx !== j
              ),
              [tR1 - tRI1, availableValves[i]],
              [tR1 - tRJ2, availableValves[j]]
            );
          const [press2, pathAA, pathBB] =
            calculateMaxPressurePart2(
              valves,
              shortestPaths,
              tR2,
              availableValves.filter(
                (_, idx) => idx !== i && idx !== j
              ),
              [tR2 - tRJ1, availableValves[j]],
              [tR2 - tRI2, availableValves[i]]
            );

          if (press1 >= press2 && press1 > maxPress) {
            maxPress = press1;
            max1 = i;
            max2 = j;
            maxPath1 = pathA;
            maxPath2 = pathB;
          }
          if (press2 > press1 && press2 > maxPress) {
            maxPress = press2;
            max1 = j;
            max2 = i;
            maxPath1 = pathAA;
            maxPath2 = pathBB;
          }
        }
      } else {
        const tRI1 =
          timeRemaining -
          shortestPaths[
            `${currentValve1[1]}${availableValves[i]}`
          ] -
          1;
        const tRI2 =
          timeRemaining -
          shortestPaths[
            `${currentValve2[1]}${availableValves[i]}`
          ] -
          1;

        const [press1, pathA, pathB] =
          calculateMaxPressurePart2(
            valves,
            shortestPaths,
            tRI1,
            availableValves.filter((_, idx) => idx !== i),
            [0, availableValves[i]],
            [Infinity, currentValve2[1]]
          );
        const [press2, pathAA, pathBB] =
          calculateMaxPressurePart2(
            valves,
            shortestPaths,
            tRI2,
            availableValves.filter((_, idx) => idx !== i),
            [Infinity, currentValve1[1]],
            [0, availableValves[i]]
          );

        if (press1 >= press2 && press1 > maxPress) {
          maxPress = press1;
          max1 = i;
          max2 = -1;
          maxPath1 = pathA;
          maxPath2 = pathB;
        }
        if (press2 > press1 && press2 > maxPress) {
          maxPress = press2;
          max1 = -1;
          max2 = i;
          maxPath1 = pathAA;
          maxPath2 = pathBB;
        }
      }
    }

    maxPath1.unshift(availableValves[max1]);
    maxPath2.unshift(availableValves[max2]);

    return [maxPress + curPress, maxPath1, maxPath2];
  }
  if (hasW1Arrived) {
    let max1 = -1;
    let maxPath1: string[] = [];
    let maxPath2: string[] = [];
    for (let i = 0; i < availableValves.length; i++) {
      const tR1 =
        timeRemaining -
        shortestPaths[
          `${currentValve1[1]}${availableValves[i]}`
        ] -
        1;

      const tR2 = timeRemaining - currentValve2[0];
      const tR = Math.max(tR1, tR2);

      const [press, path1, path2] =
        calculateMaxPressurePart2(
          valves,
          shortestPaths,
          tR,
          availableValves.filter((_, idx) => idx !== i),
          [tR - tR1, availableValves[i]],
          [tR - tR2, currentValve2[1]]
        );
      if (press > maxPress) {
        maxPress = press;
        max1 = i;
        maxPath1 = path1;
      }
      maxPath2 = path2;
    }

    maxPath1.unshift(
      availableValves[max1] || currentValve1[1]
    );

    return [maxPress + curPress, maxPath1, maxPath2];
  }
  if (hasW2Arrived) {
    let max2 = -1;
    let maxPath1: string[] = [];
    let maxPath2: string[] = [];
    for (let i = 0; i < availableValves.length; i++) {
      const tR2 =
        timeRemaining -
        shortestPaths[
          `${currentValve2[1]}${availableValves[i]}`
        ] -
        1;

      const tR1 = timeRemaining - currentValve1[0];
      const tR = Math.max(tR1, tR2);

      const [press, path1, path2] =
        calculateMaxPressurePart2(
          valves,
          shortestPaths,
          tR,
          availableValves.filter((_, idx) => idx !== i),
          [tR - tR1, currentValve1[1]],
          [tR - tR2, availableValves[i]]
        );
      if (press > maxPress) {
        maxPress = press;
        max2 = i;
        maxPath2 = path2;
      }
      maxPath1 = path1;
    }
    maxPath2.unshift(
      availableValves[max2] || currentValve2[1]
    );

    return [maxPress + curPress, maxPath1, maxPath2];
  }
  return [0, [], []];
};

export const day16: Exercise = async () => {
  const input = (await getPuzzleInput(16)).split("\n");

  const valves: Record<string, Valve> = {};

  for (const line of input) {
    const match =
      /Valve\s(?<valve>[^\s]*).*rate=(?<rate>\d*).*valves?\s(?<connected>.*)/gm.exec(
        line
      );

    if (match?.groups?.valve) {
      const valve = match.groups.valve;
      const pressureRate = Number(match.groups.rate);
      const connectedTo =
        match.groups.connected.split(", ");
      valves[valve] = {
        pressureRate,
        connectedTo,
      };
    }
  }

  const shortestPaths = buildShortestPaths(valves);

  const valvesWithPressure = Object.keys(valves).filter(
    (k) => valves[k].pressureRate > 0
  );

  const part1 = calculateMaxPressure(
    valves,
    shortestPaths,
    30,
    valvesWithPressure,
    "AA"
  );
  const [part2] = calculateMaxPressurePart2(
    valves,
    shortestPaths,
    26,
    valvesWithPressure,
    [0, "AA"],
    [0, "AA"]
  );

  return {
    part1,
    part2,
  };
};

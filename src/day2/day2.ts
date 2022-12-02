import { getPuzzleInput } from "../getPuzzleInput";

enum OpponentPlay {
  Rock = "A",
  Paper = "B",
  Scissors = "C",
}
enum MyPlay {
  Rock = "X",
  Paper = "Y",
  Scissors = "Z",
}
const Points = {
  [MyPlay.Rock]: 1,
  [MyPlay.Paper]: 2,
  [MyPlay.Scissors]: 3,
  [OpponentPlay.Rock]: 1,
  [OpponentPlay.Paper]: 2,
  [OpponentPlay.Scissors]: 3,
};

const Counters = {
  [OpponentPlay.Rock]: OpponentPlay.Paper,
  [OpponentPlay.Paper]: OpponentPlay.Scissors,
  [OpponentPlay.Scissors]: OpponentPlay.Rock,
};

const Countered = {
  [OpponentPlay.Rock]: OpponentPlay.Scissors,
  [OpponentPlay.Paper]: OpponentPlay.Rock,
  [OpponentPlay.Scissors]: OpponentPlay.Paper,
};

const PlayPoints = {
  [`${OpponentPlay.Rock}${MyPlay.Rock}`]: 3,
  [`${OpponentPlay.Rock}${MyPlay.Paper}`]: 6,
  [`${OpponentPlay.Rock}${MyPlay.Scissors}`]: 0,
  [`${OpponentPlay.Paper}${MyPlay.Rock}`]: 0,
  [`${OpponentPlay.Paper}${MyPlay.Paper}`]: 3,
  [`${OpponentPlay.Paper}${MyPlay.Scissors}`]: 6,
  [`${OpponentPlay.Scissors}${MyPlay.Rock}`]: 6,
  [`${OpponentPlay.Scissors}${MyPlay.Paper}`]: 0,
  [`${OpponentPlay.Scissors}${MyPlay.Scissors}`]: 3,
};

export const day2: Exercise = async () => {
  const input = (await getPuzzleInput(2)).split("\n");
  let part1 = 0;
  let part2 = 0;

  for (const play of input) {
    if (play === "") {
      break;
    }
    const [they, me] = play.split(" ") as [
      OpponentPlay,
      MyPlay
    ];

    part1 += Points[me] + PlayPoints[`${they}${me}`];

    if (me === "X") {
      part2 += Points[Countered[they]];
    } else if (me === "Y") {
      part2 += Points[they] + 3;
    } else if (me === "Z") {
      part2 += Points[Counters[they]] + 6;
    }
  }

  return { part1, part2 };
};

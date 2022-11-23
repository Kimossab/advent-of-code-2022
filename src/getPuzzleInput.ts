import axios from "axios";
import { readFileSync, writeFileSync } from "fs";

export const getPuzzleInput = async (
  day: number,
  isJson = false
): Promise<string> => {
  const filePath = `./cache/${day}.txt`;
  try {
    const data = readFileSync(filePath);
    return data.toString();
  } catch (e) {
    console.log("downloading");
    const result = (
      await axios({
        method: "get",
        url: `https://adventofcode.com/${process.env.YEAR}/day/${day}/input`,
        headers: {
          Cookie: `session=${process.env.SESSION_ID}`,
        },
      })
    ).data;

    const data = isJson
      ? JSON.stringify(result)
      : result.toString();

    writeFileSync(filePath, data, { flag: "w+" });
    return data;
  }
};

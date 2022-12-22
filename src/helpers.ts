import { readdirSync } from "fs";

export const getDays = () => {
  return readdirSync("./src", { withFileTypes: true })
    .filter(
      (dirent) =>
        dirent.isDirectory() &&
        dirent.name.startsWith("day")
    )
    .reduce<Record<number, string>>((list, dirent) => {
      list[Number(dirent.name.slice(3))] = dirent.name;
      return list;
    }, {});
};

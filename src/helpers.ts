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

export const timeSince = (
  start: number,
  end: number
): string => {
  const milliseconds = end - start;
  const seconds = Math.floor(milliseconds / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return `${interval} years - ${milliseconds}ms`;
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return `${interval} months - ${milliseconds}ms`;
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return `${interval} days - ${milliseconds}ms`;
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return `${interval} hours - ${milliseconds}ms`;
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return `${interval} minutes - ${milliseconds}ms`;
  }
  interval = Math.floor(seconds);
  if (interval > 1) {
    return `${interval} seconds - ${milliseconds}ms`;
  }

  return `${milliseconds} milliseconds`;
};

import { getPuzzleInput } from "../getPuzzleInput";

interface File {
  type: "file";
  name: string;
  size: number;
}

interface Directory {
  type: "dir";
  name: string;
  content: (Directory | File)[];
}

interface Instruction {
  command: "cd" | "ls";
  params: string[] | undefined;
  output: string[];
}

const getOrCreateDirectory = (
  fileSystem: Directory,
  path: string[]
): Directory => {
  let currentDirectory = fileSystem;
  for (const dir of path) {
    const dirLookup = currentDirectory.content.find(
      (d) => d.type === "dir" && d.name === dir
    ) as Directory;
    if (!dirLookup) {
      const newDir: Directory = {
        type: "dir",
        name: dir,
        content: [],
      };
      currentDirectory.content.push(newDir);
      currentDirectory = newDir;
    } else {
      currentDirectory = dirLookup;
    }
  }

  return currentDirectory;
};

const splitInstructions = (
  lines: string[]
): Instruction[] => {
  const instructions: Instruction[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === "") {
      continue;
    }

    const match =
      /\$\s(?<command>[^\s]*)(\s(?<params>.*))?/g.exec(
        lines[i]
      );

    if (match && match.groups?.command) {
      const output: string[] = [];
      while (
        i + 1 < lines.length &&
        !lines[i + 1].startsWith("$")
      ) {
        output.push(lines[++i]);
      }

      instructions.push({
        command: match.groups
          .command as Instruction["command"],
        params: match.groups.params
          ? match.groups.params.split(" ")
          : undefined,
        output,
      });
    }
  }
  return instructions;
};

const logPretty = (directory: Directory, tab = 0) => {
  let dirString = "";
  for (let i = 0; i < tab; i++) {
    dirString += "\t";
  }
  console.log(`${dirString}- ${directory.name} (dir)`);

  const newTab = tab + 1;
  dirString += "\t";

  for (const content of directory.content) {
    if (content.type === "file") {
      console.log(
        `${dirString}- ${content.name} (file, size=${content.size})`
      );
    } else {
      logPretty(content, newTab);
    }
  }
};

const getFolderSizes = (
  directory: Directory,
  sizes: Record<string, number>,
  path: string[] = []
): number => {
  let size = 0;
  for (const content of directory.content) {
    if (content.type === "file") {
      size += content.size;
    } else {
      size += getFolderSizes(content, sizes, [
        ...path,
        directory.name,
      ]);
    }
  }

  sizes[`${path.join("/")}/${directory.name}`] = size;

  return size;
};

export const day7: Exercise = async () => {
  const input = (await getPuzzleInput(7)).split("\n");

  const fileSystem: Directory = {
    type: "dir",
    name: "/",
    content: [],
  };

  let currentDirectory: Directory = fileSystem;

  const currentPath: string[] = [];

  const instructions = splitInstructions(input);
  instructions.shift();

  for (const instruction of instructions) {
    switch (instruction.command) {
      case "cd":
        if (instruction.params![0] === "..") {
          currentPath.pop();
        } else {
          currentPath.push(instruction.params![0]);
          currentDirectory = getOrCreateDirectory(
            fileSystem,
            currentPath
          );
        }
        break;
      case "ls":
        for (const outLine of instruction.output) {
          if (outLine.startsWith("dir")) {
            const dirName = outLine.split(" ")[1];
            const dir = currentDirectory.content.find(
              (d) => d.type === "dir" && d.name === dirName
            );
            if (!dir) {
              currentDirectory.content.push({
                type: "dir",
                name: dirName,
                content: [],
              });
            }
          } else {
            const fileName = outLine.split(" ")[1];
            const fileSize = Number(outLine.split(" ")[0]);
            const file = currentDirectory.content.find(
              (f) =>
                f.type === "file" && f.name === fileName
            );
            if (!file) {
              currentDirectory.content.push({
                type: "file",
                name: fileName,
                size: fileSize,
              });
            }
          }
        }
        break;
    }
  }
  const sizes: Record<string, number> = {};

  getFolderSizes(fileSystem, sizes);

  const part1 = Object.values(sizes).reduce((acc, cur) => {
    if (cur <= 100000) {
      return acc + cur;
    }
    return acc;
  }, 0);

  const freeSpace = 70000000 - sizes["//"];
  const spaceFreeNeeded = 30000000 - freeSpace;

  const part2 = Object.values(sizes).reduce((acc, cur) => {
    if (cur <= acc && cur >= spaceFreeNeeded) {
      return cur;
    }
    return acc;
  }, 70000000);

  return { part1, part2 };
};

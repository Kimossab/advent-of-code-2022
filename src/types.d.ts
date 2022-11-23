type Exercise = (...args: any[]) => Promise<{
  part1: number | string | undefined;
  part2: number | string | undefined;
}>;

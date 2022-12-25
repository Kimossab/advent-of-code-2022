# advent-of-code-~~2021~~ 2022
My stupid solutions to the AoC of ~~2021~~ 2022

These are all my solutions for the AoC of ~~2021~~ 2022 in typescript

## How to run
If you want to run this (I don't know why you would, there's better solutions out there) you can follow the same way as every other TS project ever:

Note: needless to say, but I'll say it anyway, you need [Node.js](https://nodejs.org/en/)

Install packages:
```
npm i
```

To run development locally (will auto restart the program on file updates):
```
npm run dev
```

To build (this will build into javascript and then you can run the resulting js file):
```
npm run build
```

Also needless to say you can use `yarn` instead of `npm` if that's what you fancy, but you might want to delete `package-lock.json` first.

The only other thing to note is that if you want to download the input of your puzzles automatically you need to create a `.env` and add your session id and the year of the puzzle (obviously it's 2022, no other year will give you correct results, but this saves me trouble for next year). Just like in the `.env.example`  
If you don't want to set this up, look in the cache section that coincidentally is the next one.

The session id value you can find if you open dev tools in the advent of code website, go to the cookies section and find the value for the `session` cookie. Copy it and paste it in the `.env` file and you're good to go.

### Cache

The cache folder is where all the inputs live, if you set up the `.env` file like explained above you don't need to worry, they'll be downloaded to this folder. If you don't want to do that, you can download the inputs from the puzzle and save it as a `txt` file with the number of the day as the file name (example: `1.txt` for the day 1 puzzle input).

### For the record:
<details open>
  <summary>All the puzzle results</summary>
  <p>
    
```
Day 1: Part 1 (70369) | Part 2 (203002) : 1.258ms
Day 2: Part 1 (10595) | Part 2 (9541) : 3.408ms
Day 3: Part 1 (7785) | Part 2 (2633) : 3.284ms
Day 4: Part 1 (536) | Part 2 (845) : 1.787ms
Day 5: Part 1 (SBPQRSCDF) | Part 2 (RGLVRCQSB) : 2.561ms
Day 6: Part 1 (1155) | Part 2 (2789) : 1.256ms
Day 7: Part 1 (1517599) | Part 2 (2481982) : 4.116ms
Day 8: Part 1 (1803) | Part 2 (268912) : 28.648ms
Day 9: Part 1 (6406) | Part 2 (2643) : 192.232ms
Day 10:
###..###....##..##..####..##...##..###.#
#..#.#..#....#.#..#....#.#..#.#..#.#..##
###..#..#....#.#..#...#..#....#..#.#..#.
#..#.###.....#.####..#...#.##.####.###..
#..#.#....#..#.#..#.#....#..#.#..#.#....
###..#.....##..#..#.####..###.#..#.#....
Part 1 (15140) | Part 2 (0) : 8.727ms
Day 11: Part 1 (54253) | Part 2 (13119526120) : 33.425ms
Day 12: Part 1 (380) | Part 2 (375) : 41.796s
Day 13: Part 1 (5529) | Part 2 (27690) : 8.951ms
Day 14: Part 1 (683) | Part 2 (28821) : 1.571s
Day 15: Part 1 (4961647) | Part 2 (12274327017867) : 5.095s
Day 16: Part 1 (1651) | Part 2 (1707) : 5.92ms
Day 17: Part 1 (3067) | Part 2 (1514369501484) : 64.77ms
Day 18: Part 1 (4608) | Part 2 (2652) : 920.489ms
Day 19: Part 1 (1092) | Part 2 (3542) : 16.939s
Day 20: Part 1 (4914) | Part 2 (7973051839072) : 103.773ms
Day 21: Part 1 (331319379445180) | Part 2 (3715799488132) : 132.457ms
Day 22: Part 1 (76332) | Part 2 (144012) : 22.459ms
Day 23: Part 1 (4123) | Part 2 (1029) : 5.139s
Day 24: Part 1 (230) | Part 2 (713) : 4.259s
Day 25: Part 1 (2=0=02-0----2-=02-10) | Part 2 () : 1.784ms
```
  </p>
</details>

<details>
  <summary>My personal stats</summary>
  <p>
  
```
      --------Part 1--------   --------Part 2--------
Day       Time   Rank  Score       Time   Rank  Score
 25   16:39:42  10946      0   16:40:08   7088      0
 24   13:19:48   7362      0   14:10:01   7214      0
 23       >24h  12175      0       >24h  11938      0
 22   18:42:46  12273      0       >24h   8855      0
 21   20:30:10  17145      0   21:47:26  14398      0
 20       >24h  15329      0       >24h  14538      0
 19   19:31:18   8348      0   19:37:27   7218      0
 18   10:24:23  13902      0   13:29:04  11452      0
 17   11:52:27  10066      0   14:23:59   6781      0
 16   13:22:28   9737      0   20:25:37   8443      0
 15   08:40:51  16766      0   10:26:22  12557      0
 14   07:59:10  17364      0   17:57:47  27126      0
 13   07:24:03  16276      0   07:27:37  15145      0
 12   12:55:56  24853      0   14:34:53  25914      0
 11   19:28:15  45199      0   20:17:29  37910      0
 10       >24h  59097      0       >24h  55479      0
  9   09:59:54  36705      0   10:22:00  28195      0
  8   09:39:07  43906      0   10:38:50  39169      0
  7   11:35:50  42229      0   11:39:15  40055      0
  6   10:07:52  68493      0   10:11:01  67237      0
  5   10:18:33  55209      0   10:22:13  52987      0
  4   10:28:07  68874      0   10:30:47  66532      0
  3   09:26:06  62026      0   09:33:20  56062      0
  2   09:51:08  78291      0   09:58:38  72520      0
  1   09:49:05  69007      0   09:51:44  65189      0
```
  </p>
</details>

###### Disclaimer: I'm only writing this so the code page is not completely empty, this makes it more pleasing even if it's completely useless otherwise. ~~not like anyone is reading this anyway, but if you are have a nice day~~

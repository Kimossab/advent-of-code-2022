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
Day 1: Part 1 (70369) | Part 2 (203002) [1 milliseconds]
Day 2: Part 1 (10595) | Part 2 (9541) [4 milliseconds]
Day 3: Part 1 (7785) | Part 2 (2633) [2 milliseconds]
Day 4: Part 1 (536) | Part 2 (845) [1 milliseconds]
Day 5: Part 1 (SBPQRSCDF) | Part 2 (RGLVRCQSB) [2 milliseconds]
```
  </p>
</details>

<details>
  <summary>My personal stats</summary>
  <p>
    
```
      --------Part 1--------   --------Part 2--------
Day       Time   Rank  Score       Time   Rank  Score
  5   10:18:33  55209      0   10:22:13  52987      0
  4   10:28:07  68874      0   10:30:47  66532      0
  3   09:26:06  62026      0   09:33:20  56062      0
  2   09:51:08  78291      0   09:58:38  72520      0
  1   09:49:05  69007      0   09:51:44  65189      0
```
  </p>
</details>

###### Disclaimer: I'm only writting this so the code page is not completely empty, this makes it more pleasing even if it's completely useless otherwise. ~~not like anyone is reading this anyway, but if you are have a nice day~~

import * as YearMethods from './YearExports';

const fs = require('fs');

const main = (day: string, year: string) => {
  console.log(year, '-', day)
  const inputFile = `${day}Input.txt`;
  const inputPath = `./${year}/Inputs/${inputFile}`
  const fileInput = fs.readFileSync(inputPath, 'utf8');
  const input = fileInput.split(/\n+/);
  // console.log(inputFile)
  // console.log(input);
  const startTime = new Date();
  YearMethods[`Year${year}`][day](input)
  const endTime = new Date();
  console.log(`Algorithm Run time: ${endTime.valueOf() - startTime.valueOf()}ms`);
}

main("Day1", "2021");
main("Day2", "2021");
main("Day3", "2021");
main("Day4", "2021");
main("Day5", "2021");
main("Day6", "2021");
main("Day7", "2021");
main("Day8", "2021");
main("Day9", "2021");
main("Day10", "2021");
main("Day11", "2021");
main("Day12", "2021");
main("Day13", "2021");
main("Day14", "2021");
main("Day15", "2021");
main("Day16", "2021");
main("Day17", "2021");
main("Day18", "2021");
main("Day19", "2021");
main("Day20", "2021");
main("Day21", "2021");
main("Day22", "2021");

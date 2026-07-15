import * as path from 'path';
import * as YearMethods from './YearExports';

const fs = require('fs');

const main = (day: string, year: string, isAi?: boolean) => {
  console.log(year, '-', day)
  const inputFile = `${day}Input.txt`;
  const inputPath = path.join(__dirname, year, 'Inputs', inputFile);
  const fileInput = fs.readFileSync(inputPath, 'utf8');
  const input = fileInput.split(/\n+/);
  // console.log(inputFile)
  // console.log(input);
  const startTime = new Date();
  YearMethods[`Year${year}`][day](input)
  const endTime = new Date();
  console.log(`Algorithm Run time: ${endTime.valueOf() - startTime.valueOf()}ms`);
}

main("Day01", "2025");
// main("Day02", "2021");
// main("Day03", "2021");
// main("Day04", "2021");
// main("Day05", "2021");
// main("Day06", "2021");
// main("Day07", "2021");
// main("Day08", "2021");
// main("Day09", "2021");

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

main("Day01", "2020");
main("Day02", "2020");
main("Day03", "2020");
main("Day04", "2020");
main("Day05", "2020");
main("Day06", "2020");
main("Day07", "2020");
main("Day08", "2020");
main("Day09", "2020");

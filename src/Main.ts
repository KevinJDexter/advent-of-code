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

main("Day22", "2021");

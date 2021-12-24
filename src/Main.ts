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
  YearMethods[`Year${year}`][day](input)
}

main("Day16", "2021");

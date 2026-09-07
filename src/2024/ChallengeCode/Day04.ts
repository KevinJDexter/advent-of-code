export const Day04 = (input: string[]) => {
  let totalXmasFound = 0;
  let totalMasXsFound = 0;
  let yMax = input.length - 1;
  let xMax = input[0].length - 1;
  input.forEach((line, y) => {
    for (let x = 0; x < line.length; x++) {
      if (line[x] === 'X') {
        let leftOpen = x > 2;
        let rightOpen = x < xMax - 2;
        let upOpen = y > 2;
        let downOpen = y < yMax - 2;
        if (leftOpen && upOpen && input[y-1][x-1] === 'M' && input[y-2][x-2] === 'A' && input[y-3][x-3] === 'S') {
          totalXmasFound ++;
        }
        if (upOpen && input[y-1][x] === 'M' && input[y-2][x] == 'A' && input[y-3][x] === 'S') {
          totalXmasFound ++;
        }
        if (upOpen && rightOpen && input[y-1][x+1] === 'M' && input[y-2][x+2] === 'A' && input[y-3][x+3] === 'S') {
          totalXmasFound ++;
        }
        if (leftOpen && line[x-1] === 'M' && line[x-2] === 'A' && line[x-3] === 'S') {
          totalXmasFound ++;
        }
        if (rightOpen && line[x+1] === 'M' && line[x+2] === 'A' && line[x+3] === 'S') {
          totalXmasFound ++;
        }
        if (downOpen && leftOpen && input[y+1][x-1] === 'M' && input[y+2][x-2] === 'A' && input[y+3][x-3] === 'S') {
          totalXmasFound ++;
        }
        if (downOpen && input[y+1][x] === 'M' && input[y+2][x] === 'A' && input[y+3][x] === 'S') {
          totalXmasFound ++;
        }
        if (downOpen && rightOpen && input[y+1][x+1] === 'M' && input[y+2][x+2] === 'A' && input[y+3][x+3] === 'S') {
          totalXmasFound ++;
        }
      }

      if (x > 0 && x < xMax && y > 0 && y < yMax && line[x] === 'A') {
        if (((input[y-1][x-1] === 'M' && input[y+1][x+1] === 'S') ||
            (input[y-1][x-1] === 'S' && input[y+1][x+1] === 'M')) && 
            ((input[y-1][x+1] === 'M' && input[y+1][x-1] === 'S') ||
            (input[y-1][x+1] === 'S' && input[y+1][x-1] === 'M'))) {
          totalMasXsFound ++;
        }
      }
    }
  });

  console.log("Total Xmas found:", totalXmasFound);
  console.log("Total X-Max found:", totalMasXsFound);
}
export const Day11 = (input: string[]) => {
  let totalFlashes = 0;
  let stepFlashes = 0;
  let step = 0;
  let matrix = input.map(row => row.split('').map(num => +num));
  while(stepFlashes < 100) {
    stepFlashes = 0;
    step++;
    let tenExists = false;
    matrix = matrix.map(row => row.map(num => {
      if (num + 1 === 10) tenExists = true;
      return num + 1;
    }));
    while (tenExists) {
      tenExists = false;
      matrix.forEach((row, y) => 
        row.forEach((num, x) => {
          if (num === 10) {
            matrix[y][x] = 11;
            for(let i = Math.max(y-1, 0); i <= Math.min(y+1, 9); i++) {
              for(let j = Math.max(x-1, 0); j <= Math.min(x+1, 9); j++) {
                let localNum = matrix[i][j];
                if (localNum < 10) {
                  matrix[i][j] = localNum + 1;
                  if (localNum + 1 === 10) tenExists = true;
                }
              }
            }
          }
        })
      )
    }
    matrix = matrix.map((row) => row.map(num => {
      if (num >= 10) {
        stepFlashes++;
        if (step <= 100) {
          totalFlashes++;
        }
        return 0;
      } 
      return num;
    }))
  }
  console.log("Total Flashes:", totalFlashes)
  console.log("Steps to reach 100 Flashes:", step)
}
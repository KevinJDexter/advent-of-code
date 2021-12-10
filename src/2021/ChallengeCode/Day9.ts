const buildBasin = (input: string[], row: number, col: number) => {
  const number = +input[row][col];
  if (number === 9) {
    return []
  }
  let foundCoords = [[row, col]];
    if (
      input[row-1] && 
      +input[row-1][col] > number
    ) {
      foundCoords = [...foundCoords, ...buildBasin(input, row - 1, col)];
    }
    if (
      input[row+1] && 
      +input[row+1][col] > number
    ) {
      foundCoords = [...foundCoords, ...buildBasin(input, row + 1, col)];
    }
    if (
      +input[row][col-1] > number
    ) {
      foundCoords = [...foundCoords, ...buildBasin(input, row, col - 1)];
    }
    if (
      +input[row][col+1] > number
    ) {
      foundCoords = [...foundCoords, ...buildBasin(input, row, col + 1)];
    }
  
  return foundCoords;
}

export const Day9 = (input: string[]) => {
  let totalSum = 0;
  let coordinatePairs = [];
  input.forEach((line, i) => {
    line.split('').forEach((number, j) => {
      if (
        (!line[j-1] || +number < +line[j - 1]) &&
        (!line[j+1] || +number < +line[j + 1]) &&
        (!input[i-1] || +number < +input[i - 1][j]) &&
        (!input[i+1] || +number < +input[i + 1][j])
      ) {
        totalSum += +number + 1;
        coordinatePairs.push([i, j]);
      }
    })
  }) 
  console.log("Total sum:", totalSum)
  console.log("Total sum:", coordinatePairs.length)

  console.log(input[0])
  console.log(input[1])
  console.log(input[2])
  console.log(input[3])
  console.log(input[4])
  console.log(input[5])
  console.log(input[6])
  console.log(input[7])
  console.log(input[9])
  console.log(buildBasin(input, coordinatePairs[1][0], coordinatePairs[1][1]));
  console.log(buildBasin(input, coordinatePairs[1][0], coordinatePairs[1][1]).length);
  console.log(buildBasin(input, coordinatePairs[1][0], coordinatePairs[1][1]).filter(
    (pair, index, list) => 
      list.findIndex(p => p[0] === pair[0] && p[1] === pair[1]) === index
    ).length);
  let allBasins = coordinatePairs.map(coordPair => buildBasin(input, coordPair[0], coordPair[1]).filter(
    (pair, index, list) => 
      list.findIndex(p => p[0] === pair[0] && p[1] === pair[1]) === index
    ).length);

  const largest = Math.max(...allBasins)
  console.log(largest)
  const minusLargest = allBasins.filter(basin => basin !== largest);
  const nextLargest = Math.max(...minusLargest)
  console.log(nextLargest)
  const minusTwo = minusLargest.filter(basin => basin !== nextLargest);
  const thirdLargest = Math.max(...minusTwo)
  console.log(thirdLargest)
  console.log(largest * nextLargest * thirdLargest);
}
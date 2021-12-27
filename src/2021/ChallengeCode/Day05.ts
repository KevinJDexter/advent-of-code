const initializeMatrix = (size: number) => {
  let matrix: number[][] = [];
  for (let i = 0; i < size; i++) {
    matrix[i] = [];
    for (let j = 0; j < size; j++) {
      matrix[i][j] = 0;
    }
  }
  return matrix;
}

export const Day05 = (input: string[]) => {
  let matrix = initializeMatrix(1000);
  let numIntersections = 0;
  
  input.forEach(line => {
    const splitLine = line.split(' ');
    const x1 = Number(splitLine[0].split(',')[0])
    const y1 = Number(splitLine[0].split(',')[1])
    const x2 = Number(splitLine[2].split(',')[0])
    const y2 = Number(splitLine[2].split(',')[1])

    if (x1 === x2) {
      for (let i = Math.min(y1, y2); i <= Math.max(y1, y2); i++) {
        matrix[x1][i] = matrix[x1][i] + 1;
        if (matrix[x1][i] === 2) numIntersections++
      }
    } else if (y1 === y2) {
      for (let i = Math.min(x1, x2); i <= Math.max(x1, x2); i++) {
        matrix[i][y1] = matrix[i][y1] + 1;
        if (matrix[i][y1] === 2) numIntersections++
      }
    }
  });
  console.log("Orthogonal Intersections:", numIntersections)

  input.forEach(line => {
    const splitLine = line.split(' ');
    const x1 = Number(splitLine[0].split(',')[0])
    const y1 = Number(splitLine[0].split(',')[1])
    const x2 = Number(splitLine[2].split(',')[0])
    const y2 = Number(splitLine[2].split(',')[1])

    if (x1 - x2 === y1 - y2) {
      const startingPointX = Math.min(x1, x2);
      const startingPointY = Math.min(y1, y2);
      for (let i = 0; i <= Math.abs(x1 - x2); i++) {
        matrix[startingPointX + i][startingPointY + i] = matrix[startingPointX + i][startingPointY + i] + 1;
        if (matrix[startingPointX + i][startingPointY + i] === 2) numIntersections++;
      }
    } else if (x1 - x2 === y2 - y1) {
      const startingPointX = Math.min(x1, x2);
      const startingPointY = Math.max(y1, y2);
      for (let i = 0; i <= Math.abs(x1 - x2); i++) {
        matrix[startingPointX + i][startingPointY - i] = matrix[startingPointX + i][startingPointY - i] + 1;
        if (matrix[startingPointX + i][startingPointY - i] === 2) numIntersections++;
      }
    }
  });
  console.log("Total Intersections:", numIntersections)

};
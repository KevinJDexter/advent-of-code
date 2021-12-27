export const Day13 = (input: string[]) => {
  const coordinatePairs = input.filter(line => line.includes(',')).map(line => line.split(',').map(coordinate => +coordinate));
  const folds = input.filter(line => !line.includes(','));

  let previousCoordinatePairs = [...coordinatePairs];
  let currentCoordinatePairs = [];
  let numHolesAfterFirst = 0;
  folds.forEach((fold, i) => {
    const isX = fold.includes('x');
    const foldCoord = +fold.split("=")[1]
    previousCoordinatePairs.forEach(pair => {
      let newPair = [...pair];
      if (isX && pair[0] > foldCoord) {
        const newX = foldCoord * 2 - pair[0];
        newPair = [newX, pair[1]];
      } else if (!isX && pair[1] > foldCoord) {
        const newY = foldCoord * 2 - pair[1];
        newPair = [pair[0], newY];
      }
      if (currentCoordinatePairs.every(existingPair => !(existingPair[0] === newPair[0] && existingPair[1] === newPair[1]))) {
        currentCoordinatePairs.push(newPair)
      }
    })

    if (i === 0) {
      numHolesAfterFirst = currentCoordinatePairs.length;
    }
    previousCoordinatePairs = [...currentCoordinatePairs];
    currentCoordinatePairs = [];
  })

  let maxX = 0;
  let maxY = 0;
  previousCoordinatePairs.forEach(pair => {
    if (pair[0] > maxX) maxX = pair[0];
    if (pair[1] > maxY) maxY = pair[1];
  });
  let finalLines = [];
  for(let y = 0; y <= maxY; y++) {
    let line = "";
    for (let x = 0; x <= maxX; x++) {
      if (previousCoordinatePairs.some(pair => pair[0] === x && pair[1] === y)) {
        line = line + '#';
      } else {
        line = line + '.';
      }
    }
    finalLines.push(line);
  }

  console.log("Number of holes after first fold:", numHolesAfterFirst)
  console.log("The code is:")
  console.log(finalLines)
}
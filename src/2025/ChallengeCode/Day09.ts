export const Day09 = (input: string[]) => {
  const coordinates: number[][] = input.map(coordinate => coordinate.split(',').map(Number));
  let largestArea = 0;

  const getArea = (coord1: number[], coord2: number[]) => {
    const [x1, y1] = coord1;
    const [x2, y2] = coord2;
    return (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1);
  }

  for (let i = 0; i < coordinates.length - 1; i++) {
    for (let j = i + 1; j < coordinates.length; j++) {
      const area = getArea(coordinates[i], coordinates[j])
      if (largestArea < area) largestArea = area;
    }
  }

  const tileCoordinateMap: Map<string, string> = new Map();

  let allXCoordinates = coordinates.map(coord => coord[0]);
  let allYCoordinates = coordinates.map(coord => coord[1]);
  let minXIndex = allXCoordinates.indexOf(Math.min(...allXCoordinates));
  const clockwiseGreen = allYCoordinates[(minXIndex+1) % coordinates.length] < allYCoordinates[minXIndex];

  const RIGHT = 0;
  const DOWN = 1;
  const LEFT = 2;
  const UP = 3;

  let comingFrom = LEFT; 
  let goingTo = clockwiseGreen ? UP : DOWN;

  for (let i = 0; i < coordinates.length; i++) {
    const j = (minXIndex + i) % coordinates.length;
    const x = allXCoordinates[j];
    const y = allYCoordinates[j];
    const nextX = allXCoordinates[(j+1) % coordinates.length];
    const nextY = allYCoordinates[(j+1) % coordinates.length];
    goingTo = nextX === x ? (nextY > y ? DOWN : UP) : (nextX > x ? RIGHT : LEFT);

    // checks if the current corner is an inner corner, and if so, marks it as R1
    if (clockwiseGreen && goingTo === (comingFrom + 1) % 4 || !clockwiseGreen && goingTo === (comingFrom + 3) % 4) {
      tileCoordinateMap.set(`${x},${y}`, 'R1');
    } else {
      tileCoordinateMap.set(`${x},${y}`, 'R3');
    }

    if (goingTo === RIGHT) {
      for (let k = x + 1; k < nextX; k++) {
        tileCoordinateMap.set(`${k},${y}`, 'G');
      }
    } else if (goingTo === DOWN) {
      for (let k = y + 1; k < nextY; k++) {
        tileCoordinateMap.set(`${x},${k}`, 'G');
      }
    } else if (goingTo === LEFT) {
      for (let k = x - 1; k > nextX; k--) {
        tileCoordinateMap.set(`${k},${y}`, 'G');
      }
    } else if (goingTo === UP) {
      for (let k = y - 1; k > nextY; k--) {
        tileCoordinateMap.set(`${x},${k}`, 'G');
      }
    }

    comingFrom = goingTo;
  };
  
  const lineIsClear = (start: number, finish: number, otherCoord: number, onX: boolean) => {
    let onLine = false;
    let startRedOrGreen = true;
    const inc = start < finish ? 1 : -1
    for (let i = start; inc > 0 ? i <= finish : i >= finish; i += inc) {
      const coord = onX ? tileCoordinateMap.get(`${i},${otherCoord}`) : tileCoordinateMap.get(`${otherCoord},${i}`)
      if (!coord) {
        if (i === start) {
          startRedOrGreen = false;
        }
        if (onLine || i === start + inc && startRedOrGreen) {
          return false;
        }
      } else if (coord === 'G') {
        if (i === start || i === start + inc && startRedOrGreen) {
          onLine = true;
        }
        if (onLine === false && i !== finish) {
          return false;
        }
      } else if (coord === 'R1') {
        if (i !== start && i !== finish) {
          return false;
        }
        onLine = !onLine;
      } else if (coord === 'R3') {
        onLine = !onLine;
      } else {
        console.log("ERROR???", coord)
      }
    }
    return true;
  }

  let largestTiledArea = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    const x1 = allXCoordinates[i];
    const y1 = allYCoordinates[i];
    const greenOrRed = ['G', 'R1', 'R3'];
    const firstIsInside = tileCoordinateMap.get(`${x1},${y1}`) === 'R1';
    const firstUpGreen = greenOrRed.includes(tileCoordinateMap.get(`${x1},${y1-1}`) || '');
    const firstDownGreen = greenOrRed.includes(tileCoordinateMap.get(`${x1},${y1+1}`) || '');
    const firstLeftGreen = greenOrRed.includes(tileCoordinateMap.get(`${x1-1},${y1}`) || '');
    const firstRightGreen = greenOrRed.includes(tileCoordinateMap.get(`${x1+1},${y1}`) || '');
    let firstNeighborsAreGreen = false;
    for (let j = i + 1; j < coordinates.length; j++) {
      const x2 = allXCoordinates[j];
      const y2 = allYCoordinates[j];
      const xIncrementFromFirst = x1 < x2 ? 1 : -1;
      const yIncrementFromFirst = y1 < y2 ? 1 : -1;
      const secondIsInside = tileCoordinateMap.get(`${x2},${y2}`) === 'R1';
      if (xIncrementFromFirst === 1 && yIncrementFromFirst === 1) {
        firstNeighborsAreGreen = firstRightGreen && firstDownGreen;
      } else if (xIncrementFromFirst === 1 && yIncrementFromFirst === -1) {
        firstNeighborsAreGreen = firstRightGreen && firstUpGreen;
      } else if (xIncrementFromFirst === -1 && yIncrementFromFirst === 1) {
        firstNeighborsAreGreen = firstLeftGreen && firstDownGreen;
      } else if (xIncrementFromFirst === -1 && yIncrementFromFirst === -1) {
        firstNeighborsAreGreen = firstLeftGreen && firstUpGreen;
      }
      const secondNeighborsAreGreen = greenOrRed.includes(tileCoordinateMap.get(`${x2 - xIncrementFromFirst},${y2}`) || '') && greenOrRed.includes(tileCoordinateMap.get(`${x2},${y2 - yIncrementFromFirst}`) || '');

      if (
        (firstIsInside && !firstNeighborsAreGreen) ||
        (!firstIsInside && firstNeighborsAreGreen) ||
        (secondIsInside && !secondNeighborsAreGreen) ||
        (!secondIsInside && secondNeighborsAreGreen) 
      ) {
        continue;
      } else {
        if (
          lineIsClear(x1, x2, y1, true) &&
          lineIsClear(x1, x2, y2, true) &&
          lineIsClear(y1, y2, x1, false) &&
          lineIsClear(y1, y2, x2, false) 
        ) {
          const area = getArea(coordinates[i], coordinates[j])
          if (largestTiledArea < area) largestTiledArea = area;
        }
      }
    }
  }
  
  console.log("Largest Area:", largestArea);
  console.log("Largest Tiled Area:", largestTiledArea);
}

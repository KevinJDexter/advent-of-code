export const Day19 = (input: string[]) => {
  let scanners = [];
  let currentScannerArray = [];
  input.forEach(line => {
    if (line.includes('scanner')) {
      if (currentScannerArray.length > 0) {
        scanners.push(currentScannerArray)
        currentScannerArray = [];
      }
    } else {
      currentScannerArray.push(line);
    }
  })
  scanners.push(currentScannerArray)

  const sharedRegions = {};

  let allBeacons = scanners.shift();
  let allScanners = ['0,0,0'];

  let i = 0;
  while (scanners.length !== 0 && i < scanners.length) {
    let initialScannerLength = allBeacons.length;
    const newBeaconsAndScanner = checkForOverlap(allBeacons, scanners[i]);
    allBeacons = newBeaconsAndScanner.beacons;
    if (initialScannerLength < allBeacons.length) {
      allScanners.push(newBeaconsAndScanner.scanner)
      scanners.splice(i, 1);
      i = 0;
    } else {
      i ++;
    }
  }

  let maxManhattanDistance = 0;
  for(let i = 0; i < allScanners.length; i++) {
    const firstScanner = allScanners[i].split(',').map(num => +num);
    for(let j = i + 1; j < allScanners.length; j++) {
      const secondScanner = allScanners[j].split(',').map(num => +num);
      maxManhattanDistance = Math.max(
        maxManhattanDistance,
        Math.abs(firstScanner[0] - secondScanner[0]) +
        Math.abs(firstScanner[1] - secondScanner[1]) +
        Math.abs(firstScanner[2] - secondScanner[2])
      )
    }
  }

  console.log("Number of scanners in the ocean:", allBeacons.length)
  console.log("Largets Manhattan distance", maxManhattanDistance)
}


const checkForOverlap = (scannerOneBeacons: string[], scannerTwoBeacons: string[]) => {
  let scannerOneBeaconsAsCoords = scannerOneBeacons.map(coords => coords.split(',').map(num => +num));
  const scannerTwoBeaconsAsCoords = scannerTwoBeacons.map(coords => coords.split(',').map(num => +num));
  const cycles = [
    [0, 1, 2],
    [1, 2, 0],
    [2, 0, 1],
  ];
  let scannerTwoCoordsRelativeToScannerOne = [];
  let scannerTwoBeaconsRelativeToScannerOne = [];
  cycles.forEach(cycle => {
    if (scannerTwoCoordsRelativeToScannerOne.length === 0) {
      let xNeg = false;
      let yNeg = false;
      let zNeg = false;
      let swapXY = false;
      for(let i = 0; i < 2; i++) {
        for (let j = 0; j < 4; j++) {
          let differences = {}
          scannerTwoBeaconsAsCoords.forEach(s2coords => {
            scannerOneBeaconsAsCoords.forEach(s1coords => {
              const xDif = xNeg ? s1coords[0] + s2coords[cycle[swapXY ? 1 : 0]] : s1coords[0] - s2coords[cycle[swapXY ? 1 : 0]];
              const yDif = yNeg ? s1coords[1] + s2coords[cycle[swapXY ? 0 : 1]] : s1coords[1] - s2coords[cycle[swapXY ? 0 : 1]];
              const zDif = zNeg ? s1coords[2] + s2coords[cycle[2]] : s1coords[2] - s2coords[cycle[2]];
              const difString = `${xDif},${yDif},${zDif}`
              differences[difString] = differences[difString] ? differences[difString] + 1 : 1;
              if(differences[difString] === 12) {
                scannerTwoCoordsRelativeToScannerOne = difString.split(',').map(num => +num);
                scannerTwoBeaconsRelativeToScannerOne = scannerTwoBeaconsAsCoords.map(beacon => {
                  const xCoord = (xNeg ? -1 : 1) * beacon[cycle[swapXY ? 1 : 0]] + scannerTwoCoordsRelativeToScannerOne[0];
                  const yCoord = (yNeg ? -1 : 1) * beacon[cycle[swapXY ? 0 : 1]] + scannerTwoCoordsRelativeToScannerOne[1];
                  const zCoord = (zNeg ? -1 : 1) * beacon[cycle[2]] + scannerTwoCoordsRelativeToScannerOne[2];
                  return `${xCoord},${yCoord},${zCoord}`;
                })
                j = 4;
                i = 2;
              }
            })
          })
          if (scannerTwoCoordsRelativeToScannerOne.length > 0) {
          }
          let xNegNext = !yNeg;
          yNeg = xNeg;
          xNeg = xNegNext;
          swapXY = !swapXY;
        }
        xNeg = false;
        yNeg = false;
        zNeg = true;
        swapXY = true;
      }
    }
  });
  let i = 1;
  let remainingBeacons = scannerOneBeacons;
  scannerTwoBeaconsRelativeToScannerOne.forEach(beacon => {
    if (!remainingBeacons.find(coords => coords === beacon)) remainingBeacons.push(beacon)
  })
  return {beacons: remainingBeacons, scanner: scannerTwoCoordsRelativeToScannerOne.map(num => String(num)).join(',')};
}
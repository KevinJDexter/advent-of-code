export const Day17 = (input: string[]) => {
  let brokenDownInput = input[0].split(' ');
  let minX = +brokenDownInput[2].substring(brokenDownInput[2].indexOf('x') + 2, brokenDownInput[2].indexOf('.'));
  let maxX = +brokenDownInput[2].substring(brokenDownInput[2].indexOf('.') + 2, brokenDownInput[2].indexOf(','));
  let minY = +brokenDownInput[3].substring(brokenDownInput[3].indexOf('y') + 2, brokenDownInput[3].indexOf('.'));
  let maxY = +brokenDownInput[3].substring(brokenDownInput[3].indexOf('.') + 2);
  let startingPointX = maxX;
  let startingPointY = minY;
  let highestY = maxY;
  let numSuccessfulShots = 0;
  while (startingPointX > 0 || startingPointY <= -minY) {
    if (tryShot(startingPointX, startingPointY, minX, minY, maxX, maxY)) {
      highestY = Math.max(startingPointY, highestY);
      numSuccessfulShots++;
      startingPointX--;
    } else if (startingPointX === 0) {
      startingPointX = maxX;
      startingPointY++;
    } else {
      startingPointX--;
    }
  }
  console.log("Highest achievable Y position:", (highestY * (highestY + 1)/2));
  console.log("Number of possible successful shots:", numSuccessfulShots);
}

const tryShot = (startingX: number, startingY: number, targetXMin: number, targetYMin: number, targetXMax: number, targetYMax: number) => {
  let currentX = 0;
  let currentY = 0;
  let directionX = startingX;
  let directionY = startingY;
  while (currentX < targetXMax && currentY > targetYMin) {
    currentX += directionX;
    currentY += directionY;
    if (
      currentX >= targetXMin &&
      currentX <= targetXMax &&
      currentY >= targetYMin &&
      currentY <= targetYMax
    ) return true;
    if (directionX > 0) {
      directionX--;
    } else if (directionX < 0) {
      directionX++;
    }
    directionY--;
  }
  return false;
}
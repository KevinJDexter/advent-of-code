export const Day09 = (input: string[]) => {
  // const areas: number[] = [];
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
      // console.log(area)
      // areas.push(area);
      if (largestArea < area) largestArea = area;
    }
  }

  // areas.sort((a, b) => a - b);
  console.log("Largest Area:", largestArea);
}
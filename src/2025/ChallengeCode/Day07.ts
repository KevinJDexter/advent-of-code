export const Day07 = (input: string[]) => {
  let beamIndexes: number[] = [];
  let beamSplitCount: number = 0;
  const beamStartIndex: number = input.shift()?.indexOf('S') || -1;
  beamIndexes.push(beamStartIndex)
  const beamIndexMap = {};
  for (let i = 0; i < input[0].length; i++) {
    beamIndexMap[i] = 0;
  }
  beamIndexMap[beamStartIndex] = 1;
  
  input.forEach((row: string) => {
    const nextIndexes: number[] = [];
    beamIndexes.forEach(index => {
      if (row[index] === '.' && nextIndexes.indexOf(index) < 0) {
        nextIndexes.push(index);
      } else if (row[index] === '^') {
        beamSplitCount ++;
        if (nextIndexes.indexOf(index - 1) < 0) {
          nextIndexes.push(index - 1);
        }
        if (nextIndexes.indexOf(index + 1) < 0) {
          nextIndexes.push(index + 1);
        }
        beamIndexMap[index + 1] = (beamIndexMap[index + 1] || 0) + beamIndexMap[index];
        beamIndexMap[index - 1] = (beamIndexMap[index - 1] || 0) + beamIndexMap[index];
        beamIndexMap[index] = 0;
      }
    })
    beamIndexes = [...nextIndexes]
  })

  let totalBeamTimelines = 0;

  for (let i = 0; i < input[0].length; i++) {
    totalBeamTimelines += beamIndexMap[i];
  }

  console.log("Beam split count:", beamSplitCount);
  console.log("Total Beam Timelines:", totalBeamTimelines);
}
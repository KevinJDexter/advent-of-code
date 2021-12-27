export const Day22 = (input: string[]) => {
  const inputCommands = input.map(command => {
    const splitCommand = command.split('=');
    splitCommand.shift();
    const ranges = splitCommand.map(range => range.replace(',', '').replace('y', '').replace('z', '').split('..'));
    const xMin = Math.min(+ranges[0][0], +ranges[0][1]);
    const xMax = Math.max(+ranges[0][0], +ranges[0][1]);
    const yMin = Math.min(+ranges[1][0], +ranges[1][1]);
    const yMax = Math.max(+ranges[1][0], +ranges[1][1]);
    const zMin = Math.min(+ranges[2][0], +ranges[2][1]);
    const zMax = Math.max(+ranges[2][0], +ranges[2][1]);
    return {
      turnOn: command.split(' ')[0] === 'on',
      xMin,
      xMax,
      yMin,
      yMax,
      zMin,
      zMax,
    }
  })

  let litCubesAt20 = 0;
  let litCubes = 0;
  for(let i = 0; i < input.length; i++) {
    let currentInputCommands = inputCommands[i];
    if (currentInputCommands.turnOn) {
      let currentXRanges = [{...currentInputCommands, xConflictedWith: [], xAndYConflictedWith: []}];
      for (let j = i + 1; j < input.length; j++) {
        let nextXRanges = [];
        const possibleXConflictMin = inputCommands[j].xMin;
        const possibleXConflictMax = inputCommands[j].xMax;
        currentXRanges.forEach(xRange => {
          if (xRange.xMin >= possibleXConflictMin && xRange.xMax <= possibleXConflictMax) {
            nextXRanges.push({...xRange, xMin: xRange.xMin, xMax: xRange.xMax, xConflictedWith: [...xRange.xConflictedWith, j]})
          } else if (xRange.xMin > possibleXConflictMax || xRange.xMax < possibleXConflictMin) {
            nextXRanges.push(xRange)
          } else if (xRange.xMin >= possibleXConflictMin && xRange.xMax > possibleXConflictMax) {
            nextXRanges.push({...xRange, xMin: possibleXConflictMax + 1, xMax: xRange.xMax}) 
            nextXRanges.push({...xRange, xMin: xRange.xMin, xMax: possibleXConflictMax, xConflictedWith: [...xRange.xConflictedWith, j]}) 
          } else if (xRange.xMin < possibleXConflictMin && xRange.xMax <= possibleXConflictMax) {
            nextXRanges.push({...xRange, xMin: xRange.xMin, xMax: possibleXConflictMin - 1}) 
            nextXRanges.push({...xRange, xMin: possibleXConflictMin, xMax: xRange.xMax, xConflictedWith: [...xRange.xConflictedWith, j]}) 
          } else {
            nextXRanges.push({...xRange, xMin: xRange.xMin, xMax: possibleXConflictMin - 1});
            nextXRanges.push({...xRange, xMin: possibleXConflictMin, xMax: possibleXConflictMax, xConflictedWith: [...xRange.xConflictedWith, j]});
            nextXRanges.push({...xRange, xMin: possibleXConflictMax + 1, xMax: xRange.xMax});
          }
        })
        currentXRanges = [...nextXRanges];
      }

      let startingYRanges = [...currentXRanges];
      let finalYRanges = [];
      startingYRanges.forEach(startingYRange => {
        let currentYRanges = [{...startingYRange}];
        startingYRange.xConflictedWith.forEach(index => {
          let nextYRanges = [];
          const possibleYConflictMin = inputCommands[index].yMin;
          const possibleYConflictMax = inputCommands[index].yMax;
          currentYRanges.forEach(yRange => {
            if (yRange.yMin >= possibleYConflictMin && yRange.yMax <= possibleYConflictMax) {
              nextYRanges.push({...yRange, yMin: yRange.yMin, yMax: yRange.yMax, xAndYConflictedWith: [...yRange.xAndYConflictedWith, index]})
            } else if (yRange.yMin > possibleYConflictMax || yRange.yMax < possibleYConflictMin) {
              nextYRanges.push(yRange)
            } else if (yRange.yMin >= possibleYConflictMin && yRange.yMax > possibleYConflictMax) {
              nextYRanges.push({...yRange, yMin: possibleYConflictMax + 1, yMax: yRange.yMax}) 
              nextYRanges.push({...yRange, yMin: yRange.yMin, yMax: possibleYConflictMax, xAndYConflictedWith: [...yRange.xAndYConflictedWith, index]}) 
            } else if (yRange.yMin < possibleYConflictMin && yRange.yMax <= possibleYConflictMax) {
              nextYRanges.push({...yRange, yMin: yRange.yMin, yMax: possibleYConflictMin - 1}) 
              nextYRanges.push({...yRange, yMin: possibleYConflictMin, yMax: yRange.yMax, xAndYConflictedWith: [...yRange.xAndYConflictedWith, index]}) 
            } else {
              nextYRanges.push({...yRange, yMin: yRange.yMin, yMax: possibleYConflictMin - 1});
              nextYRanges.push({...yRange, yMin: possibleYConflictMin, yMax: possibleYConflictMax, xAndYConflictedWith: [...yRange.xAndYConflictedWith, index]});
              nextYRanges.push({...yRange, yMin: possibleYConflictMax + 1, yMax: yRange.yMax});
            }
          })
          currentYRanges = [...nextYRanges];
        })
        finalYRanges = [...finalYRanges, ...currentYRanges]
      })

      let startingZRanges = [...finalYRanges];
      let finalZRanges = [];
      startingZRanges.forEach(startingZRange => {
        let currentZRanges = [{...startingZRange}];
        startingZRange.xAndYConflictedWith.forEach(index => {
          let nextZRanges = [];
          const possibleZConflictMin = inputCommands[index].zMin;
          const possibleZConflictMax = inputCommands[index].zMax;
          currentZRanges.forEach(zRange => {
            if (zRange.zMin >= possibleZConflictMin && zRange.zMax <= possibleZConflictMax) {
              // fully removed
            } else if (zRange.zMin > possibleZConflictMax || zRange.zMax < possibleZConflictMin) {
              nextZRanges.push(zRange)
            } else if (zRange.zMin >= possibleZConflictMin && zRange.zMax > possibleZConflictMax) {
              nextZRanges.push({...zRange, zMin: possibleZConflictMax + 1, zMax: zRange.zMax}) 
            } else if (zRange.zMin < possibleZConflictMin && zRange.zMax <= possibleZConflictMax) {
              nextZRanges.push({...zRange, zMin: zRange.zMin, zMax: possibleZConflictMin - 1}) 
            } else {
              nextZRanges.push({...zRange, zMin: zRange.zMin, zMax: possibleZConflictMin - 1});
              nextZRanges.push({...zRange, zMin: possibleZConflictMax + 1, zMax: zRange.zMax});
            }
          })
          currentZRanges = [...nextZRanges];
        })
        finalZRanges = [...finalZRanges, ...currentZRanges]
      })


      finalZRanges.forEach(range => {
        const newCubes = (range.xMax - range.xMin + 1) * (range.yMax - range.yMin + 1) * (range.zMax - range.zMin + 1);
        if (i < 20) litCubesAt20 += newCubes;
        litCubes += newCubes;
      })
    }
  }
  console.log("Lit cubes in initialization region:", litCubesAt20)
  console.log("Total lit cubes", litCubes)
  return
}
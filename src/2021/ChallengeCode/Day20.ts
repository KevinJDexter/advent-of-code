export const Day20 = (input: string[]) => {
  const imageEnhancementAlgorith = input.shift();
  let currentInput = [...input];
  let inputAfterTwoEnhancements = [];
  for(let i = 0; i < 50; i++) {
    let nextInput = [];
    let surroundingLight = i%2 !== 0 && imageEnhancementAlgorith[0] === '#' ? '#' : '.';
    const inputToAdjust: string[] = [];
    const emptyRow = surroundingLight.repeat(currentInput[0].length + 4);
    inputToAdjust.push(emptyRow);
    inputToAdjust.push(emptyRow);
    currentInput.forEach(row => inputToAdjust.push(`${surroundingLight.repeat(2)}${row}${surroundingLight.repeat(2)}`))
    inputToAdjust.push(emptyRow);
    inputToAdjust.push(emptyRow);

    for (let j = 1; j < inputToAdjust.length - 1; j++) {
      let nextInputRow = '';
      for (let k = 1; k < inputToAdjust[0].length - 1; k++) {
        const lightDarkString = inputToAdjust[j - 1].substr(k - 1, 3) + inputToAdjust[j].substr(k - 1, 3) + inputToAdjust[j+1].substr(k - 1, 3);
        const imageEnhancementIndex = parseInt(lightDarkString.split('').map(char => char === '.' ? '0' : '1').join(''), 2);
        nextInputRow += imageEnhancementAlgorith[imageEnhancementIndex];
      }
      nextInput.push(nextInputRow);
    }

    currentInput =  [...nextInput];
    if (i === 1) {
      inputAfterTwoEnhancements = [...currentInput]
    }
  }

  let lightPixelsAfterTwoEnhancements = 0;
  inputAfterTwoEnhancements.forEach((row, i) => {
    row.split('').forEach(char => char === '#' ? lightPixelsAfterTwoEnhancements++ : null)
  });

  let lightPixelsAfterFiftyEnhancements = 0;
  currentInput.forEach((row, i) => {
    row.split('').forEach(char => char === '#' ? lightPixelsAfterFiftyEnhancements++ : null)
  });

  console.log("Lit pixels after two enhancements:", lightPixelsAfterTwoEnhancements)
  console.log("Lit pixels after fifty enhancements:", lightPixelsAfterFiftyEnhancements)
}
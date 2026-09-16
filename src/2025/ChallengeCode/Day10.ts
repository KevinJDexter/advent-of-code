export const Day10 = (input: string[]) => {
  let sumMinButtons = 0;

  const turnLightOnRecursive = (indicatorsToTurnOn: number[], buttons: number[][], totalButtons: number) => {
    if (indicatorsToTurnOn.length === 0) {
      return 0;
    } else if (buttons.length === 0) {
      return totalButtons + 1;
    } else {
      const nextIndicators = [...indicatorsToTurnOn];
      const button = buttons.shift() || [];
      button.forEach((light: number) => {
        const isLitIndex = nextIndicators.indexOf(light);
        if (isLitIndex !== -1) {
          nextIndicators.splice(isLitIndex, 1);
        } else {
          nextIndicators.push(light);
        }
      })
      if (nextIndicators.length === 0) {
        return 1;
      } else {
        const continueWithButtonOn = turnLightOnRecursive(nextIndicators, [...buttons], totalButtons) + 1;
        const continueWithButtonOff = turnLightOnRecursive(indicatorsToTurnOn, [...buttons], totalButtons);
        return Math.min(continueWithButtonOff, continueWithButtonOn);
      }
    }
  }

  input.forEach(line => {
    const sections = line.split(' ');
    const indicators = sections[0];
    const buttons = sections.filter(section => section[0] === '(').map(section => section.slice(1, -1).split(',').map(Number));
    const indicatorsToTurnOn: number[] = [];

    for (let i = 1; i < indicators.length - 1; i++) {
      if (indicators[i] === '#') indicatorsToTurnOn.push(i - 1);
    }
    
    const buttonsNeeded = turnLightOnRecursive(indicatorsToTurnOn, buttons, buttons.length);
    sumMinButtons += buttonsNeeded;
  })

  // input.forEach(line => {
  //   const sections = line.split(' ');
  //   const indicators = sections[0];
  //   const buttons = sections.filter(section => section[0] === '(').map(section => section.slice(1, -1).split(',').map(Number));

  //   let digitFrequency = {};
  //   for (let i = 1; i < indicators.length - 1; i++) {
  //     digitFrequency[i - 1] = 0;
  //   }

  //   buttons.forEach(button => {
  //     button.forEach(n => digitFrequency[n] = digitFrequency[n] + 1);
  //   })

  //   console.log(digitFrequency)
  // })

  console.log("Minimum buttons needed:", sumMinButtons);
}
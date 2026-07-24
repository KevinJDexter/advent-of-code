export const Day06 = (input: string[]) => {
  const problem1 = (input: string[]) => {
    let totalValue = 0;
    const parseInput: string[][] = input.map(line => line.split(' ').filter(char => char !== ''));
    const parseInputSymbols: string[] = parseInput.pop() || [];
    
    for (let i = 0; i < parseInputSymbols.length; i++) {
      if (parseInputSymbols[i] === '+') {
        let value = 0;
        for (let j = 0; j < parseInput.length; j++) {
          value += Number(parseInput[j][i]);
        }
        totalValue += value;
      } else if (parseInputSymbols[i] === '*') {
        let value = 1;
        for (let j = 0; j < parseInput.length; j++) {
          value *= Number(parseInput[j][i]);
        }
        totalValue += value;
      }
    };
  
    console.log("Worksheet total:", totalValue);
  }

  const problem2 = (input: string[]) => {
    let totalValue = 0;
    const parseInput: string[][] = input.map(line => line.split(''));
    const parseInputSymbols: string[] = parseInput.pop() || [];
    let currentSymbol: string = '';
    let currentValue: number = 0;
    for (let i = 0; i < parseInputSymbols.length; i++) {
      if (parseInputSymbols[i] !== ' ') {
        totalValue += currentValue;
        currentSymbol = parseInputSymbols[i];
        currentValue = parseInputSymbols[i] === '+' ? 0 : 1;
      }
      let currentNumber = 0;
      for (let j = 0; j < parseInput.length; j++) {
        if (parseInput[j][i] !== ' ') {
          currentNumber = currentNumber * 10 + parseInt(parseInput[j][i])
        }
      }
      if (currentNumber === 0) continue;
      if (currentSymbol === '+') currentValue += currentNumber;
      if (currentSymbol === '*') currentValue *= currentNumber;
      if (i === parseInputSymbols.length - 1) totalValue += currentValue;
    }

    console.log("Corrected Worksheet Total:", totalValue);
  }


  problem1(input);
  problem2(input);
}
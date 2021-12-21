export const Day14 = (input: string[]) => {
  console.log("Day14");
  let polymer = input[0];
  let rules = {};
  let ruleLines = input.filter(line => line.includes('-'))
  ruleLines.forEach(line => rules[line.split(' -> ')[0]] = line.split(' -> ')[1])

  const charList = [];
  let charCountsAt10Steps = {};
  let charCountsAt40Steps = {};
  Object.values(rules).forEach((letter: string) => {
    if (!charList.includes(letter)) {
      charList.push(letter);
      charCountsAt10Steps[letter] = 0;
      charCountsAt40Steps[letter] = 0;
    }
  }) 

  let pairOccurrences = {};
  let nextPairOccurrences = {};
  Object.keys(rules).map(rule => {
    pairOccurrences[rule] = 0;
    nextPairOccurrences[rule] = 0;
  });

  polymer.split('').forEach((letter, i) => {
    charCountsAt10Steps[letter] = charCountsAt10Steps[letter] + 1;
    charCountsAt40Steps[letter] = charCountsAt40Steps[letter] + 1;
    const pair = letter + polymer[i + 1];
    if (pair.length === 2) {
      pairOccurrences[pair] = pairOccurrences[pair] + 1;
    }
  })

  for(let i = 0; i < 40; i++) {
    Object.keys(rules).forEach(rule => {
      const numOccurrences = pairOccurrences[rule];
      if (numOccurrences > 0) {
        const letter = rules[rule];
        if (i < 10) {
          charCountsAt10Steps[letter] = charCountsAt10Steps[letter] + numOccurrences;
        }
        charCountsAt40Steps[letter] = charCountsAt40Steps[letter] + numOccurrences;
        const newPair1 = rule[0] + letter;
        const newPair2 = letter + rule[1];
        nextPairOccurrences[newPair1] = nextPairOccurrences[newPair1] + numOccurrences;
        nextPairOccurrences[newPair2] = nextPairOccurrences[newPair2] + numOccurrences;
      }
    })
    pairOccurrences = {...nextPairOccurrences}
    Object.keys(nextPairOccurrences).map(rule => {
      nextPairOccurrences[rule] = 0;
    })
  }

  let maxCountsAt10Steps = 0;
  let minCountsAt10Steps = 0;

  Object.keys(charCountsAt10Steps).forEach(letter => {
    const count = charCountsAt10Steps[letter];
    if (minCountsAt10Steps === 0 || minCountsAt10Steps > count) {
      minCountsAt10Steps = count;
    }
    if (maxCountsAt10Steps < count) {
      maxCountsAt10Steps = count;
    }
  })

  let maxCountsAt40Steps = 0;
  let minCountsAt40Steps = 0;

  Object.keys(charCountsAt40Steps).forEach(letter => {
    const count = charCountsAt40Steps[letter];
    if (minCountsAt40Steps === 0 || minCountsAt40Steps > count) {
      minCountsAt40Steps = count;
    }
    if (maxCountsAt40Steps < count) {
      maxCountsAt40Steps = count;
    }
  })
  console.log("Character difference at 10 steps:", maxCountsAt10Steps - minCountsAt10Steps)
  console.log("Character difference at 40 steps:", maxCountsAt40Steps - minCountsAt40Steps)
}
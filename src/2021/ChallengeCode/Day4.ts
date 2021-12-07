const getWinConditions = (card: string[]) => {
  const columnWins: string[][] = [];
  const rowWins: string[][] = [];
  const diagWins: string[][] = [];
  card.forEach((row, i) => {
    const splitRow = row.split(/\s+/).filter(item => item !== '');
    columnWins[i] = [...splitRow];
    for (let j = 0; j < 5; j++) {
      if (!i) rowWins[j] = [splitRow[j]];
      else rowWins[j] = [...rowWins[j], splitRow[j]];
    }
    // if (!i) {
    //   diagWins[0] = [splitRow[i]];
    //   diagWins[1] = [splitRow[4-i]];
    // }  else {
    //   diagWins[0] = [...diagWins[0], splitRow[i]]
    //   diagWins[1] = [...diagWins[1], splitRow[4 - i]]
    // }
  })
  return [...columnWins, ...rowWins, ...diagWins];
}

const checkNewBingo = (card: string[][], drawOrder: string[]) => {
  const possibleWins = card.filter(win => win.includes(drawOrder[drawOrder.length - 1]));
  let isBingo = false;
  possibleWins.map(win => {
    if (win.every(number => drawOrder.includes(number))) {
      isBingo = true;
    }
  })
  return isBingo
}

const getCardValue = (card: string[], drawnNumbers: string[]) => {
  let sum = 0;
  card.forEach(row => {
    const splitRow = row.split(/\s+/).filter(item => item !== '');
    splitRow.forEach(num => {
      if (!drawnNumbers.includes(num)) sum += Number(num);
    })
  })
  return sum * Number(drawnNumbers[drawnNumbers.length-1]);
}

export const Day4 = (input: string[]) => {
  const drawOrder = input.shift().split(',');;
  let bingoCards = [];
  input.forEach((row, i) => {
    let bingoIndex = 0;
    if (i) bingoIndex = Math.floor(i/5);
    const bingoCard = bingoCards[bingoIndex];
    if (bingoCard) bingoCards[bingoIndex] = [...bingoCard, row]
    else bingoCards[bingoIndex] = [row]
  })
  const cardWinConditions = bingoCards.map(card => getWinConditions(card));

  let firstWinningCardIndex = -1;
  let numbersReadAtFirstCardWin = 0;
  let numbersReadAtLastCardWin = 0;
  let numbersRead = 4;
  let winningCards = [];

  while (winningCards.length < cardWinConditions.length && numbersRead <= drawOrder.length) {
    numbersRead++;
    const currentDraws = drawOrder.slice(0, numbersRead);
    cardWinConditions.forEach((card: string[][], i) => {
      if (!winningCards.includes(i) && checkNewBingo(card, currentDraws)) {
        winningCards.push(i);
        numbersReadAtLastCardWin = numbersRead;
        if (firstWinningCardIndex === -1) {
          firstWinningCardIndex = i;
          numbersReadAtFirstCardWin = numbersRead;
        }
      };
    })
  }

  const challenge1result = getCardValue(bingoCards[firstWinningCardIndex], drawOrder.slice(0, numbersReadAtFirstCardWin));
  const challenge2result = getCardValue(bingoCards[winningCards[winningCards.length - 1]], drawOrder.slice(0, numbersRead));
  console.log("First winning card:", challenge1result)
  console.log("Last winning card:", challenge2result)
}
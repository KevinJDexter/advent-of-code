export const Day18 = (input: string[]) => {
  let currentInputNum = input.shift();
  let completeSnailNum = currentInputNum;
  let highestMagnitude = 0;
  input.forEach(snailNum => {
    completeSnailNum = addSnailNums(completeSnailNum, snailNum);
  })
  while (input.length > 0) {
    input.forEach(snailNum => {
      highestMagnitude = Math.max(highestMagnitude, getMagnitudes(addSnailNums(currentInputNum, snailNum)), getMagnitudes(addSnailNums(snailNum, currentInputNum)));
    })
    currentInputNum = input.shift();
  }
  console.log("Magnitude of input:", getMagnitudes(completeSnailNum));
  console.log("Best achievable magnitude", highestMagnitude);
}

const addSnailNums = (snailNum1: string, snailNum2: string) => {
  let snailNumSum = `[${snailNum1},${snailNum2}]`
  let mayExplode = true;
  let maySplit = true;
  while (mayExplode || maySplit) {
    if (mayExplode) {
      mayExplode = false;
      const explodeIndex = getExplodeIndex(snailNumSum);
      if (explodeIndex < snailNumSum.length) {
        mayExplode = true;
        maySplit = true;
        snailNumSum = explode(snailNumSum, explodeIndex);
      }
    } else {
      maySplit = false;
      const splitIndex = getSplitIndex(snailNumSum);
      if (splitIndex >= 0) {
        mayExplode = true;
        maySplit = true;
        snailNumSum = split(snailNumSum, splitIndex);
      }
    }
  }
  return snailNumSum
}

const getExplodeIndex = (snailNumSum: string) => {
  let exploded = false;
  let currentIndex = 0;
  let depthLevel = 0;
  while(currentIndex < snailNumSum.length && !exploded) {
    let nextCloseBracket = snailNumSum.indexOf(']', currentIndex);
    let nextOpenBracket = snailNumSum.indexOf('[', currentIndex);
    if (nextCloseBracket === -1) {
      break;
    } else if (nextOpenBracket >= 0 && nextOpenBracket < nextCloseBracket) {
      depthLevel++;
      if (depthLevel > 4) exploded = true;
      currentIndex = nextOpenBracket + 1;
    } else {
      depthLevel--;
      currentIndex = nextCloseBracket + 1;
    }
  }
  return currentIndex;
}

const getSplitIndex = (snailNumSum: string) => {
  const splitSnailNumSum = snailNumSum.split(/[\,\]\[]/);
  const numberToSplit = splitSnailNumSum.find(n => n.length > 1);
  return snailNumSum.indexOf(numberToSplit);
}

const explode = (snailNumSum: string, openBracketIndex: number) => {
  const nonNumChars = '[,]';
  const commaIndex = snailNumSum.indexOf(',', openBracketIndex);
  const closeBracketIndex = snailNumSum.indexOf(']', openBracketIndex);
  const leftNumToExplode = snailNumSum.substring(openBracketIndex, commaIndex);
  const rightNumToExplode = snailNumSum.substring(commaIndex + 1, closeBracketIndex);
  let leftNumToReceive = '';
  let leftNumIndex = openBracketIndex - 1;
  while (leftNumIndex >= 0) {
    if (nonNumChars.includes(snailNumSum[leftNumIndex])) {
      if (leftNumToReceive.length > 0) {
        break;
      }
    } else {
      leftNumToReceive = snailNumSum[leftNumIndex] + leftNumToReceive
    }
    leftNumIndex--;
  }
  let rightNumToReceive = '';
  let rightNumIndex = closeBracketIndex + 1;
  while (rightNumIndex < snailNumSum.length) {
    if (nonNumChars.includes(snailNumSum[rightNumIndex])) {
      if (rightNumToReceive.length > 0) {
        break;
      } 
    } else {
      rightNumToReceive = rightNumToReceive + snailNumSum[rightNumIndex];
    }
    rightNumIndex++;
  }
  const leftNumToReceiveLength = leftNumToReceive.length;
  const rightNumToReceiveLength = rightNumToReceive.length;
  return `${snailNumSum.substring(0, leftNumIndex + 1)}${leftNumToReceiveLength > 0 ? +leftNumToExplode + +leftNumToReceive : ''}${snailNumSum.substring(leftNumIndex + leftNumToReceiveLength + 1, openBracketIndex - 1)}0${snailNumSum.substring(closeBracketIndex + 1, rightNumIndex - rightNumToReceiveLength)}${rightNumToReceiveLength > 0 ? +rightNumToExplode + +rightNumToReceive : ''}${snailNumSum.substring(rightNumIndex)}`;
}

const split = (snailNumSum: string, splitIndex: number) => {
  let nextCommaIndex = snailNumSum.indexOf(',', splitIndex);
  let nextCloseBracketIndex = snailNumSum.indexOf(']', splitIndex);
  if (nextCommaIndex === -1) nextCommaIndex = snailNumSum.length;
  if (nextCloseBracketIndex === -1) nextCloseBracketIndex = snailNumSum.length;
  const afterNumIndex = Math.min(nextCommaIndex, nextCloseBracketIndex);
  const num = +snailNumSum.substring(splitIndex, afterNumIndex);
  const leftNum = Math.floor(num / 2);
  const rightNum = Math.ceil(num / 2);
  return `${snailNumSum.substring(0, splitIndex)}[${leftNum},${rightNum}]${snailNumSum.substring(afterNumIndex)}`
}

const getMagnitudes = (snailNum: string) => {
  let currentSnailNum = snailNum;
  while (currentSnailNum.indexOf('[') >= 0) {
    const currentSnailNumMatch = currentSnailNum.match(/\[\d*,\d*\]/);
    const indexOfOpenBracket = currentSnailNumMatch.index;
    const indexOfComma = currentSnailNum.indexOf(',', indexOfOpenBracket);
    const indexOfCloseBracket = currentSnailNum.indexOf(']', indexOfOpenBracket);
    const numberPair = currentSnailNumMatch[0];
    const leftNumberAfterMagnitude = +currentSnailNum.substring(indexOfOpenBracket + 1, indexOfComma) * 3;
    const rightNumberAfterMagnitude = +currentSnailNum.substring(indexOfComma + 1, indexOfCloseBracket) * 2;
    const replacementValue = leftNumberAfterMagnitude + rightNumberAfterMagnitude;
    currentSnailNum = currentSnailNum.replace(numberPair, String(replacementValue));
  }
  return +currentSnailNum;
}
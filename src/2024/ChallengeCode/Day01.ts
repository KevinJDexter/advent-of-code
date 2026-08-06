type NumberMap = {
  [key: number]: number
}

export const Day01 = (input: string[]) => {
  const leftNum: number[] = []
  const rightNum: number[] = []
  input.forEach(line => {
    const nums = line.split('  ');
    leftNum.push(Number(nums[0]))
    rightNum.push(Number(nums[1]))
  });
  leftNum.sort();
  rightNum.sort();
  const rightNumMap: NumberMap = {};
  let sumOfDifferences = 0;
  for (let i = 0; i < leftNum.length; i++) {
    sumOfDifferences += Math.abs(leftNum[i] - rightNum[i]);
    if (!rightNumMap[rightNum[i]]) {
      rightNumMap[rightNum[i]] = 1;
    } else {
      rightNumMap[rightNum[i]] = rightNumMap[rightNum[i]] + 1;
    }
  }

  let similarityScore = 0;
  for (let i = 0; i < leftNum.length; i++) {
    if (rightNumMap[leftNum[i]]) {
      similarityScore += leftNum[i] * rightNumMap[leftNum[i]];
    }
  }
  
  console.log('List difference total:', sumOfDifferences)
  console.log('List similarity score:', similarityScore)
}

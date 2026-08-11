export const Day02 = (input: string[]) => {
  let safeRows: number = 0;
  let kindaSafeRows: number = 0;

  const getBreakingIndex = (nums: number[], skipIndex: number) => {
    const first = skipIndex === 0 ? nums[1] : nums[0];
    const second = skipIndex === 0 || skipIndex === 1 ? nums[2] : nums[1]
    const isIncreasing = first < second;
    for (let i = 0; i < nums.length - 1; i++) {
      if (i === skipIndex) continue;
      const firstNum = nums[i];
      const secondNum = skipIndex === i+1 ? nums[i+2] : nums[i+1];
      if (
        firstNum === secondNum ||
        (isIncreasing && (firstNum > secondNum || secondNum - firstNum > 3)) || 
        (!isIncreasing && (firstNum < secondNum || firstNum - secondNum > 3))
      ) {
        return i;
      }
    }
    return -1;
  }

  input.forEach((line, i) => {
    let nums = line.split(' ').map(Number);
    let isSafe = true;
    let isKindaSafe = true;
    
    const breakingIndex = getBreakingIndex(nums, -1);
    if (breakingIndex > -1) {
      isSafe = false;
      if (getBreakingIndex(nums, 0) > -1 && getBreakingIndex(nums, breakingIndex) > -1 && getBreakingIndex(nums, breakingIndex + 1) > -1) {
        isKindaSafe = false;
      }
    }
    if (isSafe) safeRows ++;
    if (isKindaSafe) kindaSafeRows ++;
  })

  console.log("Number of Safe Reports:", safeRows);
  console.log("Number of Reactor Safe Reports:", kindaSafeRows);
}
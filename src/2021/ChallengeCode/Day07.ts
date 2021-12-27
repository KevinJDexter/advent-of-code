export const Day07 = (input: string[]) => {
  const inputNums = input[0].split(',').map(num => +num);

  let stepsToComplete = -1;
  let incrementalStepsToComplete = -1;
  
  for (let i = Math.min(...inputNums); i <= Math.max(...inputNums); i++) {
    let localStepsToComplete = 0;
    let localIncrementalStepsToComplete = 0;
    inputNums.forEach(num => {
      const gap = Math.abs(num - i);
      localStepsToComplete += gap;
      localIncrementalStepsToComplete += gap * (gap + 1)/ 2;
    });

    if (
      stepsToComplete === -1 ||
      localStepsToComplete < stepsToComplete
    ) stepsToComplete = localStepsToComplete;
    if (
      incrementalStepsToComplete === -1 ||
      localIncrementalStepsToComplete < incrementalStepsToComplete
    ) incrementalStepsToComplete = localIncrementalStepsToComplete;
  }

  console.log("Steps at 1 fuel:", stepsToComplete);
  console.log("Steps at incrementing fuel:", incrementalStepsToComplete);
}
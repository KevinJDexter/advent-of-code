export const Day05 = (input: string[]) => {
  let freshIngredients = 0;
  const freshRanges: number[][] = input.filter((line) => line.includes('-')).map((line) => line.split('-').map(Number));

  for (let i = freshRanges.length; i < input.length; i++) {
    const ingredientId = Number(input[i]);
    for (let range of freshRanges) {
      if (range[1] < range[0]) {
        continue;
      }
      if (ingredientId >= range[0] && ingredientId <= range[1]) {
        freshIngredients++;
        break;
      }
    }
  }

  let totalFreshIngredients = 0;
  const mergedFreshRanges: number[][] = [];
  freshRanges.forEach((range) => {
    const overlapingRangeIndexes: number[] = [];
    mergedFreshRanges.forEach((mergedRange, mergedIndex) => {
      if (range[0] > mergedRange[1] || range[1] < mergedRange[0]) {
        return;
      }
      overlapingRangeIndexes.push(mergedIndex);
    });
    if (overlapingRangeIndexes.length === 0) {
      mergedFreshRanges.push(range);
    } else {
      const mergedRange = overlapingRangeIndexes.reduce((acc, index) => {
        acc[0] = Math.min(acc[0], mergedFreshRanges[index][0]);
        acc[1] = Math.max(acc[1], mergedFreshRanges[index][1]);
        return acc;
      }, [...range]);
      overlapingRangeIndexes.sort((a, b) => b - a).forEach((index) => {
        mergedFreshRanges.splice(index, 1);
      });
      mergedFreshRanges.push(mergedRange);
    };
  });

  mergedFreshRanges.forEach((range) => {
    totalFreshIngredients += range[1] - range[0] + 1;
  });

  console.log("Fresh Ingredients Count:", freshIngredients);
  console.log("Total Fresh Ingredients Count:", totalFreshIngredients);
}
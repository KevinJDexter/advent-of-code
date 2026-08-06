export const Day01 = (input: string[]): void => {
  const capacity: number = input.length;

  const left: Float64Array = new Float64Array(capacity);
  const right: Float64Array = new Float64Array(capacity);

  let pairCount: number = 0;

  for (let i: number = 0; i < capacity; i++) {
    const line: string = input[i].trim();
    if (line.length === 0) continue;

    const gap: number = line.indexOf('   ');

    left[pairCount] = Number(line.slice(0, gap));
    right[pairCount] = Number(line.slice(gap + 3));
    pairCount++;
  }

  const sortedLeft: Float64Array = left.subarray(0, pairCount).sort();
  const sortedRight: Float64Array = right.subarray(0, pairCount).sort();

  let totalDistance: number = 0;
  for (let i: number = 0; i < pairCount; i++) {
    totalDistance += Math.abs(sortedLeft[i] - sortedRight[i]);
  }

  console.log(`Total distance between the sorted lists: ${totalDistance}`);

  let similarityScore: number = 0;
  let l: number = 0;
  let r: number = 0;

  while (l < pairCount && r < pairCount) {
    const value: number = sortedLeft[l];

    if (value < sortedRight[r]) {
      l++;
      continue;
    }
    if (value > sortedRight[r]) {
      r++;
      continue;
    }

    let leftRun: number = 0;
    while (l < pairCount && sortedLeft[l] === value) {
      leftRun++;
      l++;
    }

    let rightRun: number = 0;
    while (r < pairCount && sortedRight[r] === value) {
      rightRun++;
      r++;
    }

    similarityScore += value * leftRun * rightRun;
  }

  console.log(`Similarity score: ${similarityScore}`);
};

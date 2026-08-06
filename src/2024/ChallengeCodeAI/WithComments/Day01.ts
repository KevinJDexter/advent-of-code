export const Day01 = (input: string[]): void => {
  // Each line holds one entry from the left list and one from the right list,
  // separated by exactly three spaces. Line count is an upper bound on the
  // number of pairs (blank lines are skipped), so we can allocate once up front
  // instead of growing arrays as we parse.
  const capacity: number = input.length;

  // Float64Array over number[]: it sorts numerically by default (no comparator
  // call per comparison) and stores values unboxed, which is meaningfully
  // faster than Array.prototype.sort((a, b) => a - b) on large inputs. Doubles
  // represent every integer up to 2^53 exactly, so there is no precision risk.
  const left: Float64Array = new Float64Array(capacity);
  const right: Float64Array = new Float64Array(capacity);

  // Tracks how many real pairs we actually parsed, which may be fewer than
  // `capacity` if the input has blank or trailing lines.
  let pairCount: number = 0;

  for (let i: number = 0; i < capacity; i++) {
    // Trim guards against trailing whitespace and \r from CRLF-terminated files.
    const line: string = input[i].trim();
    if (line.length === 0) continue;

    // The separator is a guaranteed three-space run, so a single indexOf finds
    // the split point. This avoids a regex or an intermediate array from
    // String.prototype.split, keeping parsing at one pass with no allocations
    // beyond the two number slices.
    const gap: number = line.indexOf('   ');

    left[pairCount] = Number(line.slice(0, gap));
    right[pairCount] = Number(line.slice(gap + 3));
    pairCount++;
  }

  // subarray is a view onto the same buffer (no copy), and sorting the view
  // sorts only the populated region in place.
  const sortedLeft: Float64Array = left.subarray(0, pairCount).sort();
  const sortedRight: Float64Array = right.subarray(0, pairCount).sort();

  // --- Part one --------------------------------------------------------------
  // Once both lists are ordered, the nth-smallest on the left pairs with the
  // nth-smallest on the right. Sum the absolute gap of every such pair.
  let totalDistance: number = 0;
  for (let i: number = 0; i < pairCount; i++) {
    totalDistance += Math.abs(sortedLeft[i] - sortedRight[i]);
  }

  console.log(`Total distance between the sorted lists: ${totalDistance}`);

  // --- Part two --------------------------------------------------------------
  // The similarity score adds `x * (times x appears on the right)` once for
  // every occurrence of x on the left. Rather than build a frequency map, we
  // reuse the sort part one already paid for and walk both lists with two
  // pointers, like a sorted merge join. Equal values form contiguous runs, so a
  // value appearing `leftRun` times on the left and `rightRun` times on the
  // right contributes value * leftRun * rightRun in one step. That keeps this
  // pass O(n) with zero extra allocation and no hashing.
  let similarityScore: number = 0;
  let l: number = 0;
  let r: number = 0;

  while (l < pairCount && r < pairCount) {
    const value: number = sortedLeft[l];

    // Advance whichever side is behind until both pointers sit on the same
    // value; values with no counterpart contribute nothing and are skipped.
    if (value < sortedRight[r]) {
      l++;
      continue;
    }
    if (value > sortedRight[r]) {
      r++;
      continue;
    }

    // Both sides are on `value`. Consume its full run on each side at once.
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

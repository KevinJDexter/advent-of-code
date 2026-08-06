# Day 01

## Original Instructions (Verbatim)

Here is your first day: You will be provided with an input consisting of two lists of numbers written side by side like so:

```
1   6
52   58
6286   35
```

Note there will always be 3 spaces between numbers. I want these two lists to be ordered smallest to largest, then find the difference between every pair and add them together

### Part Two

Without losing the initial output, we now want to find a similarity score. For every number x in the left list, we want to find how often it appears in the right list (y). We add x times y to a similarity score. If a number appears multiple times in the left list, we repeat this for each instance (so if 3 appears twice in the left list and three times in the right list, then we add 3 * 3 to the similarity score two times).

---

## My Interpretation

### Part One — Problem Description
Each input line contributes one value to a left list and one value to a right list, separated by exactly three spaces. The two lists are independent: sort each one ascending on its own, then pair them up by rank (smallest with smallest, second-smallest with second-smallest, and so on). "Pair" means positional pairing after sorting, not the original side-by-side row pairing — otherwise the sort would be pointless. Sum the difference of every pair.

Differences are taken as absolute values, since after independent sorts either side can be the larger one at a given rank and a signed sum would let differences cancel out.

### Part One — Algorithm
1. Trim each line and skip blanks
2. Find the three-space separator with a single `indexOf`, slice the two numbers out
3. Sort both lists ascending
4. Sum `|left[i] - right[i]|` across all ranks
5. Log the total

### Part Two — Problem Description
The similarity score accumulates `x * y` for every occurrence of `x` in the left list, where `y` is how many times `x` appears in the right list. Duplicates on the left each contribute separately, so a value appearing `leftRun` times on the left and `rightRun` times on the right contributes `value * leftRun * rightRun` overall. Values with no match on the right contribute zero. Part one's output is preserved — both answers are logged.

### Part Two — Algorithm
Rather than building a frequency map, part two reuses the sort part one already paid for and walks both sorted lists with two pointers, like a sorted merge join:

1. Advance whichever pointer is behind until both sit on the same value
2. Consume that value's entire contiguous run on each side, counting `leftRun` and `rightRun`
3. Add `value * leftRun * rightRun`
4. Repeat until either list is exhausted, then log the score

Because the lists are already sorted, equal values are contiguous, so each element is visited at most once — an O(n) pass with no additional allocation and no hashing.

### Performance Notes
Optimized for **speed on large inputs**, since the work is dominated by the two sorts and everything else is a linear pass.

- **`Float64Array` instead of `number[]`.** Typed arrays sort numerically by default, so `.sort()` runs without invoking a JS comparator callback for every comparison — that callback is the dominant cost in `arr.sort((a, b) => a - b)`. Values are also stored unboxed and contiguously. Doubles hold every integer up to 2^53 exactly, so there is no precision risk for puzzle-scale numbers.
- **Single allocation up front.** `input.length` is an upper bound on the pair count, so both arrays are allocated once rather than grown incrementally. A separate `pairCount` tracks how many slots were actually filled, and `subarray(0, pairCount)` gives a zero-copy view over just that region.
- **`indexOf('   ')` instead of `split`.** The separator is a guaranteed three-space run, so one index lookup plus two slices beats a regex split and avoids allocating an intermediate array per line.
- **Two-pointer merge for part two instead of a `Map`.** The obvious approach is a frequency map of the right list, but the sort from part one already groups equal values contiguously. Exploiting that gives the same O(n) asymptotics with no Map allocation, no hashing, and no boxing of keys — and it keeps the whole solution to two typed arrays of working memory.
- Overall: O(n log n) time dominated by the sorts, O(n) space, one parsing pass and two linear passes.

### Assumptions
- The three-space separator is exact and is the only run of spaces on a line, so `indexOf` finds the correct split point regardless of how many digits each number has.
- Values are non-negative integers of arbitrary width; the code does not depend on any particular magnitude or column alignment.

### Verified
- The sample from the instructions — `1 6 / 52 58 / 6286 35` → left `[1, 52, 6286]`, right `[6, 35, 58]` → `5 + 17 + 6228` = **6250**
- Order independence — the same three rows shuffled produce the same 6250
- Widely varying digit widths (1 to 7 digits) parse correctly, confirming the separator logic is not column-position dependent
- Blank and trailing lines are skipped without shifting the pairing
- Right list larger at some ranks — confirms absolute value is applied rather than a signed subtraction
- 10,000-row randomized input — commented and raw versions produce byte-identical output

Part two:

- The instructions' own example — 3 appearing twice on the left and three times on the right contributes 18, i.e. `3 * 3` counted twice
- `3 4 / 4 3 / 2 5 / 1 3 / 3 9 / 3 3` → distance **11**, similarity **31**
- No overlap between lists → similarity 0 (and part one still logs its answer)
- Zero-valued duplicates → 0, confirming zeros do not break run detection
- Empty input → both answers 0, no crash on the pointer walk
- 10,000 rows with heavy duplication (values mod 503) → matches a naive `filter().length` reference implementation exactly

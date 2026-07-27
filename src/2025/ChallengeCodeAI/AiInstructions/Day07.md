# Day 07

## Original Instructions (Verbatim)

Write day 7. In it the input will consist of a series of strings, the first one containing nothing but `.` and a single `S`, and the others containing `.` and `^` in no specific order. The `S` creates a "beam" that will go straight down. If the beam connects with a `^`, then it splits and continues down the two columns next to it. We want to know how many times the beam splits in total.

---

## My Interpretation

### Problem Description
A beam starts at the `S` in the first row and travels straight down its column. When a beam reaches a `^`, that beam stops and splits into two beams that continue down the columns immediately to the left and right of the `^`. Count the total number of splits.

### Key Decisions
- **Merging overlapping beams:** Active beams are tracked as a *set of columns*. If two beams end up in the same column, they merge into one, so overlapping paths are not counted twice. This also keeps the beam count bounded by the grid width instead of growing exponentially.
- **Beams leaving the grid:** When a split would push a beam past the left or right edge (`col - 1 < 0` or `col + 1 >= width`), that beam is simply dropped.
- **Where splits are evaluated:** New beams from a split enter the *next* row in the neighbouring columns; they are not re-checked against the splitter's own row.

### Algorithm
1. Find the column of `S` in row 0
2. Track `activeColumns` as a set, starting with the S column
3. For each subsequent row, build the next set of active columns:
   - If a beam's cell is `^`: increment the split count and add the left/right columns (if in bounds)
   - Otherwise: the beam continues straight down in the same column
4. Log the total split count

### Performance Notes
- One pass over the grid, with at most `width` active beams per row → O(rows × width)
- The set both de-duplicates overlapping beams and bounds the work per row

---

Update the code such that we maintain the current output, but we also track for something else. Whenever we hit a `^`, we still split the laser as we did before, but we want to know how many possible paths there are total.

As a very basic example, if we had the following:

```
.....S.....
.....^.....
....^.^....
...^.^.^...
..^.^.^.^..
.^.^.^.^.^.
```

We slip at the first ^, then on the second row we split again, but we have 4 possible lasters: splitting left then left, left then right, right then left, and right then right. We then get 8 at the next level: left then left then left, left then left then right, etc. This represents the total number of possible timelines our beam could exist in (as in this hypothetical the beam only makes one path per timeline, but the `^` split the timeline as in one timeline the laser goes one way and in another it goes the other way). If any of this confuses you, ask a clarifying question. Otherwise, make the changes

---

## My Interpretation (Part 2)

### Problem Description
As well as the merged split count from Part 1, count the total number of distinct *timelines* the beam could exist in. Every `^` a beam reaches branches its timeline into two (one where it goes left, one where it goes right). The answer is the total number of these distinct timelines.

### Key Distinction From Part 1
- **Part 1 merges** overlapping beams: two beams that reach the same column are one beam, so a `^` there is a single split. (Example → 15 splits.)
- **Part 2 does not merge**: "left-then-right" and "right-then-left" are different timelines even when they sit in the same column. So the count doubles at each fully-splitting level. (Example → 32 timelines.)

### Counting Method
Track how many timelines currently occupy each column (`Map<col, bigint>`). When a group of `count` timelines hits a `^`, that group branches into two, so the total grows by `count` (one becomes two). This is equivalent to counting the leaves of the binary split-tree: `leaves = 1 + Σ(splits, with multiplicity)`. A timeline that splits off the grid edge still counts (it happened) but is not propagated further.

### Why BigInt
For a tall, fully-splitting grid the timeline count grows like 2^rows, which quickly exceeds JavaScript's safe-integer range. `BigInt` keeps the count exact.

### Verified
- Provided example → splits = 15, timelines = 32
- Single splitter → splits = 1, timelines = 2
- No splitter → splits = 0, timelines = 1

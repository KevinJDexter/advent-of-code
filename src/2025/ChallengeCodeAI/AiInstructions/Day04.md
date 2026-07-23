# Day 04

## Original Instructions (Verbatim)

Write a file for Day04. The input will consist of a series of strings comprised of `.`'s and `@`'s.  The `@` represents a paper roll. We want to identify the number of `@` in the input that is surrounded by 3 or fewer other `@` and increment a counter based on that to identify them as being accessible via forklift.

---

Update the function (without removing the current output) to also now act in a recursive manner. Once we identify all paper rolls (`@`) that can be removed, we remove them and repeat the process. We do this recursively until no paper rolls can be removed, then log the total rolls that were removed

---

## My Interpretation

### Problem Description
Given a grid of strings containing `.` (empty space) and `@` (paper roll), identify which paper rolls are accessible via forklift. A paper roll is accessible if it has 3 or fewer neighboring `@` symbols. Then recursively remove accessible rolls and repeat until none remain, tracking the total removed.

### Algorithm
1. Parse the input into a 2D grid
2. Execute `processRound()` repeatedly:
   - For each `@` in the grid, count how many `@` symbols are adjacent to it (8 directions including diagonals)
   - Mark those with 3 or fewer neighbors for removal
   - Remove all marked rolls from the grid
   - Return count of removed rolls
3. Log the initially accessible count
4. Continue executing `processRound()` until no rolls can be removed (count = 0)
5. Log the total count of all removed rolls across all rounds

### Performance Notes
- Converts input to 2D array for O(1) lookup time
- Each round is O(rows × cols)
- Total complexity: O(k × n × m) where k is number of removal rounds
- Optimized by identifying and removing rolls in a single pass per round

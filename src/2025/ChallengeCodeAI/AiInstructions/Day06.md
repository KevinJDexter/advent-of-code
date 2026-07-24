# Day 06

## Original Instructions (Verbatim)

Write code for day 6 that takes in an input consisting of a series of lines with numbers (each separated by a varying number of spaces) and ending with a line consisting of a series of mathematical symbols that are either `+` or `*` (again, varying number of spaces). This essentially makes the input look akin to columns where we have several numbers on top, then one mathematical symbol on the bottom.

Whatever the operator is at the bottom of a column, we want to have applied to all numbers above said symbol together. So it the symbol were a `+` and we had the numbers `3` `2` and `4` above it, we would add them together for `9`. If that symbol had been `*`, then we would multiply them together for `24`. Our output for the worksheet will be the total sum of all numbers produced in this way.

---

## My Interpretation

### Problem Description
The input is a grid of columns. Every line except the last contains numbers; the last line contains operators (`+` or `*`), one per column. For each column, apply its operator to all the numbers stacked above it (sum for `+`, product for `*`). The worksheet output is the total sum of every column's result.

### Example
Column with numbers 3, 2, 4 and operator `+` → 3 + 2 + 4 = 9
Same numbers with operator `*` → 3 × 2 × 4 = 24

### Algorithm
1. Filter out blank lines
2. Treat the last line as the operator row, all lines above as number rows
3. Split each line on whitespace — this ignores the varying spacing, so token index maps directly to column index (assumes every column has a value in every row)
4. For each column, apply its operator down the column: start at 0 for `+` or 1 for `*`, then accumulate
5. Sum all column results and log the total

### Performance Notes
- Splitting on `/\s+/` handles arbitrary spacing without position math
- Single pass over columns × rows: O(cols × rows), optimal since every cell must be read
- Caches the `isMultiply` check per column instead of comparing the operator string on every cell

---

Without losing the logic we had, turns out the input is a bit wonky on this one. Rather than reading numbers as we did (left to right, line by line in columns), we need to read them vertically going the other way (right to left, column by column) with the mathematical symbol at the end informing us of what operation we will run on the numbers. Here is an example:


```
122 34   555  54
 34 6111 54   11 
  5 9643 65  324
*   +    +   *  
```

This would mean that we want, from right to left:
414 * 512 * 3
5 + 545 + 556
13 + 14 + 416 + 369
245 * 23 * 1

Then we take the sum of all those values as our output for this corrected worksheet work.
If anything confuses you, ask for clarification, otherwise make the changes.

---

## My Interpretation (Part 2)

### Problem Description
The input is a set of blocks separated by all-space character columns. Within each block, numbers are read *vertically*: each character column's digits, stacked top-to-bottom (spaces skipped), form one number. The block's operator (from the last line) is applied across all numbers in that block. The corrected output is the sum of every block's result. The original horizontal-reading output is kept.

### Worked Example
For the rightmost block (operator `*`), reading its character columns right-to-left:
- rightmost char column → digits 4,1,4 → 414
- next → 5,1,2 → 512
- next → (space),(space),3 → 3
- gives 414 * 512 * 3

Applying this to all four blocks and summing gives 643457 (verified programmatically).

### Note on Direction
Because `+`, `*`, and the final sum are all commutative, the right-to-left / top-to-bottom reading order doesn't change the numeric result — only how each number's digits are assembled matters. The digits within a single character column are always read top-to-bottom.

### Algorithm
1. Split into number lines (all but last) and the operator line (last)
2. Walk character columns left to right; a column where every number line has a space is a separator
3. Group contiguous non-separator columns into blocks
4. For each block, find its operator on the operator line within the block's range
5. For each character column in the block, build a number from its non-space digits top-to-bottom, and apply the operator
6. Sum all block results

### Performance Notes
- Single left-to-right scan of character columns; each cell is read a constant number of times → O(rows × width)
- No sorting or position-index math beyond direct character access

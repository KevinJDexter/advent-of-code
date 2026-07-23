# Day 05

## Original Instructions (Verbatim)

Create a file for Day05. The function should take an array of strings, where the first chunk of strings will be a number range (such as 42563-62634), then there will be one empty line, then the rest of the lines will be numbers. We want to know how many of those numbers exist in at least on of the ranges. The ranges represent which ingredients are fresh, and the numbers represent ingredients.

---

It seems that you may have made a mistake.
Your output reads that there are 1186 ingredients that are fresh, but from what I can see that number is more than the number of ingredients total in our list.
You should identifying if any of the standalone numbers (ie. 5234623, NOT 2342-6634) exist within the ranges provided, and if it appears in at least 1 range, then we count it. If it appears in more than 1 range, we do not care, we only count it one time no matter what.

---

## My Interpretation

### Problem Description
The input contains a list of ranges (e.g., "42563-62634") representing which ingredients are fresh, and a list of standalone numbers representing ingredients. Count how many of those ingredient numbers fall within at least one of the fresh ranges. Each qualifying ingredient is counted only once, regardless of how many ranges it falls into.

### Algorithm
1. Classify each line by content: lines containing a `-` are ranges, purely numeric lines are ingredients (more robust than relying on the empty-line divider)
2. Sort and merge overlapping/adjacent ranges for efficient lookup
3. For each ingredient number, use binary search to check if it falls in any merged range
4. Count and log the number of fresh ingredients (each counted once)

### Note on the Fix
The original version relied on locating the empty-line divider to split ranges from ingredients. When that detection failed, range lines were treated as ingredients and inflated the count. Classifying lines by whether they contain `-` avoids that dependency.

---

Without losing current output, add to the day 5 code logic such that we are able to determine how many ingredients are fresh. There is a possibliliy of overlap, so be aware. As an example, if we only had the ranges 1-10 and 6-15, then we would have 15 total fresh ingredients.

---

## My Interpretation (Part 2)

### Problem Description
Determine the total number of fresh ingredients represented by the ranges themselves — i.e., the size of the union of all ranges. Overlapping ranges must not be double-counted. Example: ranges 1-10 and 6-15 overlap and together cover 1-15, giving 15 total fresh ingredients.

### Algorithm
1. Reuse the already-merged (non-overlapping) ranges
2. For each merged range, add its span: `end - start + 1`
3. Sum across all merged ranges to get the union size
4. Log the total

### Performance Notes
- The existing merge step already removes overlaps, so the union size is just the sum of each merged span — O(r) with no extra work needed to handle overlap.

### Performance Notes
- Merging ranges reduces the number of ranges to check and removes overlaps
- Binary search gives O(log r) lookup per ingredient instead of O(r) linear scan
- Overall complexity: O(r log r + n log r) where r = ranges, n = ingredients

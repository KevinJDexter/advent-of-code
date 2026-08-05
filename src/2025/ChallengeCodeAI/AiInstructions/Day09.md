# Day 09

## Original Instructions (Verbatim)

Write code for day 9 that takes an array of coordinates in the form of `x,y` . These coordinates mark red tiles. For any two red tiles, we can make a rectangle using those tiles as opposite corners. We want to find the largest rectangle.

---

## My Interpretation

### Problem Description
Each input line is a red tile at coordinate `x,y`. Any two red tiles serve as the opposite corners of an axis-aligned rectangle. Find the largest such rectangle (by area) over all pairs of tiles.

Only the two chosen tiles need to be red; the other two corners are implied, so this is not the "four red corners" variant.

### Corners Are Inclusive
Clarified: the corner tiles are part of the rectangle, so the "area" is the count of tiles covered, `(|x1 - x2| + 1) * (|y1 - y2| + 1)`. Example: corners (2,3) and (5,5) cover a 4×3 block = 12 tiles. A side effect is that collinear tiles give a non-zero area (a 1-wide strip), e.g. (0,0)-(0,5) = 6 tiles.

### Algorithm
1. Parse each line into an `[x, y]` pair
2. For every pair of tiles, compute area = (x-span + 1) × (y-span + 1)
3. Track and log the maximum area

### Performance Notes
- Straightforward O(N²) over all pairs. Correct and simple; for the expected input sizes this is fine.
- Area is maximized jointly over both axes, so it is not separable into "max x-span × max y-span" (those spans may come from different pairs) — all pairs must be considered unless a convex-hull/extremes argument is proven for the input.

### Verified
- (2,3),(5,5) → 12 (the clarifying example)
- (0,0),(10,1),(1,10) → 100 (from (10,1)-(1,10), inclusive)
- Collinear vertical (0,0),(0,5) → 6

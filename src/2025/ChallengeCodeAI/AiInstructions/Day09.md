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

---

Day 9 part 2: Rather than just the largest area, we want to know the largest area that uses only Green and Red tiles. The input is a list of the red tiles, and green tiles make up the space between any 2 consecutive coordinates, with the area the red tiles wrap around being all green.

---

## My Interpretation (Part 2)

### Problem Description
The red tiles, in order, are the vertices of a closed polygon. Consecutive vertices are joined by segments whose in-between tiles are green, and the region the loop wraps around is filled green. So "green + red" is the filled polygon (boundary + interior). Part 2 asks for the largest rectangle — still using two red tiles as inclusive opposite corners — that lies entirely within that filled region (every tile in it is green or red). The Part 1 answer (largest red-corner rectangle with no containment requirement) is kept.

### Assumptions Flagged
- The vertex list forms a **closed** loop (last vertex connects back to the first) — implied by "the area the red tiles wrap around."
- Consecutive vertices are joined by straight segments. Edges are expected to be axis-aligned; Bresenham rasterization is used so diagonal edges would also work.
- Rectangle corners must be two of the listed red tiles (as in Part 1); the intermediate green edge tiles are not corner candidates.

### Algorithm
1. Compute the vertex bounding box with a 1-tile border.
2. Rasterize the boundary (segments between consecutive vertices, closing the loop) into a grid.
3. Flood-fill the exterior from a border corner through non-boundary tiles; anything unreached is interior. `filled = boundary OR interior`.
4. Build a 2D prefix sum of `filled` so any rectangle's filled-tile count is O(1).
5. For each pair of red tiles, the rectangle is valid iff its filled count equals its (inclusive) area; track the largest valid area. Skip the query when a rectangle can't beat the current best.

### Performance Notes (coordinate compression)
- A dense bounding-box grid is infeasible: the real input's coordinate span is huge and blew the flood-fill stack (`RangeError: Invalid array length`). The fix is **coordinate compression**.
- The polygon's edges only lie on vertex coordinate lines, so inside/outside is uniform within each "band" — a single vertex line (width 1) or the open gap between two consecutive vertex lines. The compressed grid's size depends on the vertex COUNT, not the coordinate span.
- Boundary marking, exterior flood fill, and the prefix sum all run over the compressed grid; "every compressed cell in a block is filled" is equivalent to "every real tile there is green/red" because bands are uniform.
- Real inclusive areas are computed directly from coordinates, so compression costs no precision.
- Grid build + flood fill + prefix sum: O(Bx×By) where Bx,By ≈ 2×(distinct vertex coords). Pair check: O(N²) with an O(1) test each and an early skip when the area can't beat the best.
- Assumes axis-aligned edges (confirmed).

### Verified
- Solid 5×5 square → part1 25, part2 25
- L-shape (bottom 5×3 block + left 3×7 column) → part1 35, part2 21 (largest red-corner rectangle pokes outside the L)
- U-shape with a top-open notch → part1 36, part2 15 (flood fill correctly treats the open cavity as exterior; the best contained rectangle is a vertex-cornered 5×3)
- Huge coordinate span (1,000,000-unit square) → both 1,000,002,000,001, runs instantly (previously threw RangeError with the dense grid)

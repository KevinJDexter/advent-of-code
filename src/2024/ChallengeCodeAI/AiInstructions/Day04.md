# Day 04

## Original Instructions (Verbatim)

Day 4: you have a word search input, a series of lines that are all equi-length that have the letters X, M, A, and S. We want to know how many times the word 'XMAS' appears, going in any direction.

### Part Two

Now we need to know how often we find an X-MAS. What that means is any spot where two instances of MAS cross one another like an X. For example:

```
HSJMME
LJAGAK
LSHMSS
```

The above has one instance of what I described.

---

## My Interpretation

### Part One — Problem Description
The input is a rectangular grid over the alphabet `{X, M, A, S}` (the real input is 140 × 140). Count every straight-line occurrence of `XMAS` in any of the eight compass headings.

Two conventions the brief leaves implicit, resolved the standard word-search way:

- **Reversed spellings count.** "Any direction" includes right-to-left, bottom-to-top, and all four diagonal reversals. These need no special handling — a backwards `XMAS` is the same cells read in the opposite heading, so enumerating all eight headings from each `X` covers forwards and backwards exactly once each, with no double counting.
- **Occurrences may overlap.** `XMASAMX` counts twice, sharing the `S`. Nothing is consumed when a match is found.
- **No wraparound.** A word cannot run off one edge and continue on the opposite one, nor continue from the end of a row onto the start of the next.

### Part One — Algorithm
1. Trim and drop blank lines to form the grid
2. For each cell, skip it unless it holds the anchor letter `X`
3. For each of the eight headings, verify the far endpoint is in bounds, then walk letters 2 through 4
4. Count every heading that spells the word

### Part Two — Problem Description
Despite the name, an X-MAS is not the word XMAS. It is two `MAS` strokes laid across each other in an X: both run diagonally and share their middle `A`. The letter `X` plays no part at all — it is the *shape* of the crossing.

Working the brief's own example confirms the reading. In

```
HSJMME
LJAGAK
LSHMSS
```

the `A` at row 1, column 2 has `S`/`M` on its top-left–bottom-right diagonal and `M`/`S` on the other, so both strokes spell MAS (one of them backwards). That is the single instance. The other `A`, at row 1 column 4, has a good first diagonal but `E`/`M` on the second, so it does not count.

Two consequences follow:

- **Each stroke may run either way.** `MAS` and `SAM` are both acceptable on either diagonal, so the four valid corner arrangements are all counted.
- **`MAM` and `SAS` are not strokes.** The two ends of a diagonal must be one `M` and one `S`; matching letters fail.

Note also that the example uses letters outside `{X, M, A, S}`. The check tests for the letters it needs rather than assuming the restricted alphabet, so foreign letters simply fail to match.

### Part Two — Algorithm
1. Anchor on every `A` that is not on an edge
2. Test that the two outer cells of each diagonal are an `M` and an `S` in either order
3. Count the centre when both diagonals pass

Anchoring on the **centre** is the choice that keeps this simple: every X-MAS has exactly one centre, so each cross is found exactly once and no de-duplication is required. Anchoring on the arms instead would discover each cross twice, once per stroke. Since the centre `A` is already known from the anchor, there is no need to build or compare the string `MAS` at all — the two outer letters carry all the remaining information.

Both parts share a single traversal of the grid. They anchor on different letters (`X` and `A`), so the branches are naturally mutually exclusive and the second part costs no extra pass.

### Performance Notes
Optimized for **legibility with the two cheap wins that cost nothing to read**. The work is inherently O(rows × cols × 8 × 4), which at 140 × 140 is well under a million character comparisons — there is no asymptotic lever worth pulling, so the code is written to be checked by eye against the problem statement.

The two optimizations that came for free:

- **Anchor on the first letter.** Roughly three quarters of cells are not an `X`, and rejecting them with one comparison avoids eight direction probes apiece.
- **One bounds check per direction, not per letter.** Because each walk is a straight line, confirming only the *far endpoint* is in bounds proves every intermediate cell is too. That is one test instead of four, and it lets the inner loop index the grid unguarded.

Deliberately avoided: building a string per ray and comparing it to `'XMAS'`. It reads a little more clearly but allocates a four-character string for every cell-direction pair — roughly 150,000 throwaway strings on the real input — to save nothing. It is used as the independent verification reference instead, where being slow does not matter and being obviously correct does.

### Assumptions
- The grid is rectangular; row length is taken from the first row
- The alphabet is exactly `{X, M, A, S}`, which makes trimming lines safe (no meaningful character can be lost)
- Grids smaller than the word in every direction are valid input and simply yield 0

### Verified
- All eight headings individually, each on a minimal grid — horizontal forward and backward, vertical up and down, and all four diagonals → 1 apiece
- A star grid with eight words radiating from a single centre `X` → **8**, confirming one anchor can contribute multiple matches
- Overlap — `XMASAMX` → **2**, sharing the middle `S`
- Grid too small to contain the word → 0
- No wraparound, tested both within a row (`ASXM` → 0) and across a row boundary (`..XM` / `AS..` → 0)
- Empty input → 0; trailing blank lines tolerated without shifting the grid
- Canonical AoC sample (the 10 × 10 grid) → **18**
- **Real input** `src/2024/Inputs/Day04Input.txt` (140 × 140) → **2464**, matching an independently written reference that takes the opposite approach — building each four-character ray as a string and comparing it to `'XMAS'`

Part two:

- The brief's own example → **1**, and its part one count of 0 confirms the two parts are independent
- All four valid corner arrangements (M top / S top / M left / S left) → 1 apiece
- `MAM` on a diagonal → rejected; `SAS` on a diagonal → rejected
- One good diagonal with a bad second → rejected, confirming both strokes are required
- An `A` on an edge and an `A` in a corner → 0, since a centre cannot reach four diagonal neighbours
- Two crosses sharing an arm → **2**, confirming arms may be reused and that centre-anchoring counts each cross exactly once
- Empty input → 0
- Canonical AoC sample → **18** and **9**, with part one's answer unchanged by the part two work
- **Real input** → **1982**, matching an independently written reference that builds each diagonal as a three-character string and tests it against both `'MAS'` and `'SAM'`
- Commented and raw versions produce identical output on every case above

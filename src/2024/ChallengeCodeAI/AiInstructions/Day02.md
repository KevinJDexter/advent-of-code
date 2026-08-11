# Day 02

## Original Instructions (Verbatim)

Your input will be a list of a series of numbers separated by a space. If a row of numbers is only increasing or only decreasing, and the gap between numbers is between 1 and 3 inclusive, then the row is considered safe. If there is a gap larger than 3, a repeat of numbers, or a change between increasing and decreasing, the row is unsafe. Each row represents a report. We want to know how many reports are safe.

### Part Two

We now also need to know how many reports are safe given that these numbers can be safe when using a Problem Dampener tool (fictitious item in the lore of the problem) that will allow us to remove one number from the list and still have it considered safe. As an example, if we had the numbers `2 4 5 9 8`, we could remove the `9` and it would pass muster.

---

## My Interpretation

### Part One — Problem Description
Each line is one report: a space-separated series of levels, and rows vary in length. A report is safe when it is strictly monotonic in one direction and every adjacent gap is 1, 2, or 3. Count the safe reports.

The three failure modes named in the instructions are not independent checks — they are three views of the same condition once the step's sign is normalized. Pick the direction from the first pair, then measure every step *in that direction*:

| Failure mode | Normalized step |
|---|---|
| gap larger than 3 | `step > 3` |
| repeated value | `step === 0` |
| increasing/decreasing flip | `step < 0` |

So the entire rule collapses to `1 <= step <= 3`, and a single comparison catches all three. A repeat in the first pair is handled for free: `levels[1] > levels[0]` is false when they are equal, the report is treated as decreasing, and the first step measures 0 — unsafe, as required.

### Part One — Algorithm
1. Trim each line and skip blanks
2. Split on spaces into a number array
3. Determine direction from the first pair
4. Walk adjacent pairs, returning false on the first step outside `[1, 3]`
5. Count the reports that survive, and log the count

### Part Two — Problem Description
A report also counts as safe if deleting exactly one level makes it safe. Reports that were already safe still count — the dampener rescues reports, it does not disqualify any — so part two's answer is always greater than or equal to part one's. Part one's output is preserved; both answers are logged.

### Part Two — Algorithm
1. If the report is already safe, count it for both answers and skip the sweep
2. Otherwise, for each index in turn, rebuild the report without that level and re-run the same `isSafe` predicate
3. Stop at the first removal that succeeds

Reusing the part one predicate unchanged is the point: there is no second rule to keep in sync, so the dampener cannot drift away from the definition of safety it depends on.

### Performance Notes
Optimized for **legibility**, deliberately, and unlike Day 01 that costs nothing here.

The work is O(total levels) no matter how it is written — there is no sort, no lookup structure, and no reuse across rows, so there is no algorithmic lever to pull. The only meaningful choice is how clearly the rule is expressed, and the sign-normalization trick is both the shortest and the clearest formulation: one predicate, one range check, no separate "is it increasing" and "is it decreasing" passes.

Two small constant-factor wins come along for free rather than being designed in:

- **Early return on the first bad step.** Most unsafe reports fail in the first pair or two, so the rest of the row is never scored.
- **`split(' ')` rather than `split(/\s+/)`.** The separator is a single space, so the plain-string form avoids the regex engine. Trivial at 1,000 rows, but it is not a legibility cost either.

**On part two's brute force.** Retrying every removal is O(rowLength²) for each rescued report, and it allocates a fresh array per attempt. Both are deliberate. Rows are single digits long, the sweep only runs on reports that already failed part one, and the whole solution measures **0.49 ms** on the real 1,000-row input — the removal sweep is not the bottleneck; parsing is.

The linear alternative is to locate the first bad step at index `i` and try removing only `i - 1`, `i`, and index `0`. That is O(rowLength) with three retries instead of `rowLength` of them. The third candidate is the trap: a bad *first* element can mislead the direction inference, so a row like `1 5 4 3` fails at a later index than the element actually at fault. Getting that argument right — and convincing a reader it is right — costs more than the microseconds it saves. Brute force is obviously correct by construction, which at this input size is the better trade. If a future day makes rows long enough to matter, the linear version is the upgrade path.

Overall: O(n) time in the total number of levels for part one, O(n × rowLength) worst case for part two, O(row length) space.

### Assumptions
- Levels are separated by exactly one space; rows may be of any length
- A report with fewer than two levels has no steps and is therefore trivially safe (this does not occur in the real input)

### Verified
- The canonical six-report sample — `7 6 4 2 1` / `1 2 7 8 9` / `9 7 6 2 1` / `1 3 2 4 5` / `8 6 4 4 1` / `1 3 6 7 9` → **2** safe
- Pure increasing by 1 and pure decreasing by 3 → both safe (confirms the boundary values 1 and 3 are inclusive)
- Gap of 4 → unsafe
- Repeat mid-row, and repeat at the end of a decreasing row → unsafe
- Direction flip mid-row → unsafe
- Equal values in the *first* pair → unsafe (the direction-inference edge case)
- Single-level row → safe; blank and whitespace-only lines skipped without being counted
- **Real input** `src/2024/Inputs/Day02Input.txt` (1,000 reports) → **526 safe**, matching an independently written naive reference that builds the full diff array and tests `every(1..3)` or `every(-1..-3)`

Part two:

- The instructions' own example — `2 4 5 9 8` → unsafe alone, safe once the `9` is dropped
- The canonical six-report sample → **2** safe, **4** with the dampener
- Fault at the very *first* element (`9 1 2 3`) and at the very *last* (`1 2 3 9`) → both rescued, confirming the sweep covers the endpoints
- `1 5 4 3` — the case that breaks the naive "remove one of the two levels around the first bad step" shortcut, since the misleading element is at index 0 while the failure surfaces later → correctly rescued
- Two independent faults (`1 9 2 9 3`) → not rescued, confirming only one removal is permitted
- Leading repeat (`5 5 6 7`) and a two-level equal row (`4 4`) → both rescued
- Already-safe rows and single-level rows counted once in each total, never double-counted
- **Real input** → **566 with the dampener**, matching an independently written brute-force reference
- Commented and raw versions produce identical output on every case above

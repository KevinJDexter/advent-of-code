# Day 05

## Original Instructions (Verbatim)

Day 5 Part 1:
We are printing off a series of pages, but the pages need to follow certain rules. The rules will be listed first, in the format of `##|##`, one rule per line. Then we will eventually have one empty line, followed by the series of printing instructions, in the format of `##,##,##,##,##,##,##`. Do not assume all numbers are 2 digits long. Every rule will have one number of the left, and one number on the right, but printing instructions could have any number of numbers, but this number will always be odd (so 5 numbers, 9 numbers, etc).

The rules instruct that, should the left and right number both appear in the printing instructions, the left number MUST precede the right number.

We want to get the sum of the middle number of all lines that are in a valid order.

### Part Two

For every line that was not valid, we want to put them in a valid order. After doing so, we want to find the sum of the middle numbers of all these fixed lines and log that sum. (Note: it is NOT the sum of Valid + Fixed lines, it is JUST the Fixed lines)

### Clarification Given During Part One

The rule isn't that then left number must be less than the right number, it is that the left number must appear in the list of printing instructions before the right number. The left number could be 55 and the right 23, and that would be correct so long as the printing instruction is "55,43,66,23,75", but would be wrong if it were "21,23,44,55,64"

---

## My Interpretation

### Part One — Problem Description
The file has two sections split by a single blank line: ordering rules `left|right`, then updates, each a comma-separated list of page numbers of odd length.

A rule constrains an update only when **both** of its pages appear in that update — a rule mentioning an absent page is simply irrelevant, not a violation. An update is valid when every applicable rule holds. Sum the middle page of the valid updates.

**The ordering is positional, never numeric.** A rule `left|right` says the left page must appear *earlier in the list* than the right page. It says nothing about their values. Rule `55|23` is satisfied by `55,43,66,23,75` and violated by `21,23,44,55,64`, even though 55 is the larger number in both. Page numbers are used purely as identifiers; the code never compares two of them with `<`.

### Part One — Algorithm
1. Classify each non-empty line by its own syntax: a pipe means rule, otherwise update
2. Store rules in a `Set` of `"left|right"` keys
3. For each update, scan all ordered pairs looking for a **reversed** pair — a page appearing later that is required to precede a page appearing earlier
4. If none is found, add the middle page to the running sum

**The inversion is the key idea.** Rather than verify that every applicable rule is satisfied — which would mean first working out which rules apply — we look for a single disqualifying condition. For each pair of positions `(earlier, later)`, ask whether the rule `pages[later]|pages[earlier]` exists. If it does, the update is broken. This sidesteps the "does this rule apply?" question entirely: a rule whose pages are not both present can never be found by a lookup keyed on two pages that *are* both present.

### Part Two — Problem Description
Take only the updates that failed part one, reorder each into a valid sequence, and sum the middles of those repaired lines. The two totals are kept strictly separate — part two never includes an update that was already correct, as the brief emphasises.

### Part Two — Algorithm
The rules *are* the sort order. A comparator returns -1 when a rule places the first page ahead of the second, 1 when the reverse rule exists, and 0 otherwise. Sorting a broken update with it produces a valid sequence, and the middle is read off as before.

### Part Two — Why the Comparator Is Safe Here
A comparator sort is only well defined when the relation is **total** (every pair is ordered) and **acyclic** over the values being sorted. Neither is free, so both were measured against the real input rather than assumed:

- The rules form a **complete tournament**: 49 distinct pages and exactly 1176 rules, which is precisely 49 × 48 / 2 — one rule for every unordered pair. All 223 updates are therefore fully covered, with no pair left unconstrained.
- No update contains a cycle. Checked exhaustively for three-page cycles across every update: zero.

The genuinely interesting part is that this holds **per update but not globally**. The full rule set contains 4,900 distinct three-page cycles, so there is no single valid ordering of all 49 pages and a global topological sort is impossible — the relation is not a partial order. It is only each update's own subset of pages that induces a cycle-free total order, and that is exactly what makes sorting each update independently well defined. Any approach that tried to derive one master page order first would fail on this input.

The comparator still returns 0 for an unconstrained pair even though that branch is unreachable here, so that a hypothetical uncovered pair degrades to "leave them as they are" rather than producing an arbitrary order.

### Parsing — Corrected
The first version split the two sections at the blank line, using `findIndex` to locate it. That returned 0 when run through the app, because the caller hands over an array with blank lines already removed: with no separator found, the updates section came back empty and nothing was ever scored.

The fix is to stop treating the blank line as load-bearing. A rule always contains a pipe and an update never does, so each line classifies itself and the blank line becomes pure decoration. This is not only a bug fix but the better design — it makes the parse independent of how the caller chose to read the file, which is exactly the kind of coupling that cost an answer here.

### Performance Notes
Optimized for **legibility backed by the right data structure**.

- **A `Set` of composite keys, not a map of successor lists.** The only question ever asked of the rules is "does this exact ordered pair have a rule?" A set answers that in O(1) with no traversal and no intersection logic. A `Map<number, Set<number>>` would answer the same question with an extra indirection and more code.
- **Keys rebuilt from parsed numbers, not from the raw line.** Reusing the trimmed rule line as its own key would be shorter and would handle the varying digit widths the brief warns about. It would *not* handle a `07` in one section and a `7` in the other. Normalizing through `Number` makes the lookup independent of how a page number happens to be written. Tested below.
- **All pairs, not just adjacent ones.** Adjacent-only checking would suffice if the applicable rules formed a total order over each update's pages — which they do in practice for this input — but nothing in the brief guarantees it. All-pairs is O(L²) on updates of at most 23 pages, roughly 25,000 set lookups across the whole file, so correctness costs nothing here. Tested with a deliberately non-adjacent violation.
- **`pages.length >> 1` for the middle.** Lengths are guaranteed odd, so a shift (integer division by two) lands exactly on the centre.

### Assumptions
- A line containing a pipe is a rule; any other non-empty line is an update. No assumption is made about blank lines, line ordering, or how the caller read the file
- Update lengths are odd, as stated — verified against the real input rather than trusted (all 223 are odd)
- A rule is irrelevant unless both of its pages appear in the update

### Verified
- Canonical AoC sample (21 rules, 6 updates) → **143**
- Rules that mention no page in the update → update valid
- Single-page update → valid, and its only page is the middle
- A violated rule between **adjacent** pages → rejected
- A violated rule between **non-adjacent** pages, with every adjacent pair fine → rejected, confirming the all-pairs scan earns its keep
- Three-digit page numbers → handled, per the brief's warning about digit widths
- A `07` in the rules against a `7` in an update → normalized to the same key and matched
- A rule in the *opposite* direction to the update's order → correctly treated as satisfied, not violated
- Nine-page update → correct middle selected
- A rules-only input with no updates → 0 rather than a crash
- A single-page update, which contains no comma, still classifies as an update

Parsing robustness — the real input fed in every way a caller might plausibly hand it over, all yielding **6505**:

- As read from disk, blank line intact
- **With blank lines stripped** — the case that originally produced 0
- With CRLF line endings, and with trailing whitespace on every line
- With extra leading and trailing blank lines
- Without the empty final element from the trailing newline
- With the two sections in reverse order, updates first

Part two:

- Canonical AoC sample → part one **143**, part two **123**
- **Separation of the two totals**, the point the brief stresses: a valid update contributes to part one and contributes 0 to part two; a broken update contributes to part two and 0 to part one
- A fully reversed three-page update → reordered correctly, middle unchanged by construction
- A fault between non-adjacent pages only → still reordered correctly
- A seven-page fully reversed update → correct middle after repair
- Rules with no updates → 0 and 0
- Blank-line-stripped input → same answers, confirming the parsing fix holds for part two as well
- **Real input** → part two **6897**, matching an independently written reference that uses **no sorting at all**: in a total order a page's final index is `(n - 1)` minus the number of pages in the same update it must precede, so the middle is simply the page whose "must precede" count equals `(n - 1) / 2`. Two structurally unrelated methods agreeing is stronger evidence than re-running the same idea twice
- Rule `55|23` against `55,43,66,23,75` → valid, and against `21,23,44,55,64` → violated, confirming the check is positional rather than numeric
- A strictly descending update (`50,40,30,20,10`) with no applicable rule → valid
- Rule `10|50` against `50,40,10` → violated, even though the required-first page is the numerically smaller one
- **Real input** `src/2024/Inputs/Day05Input.txt` (1,176 rules, 223 updates, 106 valid) → **6505**, matching an independently written reference that takes the opposite approach: filter the rules down to those whose pages both appear, build a map from page to its **index in the update**, and assert that the left page's index is smaller than the right page's
- Commented and raw versions produce identical output on every case above

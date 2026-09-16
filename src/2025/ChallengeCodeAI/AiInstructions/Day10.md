# Day 10

## Original Instructions (Verbatim)

Day 10 part 1:
You will receive a string of inputs comprised of 3 elements each:

1. A series of `.` and `#` contained within a `[]`
2. An unknown number of `()` which contain a series of numbers, separated by comma's (i.e. `(1,3) (3,4)`)
3. A series of numbers separated by comma's contained within a `{}`.


The first element represents indicators we need to turn on, the `#` being the ones that need to be on, and the `.` being the ones that need to be off. The first of these symbols in the `[]` is index 0.

The second series of elements (the ones in `()`) represent buttons, each button turning on or off the indicators at each index contained within the `()`.

The Last element will be relevant in the next part.

We want to know the minimum number of button presses needed for each indicator such that we have the correct lights on. (so if the indicator was `[..##.#]` and we had buttons for `(1,5) (1,2,3) (2) (3) (5)`, we would be able to turn the correct lights and only the correct light on with either 3 button presses -- the last 3 -- or 2 button presses -- the first 2 -- so 2 is the answer). Once we know the minimum for each indicator, the sum of those minimums is our answer.

As a note, a space separates all our brackets. (i.e. `[.##.] (1,2) (2,3) (3) {2,5,4,5}`)

---

## My Interpretation

### Problem Description
Each input line has a target pattern in `[]` (`#` = must be on, `.` = must be off, index 0 first), a set of buttons in `()` (each toggles the indicators at the listed indices), and a `{}` group ignored until a later part. For each line, find the minimum number of button presses that leaves exactly the target lights on. Sum those minimums.

### Model
Toggling is XOR over GF(2): each button is a bit-vector, and pressing it XORs its bits into the current state. Pressing a button twice cancels, so an optimal solution presses each button at most once — i.e. we want the **smallest subset of buttons whose XOR equals the target**. This is the minimum-weight XOR-subset problem.

The example confirms it: `[..##.#]` (on at 2,3,5) with buttons (1,5)(1,2,3)(2)(3)(5) is solved by {(2),(3),(5)} (3 presses) or {(1,5),(1,2,3)} (2 presses) — minimum 2.

### Algorithm — Meet in the Middle
Brute force is 2^B over B buttons. Instead, split the buttons in half: enumerate every subset of the first half (2^(B/2)) into a map from XOR value → smallest subset size, then enumerate the second half and, for each, look up `target ^ xor` in the map. This finds the global minimum in O(2^(B/2)) time and space.
- Subset enumeration uses Gray code so each step flips one button, updating the running XOR and count incrementally.
- Bitmasks are `BigInt`, so the indicator length is not capped at 32 bits (native `number` XOR is only 32-bit in JS).

### Optimization Priority / Rationale
Prioritized scalability in the number of buttons: meet-in-the-middle turns an infeasible 2^B into 2^(B/2), which is what makes larger button counts tractable. BigInt keeps it correct for any indicator width; if indicators were guaranteed ≤ 31 wide, plain `number` masks would be faster, but BigInt is the safe general choice. Assumes button count stays within meet-in-the-middle range (roughly ≤ ~40).

### Verified
- Given example → 2
- All-off target → 0; single-on → 1; multi-line sum → 3; exact-3-toggles → 3
- 300 randomized reachable cases cross-checked against a 2^B brute force → 0 mismatches

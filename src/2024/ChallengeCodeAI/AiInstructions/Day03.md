# Day 03

## Original Instructions (Verbatim)

Day 3: Your input is a list of strings of unknown length consisting of multiple instances of `mul(X,Y)` as well as random characters/strings, where X and Y are both 1-3 digit numbers. Our goal is to find all instances of this, then take `X + Y` for each one and add it to a running total. (so `mul(1,3)gahsjdmul(2,4)` would mean taking 1*3 + 2*4).
Be aware that `mul(23,415]` or `mul(5524,23)` are not valid instances for `mul(X,Y)`.

### Part Two

both `do()` and `don't()` appear throughout the strings. Whenever you see `do()`, we include all following `mul(X,Y)` in our result until we see a `don't()`. Whenever you see a `don't()`, we omit all following `mul(X,Y)` until we see a `do()`. We start off including all instances. Note: Whenever we wrap to the next line, the most recent do/don't is still active.

---

## My Interpretation

### Ambiguity Resolved
The prose says "take `X + Y` for each one", but the worked example says `1*3 + 2*4` and the instruction is named `mul`. Read together, these mean: **multiply** each pair, then **sum** the products. The `+` in the prose is the accumulation into the running total, not the operation on the operands. Implemented as multiplication.

### Part One — Problem Description
Scan the input for well-formed `mul(X,Y)` tokens, where X and Y are each 1 to 3 digits. Everything else is noise to be ignored. Multiply the operands of every valid token and sum the products.

The bound is a maximum, not an exact width — `mul(1,3)` from the example is valid — so the operand pattern is `\d{1,3}`, not `\d{3}`.

### Part One — Algorithm
This is a lexing problem, so a single regex is the entire solution:

```
/mul\((\d{1,3}),(\d{1,3})\)/g
```

Both malformed cases in the brief are rejected by the pattern itself, with no special-case code:

- `mul(23,415]` — `]` is not the required `)`.
- `mul(5524,23)` — `\d{1,3}` consumes at most `552`, and the next character is `4` rather than the required `,`. Worth noting *why* this cannot be salvaged into a bogus `mul(524,23)`: after the attempt fails, the engine restarts the search from the following index, and there is no second `mul(` in the remaining text for it to anchor on. The literal prefix is what makes the greedy-digit bound safe here.

### Part Two — Problem Description
`do()` and `don't()` toggle whether subsequent `mul` tokens count. Scanning starts enabled, and the brief states explicitly that the most recent toggle survives a line wrap — so the flag is deliberately declared outside the line loop and never reset per line. Part one's total is unaffected by the toggles, and both answers are logged.

### Part Two — Algorithm
Rather than scan the input twice, the toggles join the *same* regex as alternatives:

```
/mul\((\d{1,3}),(\d{1,3})\)|don't\(\)|do\(\)/g
```

One pass then yields both answers: every `mul` adds to the part one total, and only the ones seen while enabled add to the part two total. Tokens are told apart by `match[0]`.

The alternation is unambiguous, which is worth stating rather than assuming: `do\(\)` cannot swallow the front of `don't()`, because after `do` that string continues with `n` rather than the required `(`. Ordering the branches is therefore a readability choice, not a correctness one. Note the opposite direction *is* a real behaviour — `undo()` contains a literal `do()` and does enable, which matches the reference implementation and is tested below.

### Performance Notes
Optimized for **correctness and legibility**. The pattern *is* the specification — a reader can check the code against the problem statement by reading one line — and a hand-rolled character scanner would be longer, slower to audit, and no faster in practice.

- The input is ~19 KB total; the whole solution is a single linear pass by the regex engine, which is compiled once and hoisted out of the loop rather than rebuilt per line.
- `matchAll` internally clones the regex, so the shared `g`-flagged pattern carries no `lastIndex` state between lines. This is the classic bug with reusing a global regex across inputs, and it is verified against below rather than assumed.
- Lines are scanned independently, which is safe because no instruction straddles a line break — confirmed by checking that no line in the real input ends mid-token.

### Assumptions
- Operands are non-negative integers with no sign, decimal point, or internal whitespace; anything else is noise
- Instructions do not span line breaks

### Verified
- The brief's own example — `mul(1,3)gahsjdmul(2,4)` → **11**
- Both malformed cases from the brief → 0, and `mul(23,5524)` (overlong *second* operand) → 0
- The greedy-digit salvage concern tested explicitly: `mul(5524,23)` yields 0, not `524 * 23`
- Whitespace variants `mul(2, 4)`, `mul (2,4)`, `mul( 2,4)` → all rejected
- `mul(-2,4)` and `mul(2.5,4)` → rejected
- Malformed arity `mul(4)`, `mul(,4)`, `mul(4,)` → rejected
- `mul(0,0)` and `mul(0,5)` → accepted as valid, contributing 0
- Boundary width `mul(999,999)` → **998001**
- Overlapping prefix `mul(mul(2,4)` → **8**, the inner token still found
- Canonical AoC sample `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))` → **161**
- Three identical lines → 24, confirming no `lastIndex` leakage across lines
- Empty input → 0
- **Real input** `src/2024/Inputs/Day03Input.txt` (6 lines, ~19 KB) → **161289189**, matching an independent reference that uses no regex at all — a manual character scanner — run both per-line and over the whole file joined, with all three agreeing

Part two:

- Canonical AoC sample `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))` → part one **161**, part two **48**
- Scanning starts enabled — a bare `mul(2,4)` with no preceding toggle counts
- `don't()` suppresses, a later `do()` re-enables
- Redundant repeats (`do()do()`, `don't()don't()`) are idempotent
- `undo()` contains a literal `do()` and enables, as the reference implementation also does
- `dont()` without the apostrophe and a malformed `don't(` are both ignored as noise
- **Line-wrap persistence**, the specific requirement in the brief, tested three ways: disable on line 1 with the `mul` on line 2 → suppressed; disable then re-enable on line 1 → counted; a three-line sequence where the suppression spans an entire middle line
- Empty input → 0 and 0
- **Real input** → part two **83595109**, matching the same independent no-regex character scanner run over the joined file

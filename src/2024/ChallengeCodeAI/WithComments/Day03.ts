export const Day03 = (input: string[]): void => {
  // This is a lexing problem, so a regex is the whole solution.
  //
  //   mul\(      the literal opening, which anchors every match
  //   (\d{1,3})  first operand, 1-3 digits
  //   ,          literal separator
  //   (\d{1,3})  second operand, 1-3 digits
  //   \)         the literal close
  //
  // The two malformed cases in the brief fall out of this without special
  // handling. `mul(23,415]` fails because `]` is not the required `)`.
  // `mul(5524,23)` fails because `\d{1,3}` consumes at most `552`, and the
  // next character is `4` rather than the required `,` — and since the engine
  // then restarts the search past that point, there is no `mul(` left for it to
  // latch onto, so it cannot salvage a bogus `mul(524,23)` out of the tail.
  //
  // Note the operand bound is a maximum, not an exact width: `mul(1,3)` is
  // valid, so `{1,3}` rather than `{3}`.
  //
  // Part two adds the `do()` / `don't()` toggles. Rather than scan twice, they
  // join the same pattern as alternatives, so one pass yields both answers.
  // Tokens are then told apart by `match[0]`. The alternation is unambiguous:
  // `do\(\)` cannot swallow the front of `don't()`, because after `do` that
  // string continues with `n`, not the required `(`.
  const INSTRUCTION_PATTERN: RegExp = /mul\((\d{1,3}),(\d{1,3})\)|don't\(\)|do\(\)/g;

  // Part one ignores the toggles entirely; part two respects them.
  let total: number = 0;
  let enabledTotal: number = 0;

  // "We start off including all instances", and the brief specifies that the
  // most recent toggle stays active across a line wrap — so this flag lives
  // outside the line loop and is deliberately never reset per line.
  let enabled: boolean = true;

  // Instructions never straddle a line break in the input, so each line can be
  // scanned independently. matchAll internally clones the regex, so the shared
  // `g`-flagged pattern carries no lastIndex state between lines.
  for (const line of input) {
    for (const match of line.matchAll(INSTRUCTION_PATTERN)) {
      if (match[0] === 'do()') {
        enabled = true;
        continue;
      }

      if (match[0] === "don't()") {
        enabled = false;
        continue;
      }

      // Only a mul token reaches here, so the capture groups are populated.
      const product: number = Number(match[1]) * Number(match[2]);

      total += product;
      if (enabled) enabledTotal += product;
    }
  }

  console.log(`Sum of valid mul instructions: ${total}`);
  console.log(`Sum of enabled mul instructions: ${enabledTotal}`);
};

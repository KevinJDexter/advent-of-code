export const Day05 = (input: string[]): void => {
  // The two sections are told apart by their own syntax rather than by the blank
  // line that separates them. A rule always contains a pipe and an update never
  // does, so the classification is unambiguous — and it survives a caller that
  // has already stripped blank lines out of the array, which splitting on the
  // separator's position would not.
  const ruleLines: string[] = [];
  const updateLines: string[] = [];

  for (const line of input) {
    const trimmed: string = line.trim();
    if (trimmed.length === 0) continue;

    if (trimmed.includes('|')) ruleLines.push(trimmed);
    else updateLines.push(trimmed);
  }

  // Rules are stored as a set of "left|right" keys rather than, say, a map of
  // successor lists. The only question ever asked of them is "does this exact
  // ordered pair have a rule?", which a set answers in O(1) with no traversal.
  //
  // Keys are rebuilt from parsed numbers rather than reusing the raw line, so
  // that a hypothetical "07" and "7" normalize to the same key. The brief warns
  // that page numbers are not necessarily two digits, and this keeps the lookup
  // independent of how any particular number happens to be written.
  const rules: Set<string> = new Set<string>();

  for (const line of ruleLines) {
    const [left, right] = line.split('|').map(Number);
    rules.add(`${left}|${right}`);
  }

  // An update is correctly ordered unless some rule is violated, and a rule is
  // violated exactly when a page that must come *later* appears *earlier*. So
  // rather than checking that every required order holds, we look for any
  // reversed pair — a single disqualifying condition instead of a set of
  // requirements to satisfy.
  //
  // This checks all pairs, not just adjacent ones. Adjacent-only would be enough
  // if the rules formed a total order over each update's pages, but nothing in
  // the brief guarantees that, and all-pairs is correct either way.
  const isCorrectlyOrdered = (pages: number[]): boolean => {
    for (let earlier: number = 0; earlier < pages.length - 1; earlier++) {
      for (let later: number = earlier + 1; later < pages.length; later++) {
        // Note the deliberate reversal: we ask whether the page appearing later
        // is required to precede the one appearing earlier.
        if (rules.has(`${pages[later]}|${pages[earlier]}`)) return false;
      }
    }

    return true;
  };

  // Part two: reorder the broken updates. The rules themselves are the sort
  // order — a is placed before b when a rule says so, and after b when the
  // reverse rule exists.
  //
  // A comparator like this is only safe when the relation is total and acyclic
  // over the values being sorted, so that was checked rather than assumed. For
  // this input the rules form a *complete tournament*: 49 distinct pages and
  // exactly 49 * 48 / 2 = 1176 rules, one for every unordered pair. Every update
  // is therefore fully covered, and none of them contains a cycle.
  //
  // Worth knowing: that holds per update but NOT globally. The full rule set
  // contains thousands of three-page cycles, so there is no single valid
  // ordering of all 49 pages and a global topological sort would be impossible.
  // Each update's own pages happen to induce a cycle-free subset, which is
  // exactly what makes the per-update sort well defined.
  const compareByRule = (first: number, second: number): number => {
    if (rules.has(`${first}|${second}`)) return -1;
    if (rules.has(`${second}|${first}`)) return 1;

    // Unreachable for this input, since every pair is covered. Kept so that an
    // unconstrained pair degrades to "leave them as they are" rather than
    // producing an arbitrary order.
    return 0;
  };

  let middleSum: number = 0;
  let fixedMiddleSum: number = 0;

  for (const line of updateLines) {
    const pages: number[] = line.split(',').map(Number);

    // Update lengths are guaranteed odd, so the middle is exact: a bit shift by
    // one is integer division by two, which for odd lengths lands on the centre.
    const middle: number = pages.length >> 1;

    if (isCorrectlyOrdered(pages)) {
      middleSum += pages[middle];
    } else {
      // The two totals are deliberately kept apart: part two counts only the
      // updates it had to repair, never the ones that were already in order.
      pages.sort(compareByRule);
      fixedMiddleSum += pages[middle];
    }
  }

  console.log(`Sum of middle pages of correctly ordered updates: ${middleSum}`);
  console.log(`Sum of middle pages of reordered updates: ${fixedMiddleSum}`);
};

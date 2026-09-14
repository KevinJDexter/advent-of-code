export const Day09 = (input: string[]): void => {
  // Parse "x,y" lines into coordinate pairs. These are the red tiles, and in
  // order they are the vertices of a closed polygon.
  const tiles: number[][] = input
    .filter(line => line.trim() !== '')
    .map(line => line.split(',').map(Number));
  const n: number = tiles.length;

  // ---- Part 1: largest inclusive rectangle using any two red tiles as
  // opposite corners, with no containment requirement. ----
  let largestArea: number = 0;
  for (let i: number = 0; i < n; i++) {
    for (let j: number = i + 1; j < n; j++) {
      const width: number = Math.abs(tiles[i][0] - tiles[j][0]) + 1;
      const height: number = Math.abs(tiles[i][1] - tiles[j][1]) + 1;
      const area: number = width * height;
      if (area > largestArea) largestArea = area;
    }
  }

  // ---- Part 2: largest such rectangle lying entirely on green/red tiles, i.e.
  // fully inside the polygon the red tiles outline. ----
  //
  // A dense grid over the raw coordinates is infeasible (the coordinate span can
  // be enormous), so we COMPRESS coordinates. The polygon's edges only lie on
  // vertex coordinate lines, so the inside/outside state is uniform within each
  // "band" — a single vertex line, or the open gap between two consecutive
  // vertex lines. The compressed grid's size depends on the vertex COUNT, not
  // the coordinate span.

  interface Band { lo: number; hi: number; }

  // Build the bands for one axis, plus a lookup from a vertex coordinate to the
  // index of its (width-1) line band. A sentinel exterior band is padded on each
  // end so the outside flood fill has somewhere to start.
  const buildBands = (values: number[]): { bands: Band[]; lineIndex: Map<number, number> } => {
    const uniq: number[] = Array.from(new Set(values)).sort((a, b) => a - b);
    const bands: Band[] = [];
    const lineIndex: Map<number, number> = new Map<number, number>();

    bands.push({ lo: uniq[0] - 1, hi: uniq[0] - 1 }); // leading exterior pad
    for (let k: number = 0; k < uniq.length; k++) {
      const v: number = uniq[k];
      lineIndex.set(v, bands.length);
      bands.push({ lo: v, hi: v }); // the vertex line itself
      if (k + 1 < uniq.length) {
        const next: number = uniq[k + 1];
        if (next - v >= 2) bands.push({ lo: v + 1, hi: next - 1 }); // the gap between
      }
    }
    bands.push({ lo: uniq[uniq.length - 1] + 1, hi: uniq[uniq.length - 1] + 1 }); // trailing pad
    return { bands, lineIndex };
  };

  const xAxis = buildBands(tiles.map(t => t[0]));
  const yAxis = buildBands(tiles.map(t => t[1]));
  const Bx: number = xAxis.bands.length;
  const By: number = yAxis.bands.length;
  const cIdx = (i: number, j: number): number => i * By + j;

  // Mark the compressed cells covered by each polygon edge (edges are expected
  // to be axis-aligned). An edge spans a contiguous run of bands between the two
  // vertices' line bands, so we can mark them directly.
  const boundary: Uint8Array = new Uint8Array(Bx * By);
  for (let i: number = 0; i < n; i++) {
    const a: number[] = tiles[i];
    const b: number[] = tiles[(i + 1) % n];
    if (a[0] === b[0]) {
      const xi: number = xAxis.lineIndex.get(a[0]) as number;
      const j1: number = yAxis.lineIndex.get(Math.min(a[1], b[1])) as number;
      const j2: number = yAxis.lineIndex.get(Math.max(a[1], b[1])) as number;
      for (let j: number = j1; j <= j2; j++) boundary[cIdx(xi, j)] = 1;
    } else {
      const yj: number = yAxis.lineIndex.get(a[1]) as number;
      const i1: number = xAxis.lineIndex.get(Math.min(a[0], b[0])) as number;
      const i2: number = xAxis.lineIndex.get(Math.max(a[0], b[0])) as number;
      for (let ii: number = i1; ii <= i2; ii++) boundary[cIdx(ii, yj)] = 1;
    }
  }

  // Flood fill the exterior from the padded corner through non-boundary cells.
  const outside: Uint8Array = new Uint8Array(Bx * By);
  const stack: number[] = [cIdx(0, 0)];
  outside[cIdx(0, 0)] = 1;
  while (stack.length > 0) {
    const cur: number = stack.pop() as number;
    const ci: number = Math.floor(cur / By);
    const cj: number = cur % By;
    const neighbours: number[][] = [[ci - 1, cj], [ci + 1, cj], [ci, cj - 1], [ci, cj + 1]];
    for (const [ni, nj] of neighbours) {
      if (ni < 0 || ni >= Bx || nj < 0 || nj >= By) continue;
      const id: number = cIdx(ni, nj);
      if (outside[id] || boundary[id]) continue;
      outside[id] = 1;
      stack.push(id);
    }
  }

  // 2D prefix sum of filled compressed cells (boundary OR interior). Because each
  // band is uniform, "every compressed cell in a block is filled" is equivalent
  // to "every real tile in that region is green/red".
  const prefix: Int32Array = new Int32Array((Bx + 1) * (By + 1));
  const pIdx = (i: number, j: number): number => i * (By + 1) + j;
  for (let i: number = 0; i < Bx; i++) {
    for (let j: number = 0; j < By; j++) {
      const filled: number = (boundary[cIdx(i, j)] || !outside[cIdx(i, j)]) ? 1 : 0;
      prefix[pIdx(i + 1, j + 1)] =
        filled + prefix[pIdx(i, j + 1)] + prefix[pIdx(i + 1, j)] - prefix[pIdx(i, j)];
    }
  }
  const filledCells = (i1: number, j1: number, i2: number, j2: number): number =>
    prefix[pIdx(i2 + 1, j2 + 1)] - prefix[pIdx(i1, j2 + 1)]
    - prefix[pIdx(i2 + 1, j1)] + prefix[pIdx(i1, j1)];

  // For each pair of red tiles: the band block spanning the two vertices is
  // fully filled iff its filled-cell count equals its total cell count. The real
  // inclusive area is computed directly from the coordinates.
  let largestContainedArea: number = 0;
  for (let i: number = 0; i < n; i++) {
    for (let j: number = i + 1; j < n; j++) {
      const rx1: number = Math.min(tiles[i][0], tiles[j][0]);
      const rx2: number = Math.max(tiles[i][0], tiles[j][0]);
      const ry1: number = Math.min(tiles[i][1], tiles[j][1]);
      const ry2: number = Math.max(tiles[i][1], tiles[j][1]);
      const area: number = (rx2 - rx1 + 1) * (ry2 - ry1 + 1);
      if (area <= largestContainedArea) continue;

      const xiLo: number = xAxis.lineIndex.get(rx1) as number;
      const xiHi: number = xAxis.lineIndex.get(rx2) as number;
      const yiLo: number = yAxis.lineIndex.get(ry1) as number;
      const yiHi: number = yAxis.lineIndex.get(ry2) as number;
      const totalCells: number = (xiHi - xiLo + 1) * (yiHi - yiLo + 1);
      if (filledCells(xiLo, yiLo, xiHi, yiHi) === totalCells) {
        largestContainedArea = area;
      }
    }
  }

  console.log(`Largest rectangle area: ${largestArea}`);
  console.log(`Largest rectangle area using only green and red tiles: ${largestContainedArea}`);
};

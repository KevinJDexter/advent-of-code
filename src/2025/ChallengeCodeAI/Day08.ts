export const Day08 = (input: string[]): void => {
  const CONNECTION_LIMIT: number = 1000;

  const boxes: number[][] = input
    .filter(line => line.trim() !== '')
    .map(line => line.split(',').map(Number));
  const n: number = boxes.length;

  interface Edge { dist: number; a: number; b: number; }
  const edges: Edge[] = [];
  for (let i: number = 0; i < n; i++) {
    for (let j: number = i + 1; j < n; j++) {
      const dx: number = boxes[i][0] - boxes[j][0];
      const dy: number = boxes[i][1] - boxes[j][1];
      const dz: number = boxes[i][2] - boxes[j][2];
      edges.push({ dist: dx * dx + dy * dy + dz * dz, a: i, b: j });
    }
  }
  edges.sort((e1, e2) => e1.dist - e2.dist);

  const parent: number[] = new Array<number>(n);
  const size: number[] = new Array<number>(n).fill(1);
  for (let i: number = 0; i < n; i++) parent[i] = i;

  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };

  const union = (a: number, b: number): boolean => {
    let ra: number = find(a);
    let rb: number = find(b);
    if (ra === rb) return false;
    if (size[ra] < size[rb]) { const t = ra; ra = rb; rb = t; }
    parent[rb] = ra;
    size[ra] += size[rb];
    return true;
  };

  const topThreeProduct = (): number => {
    const sizes: number[] = [];
    for (let i: number = 0; i < n; i++) if (find(i) === i) sizes.push(size[i]);
    sizes.sort((x, y) => y - x);
    return (sizes[0] ?? 1) * (sizes[1] ?? 1) * (sizes[2] ?? 1);
  };

  const connectionLimit: number = Math.min(CONNECTION_LIMIT, edges.length);
  let componentCount: number = n;
  let part1Product: number = -1;
  let lastA: number = -1;
  let lastB: number = -1;

  for (let i: number = 0; i < edges.length; i++) {
    if (i === connectionLimit) part1Product = topThreeProduct();

    if (componentCount === 1) {
      if (part1Product !== -1) break;
      continue;
    }

    if (union(edges[i].a, edges[i].b)) {
      componentCount--;
      lastA = edges[i].a;
      lastB = edges[i].b;
    }
  }

  if (part1Product === -1) part1Product = topThreeProduct();

  const lastXProduct: number = boxes[lastA][0] * boxes[lastB][0];

  console.log(`Product of the three longest circuits: ${part1Product}`);
  console.log(`Product of the x-values of the last two connected: ${lastXProduct}`);
};

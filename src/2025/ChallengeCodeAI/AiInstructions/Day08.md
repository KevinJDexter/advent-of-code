# Day 08

## Original Instructions (Verbatim)

Write code for Day 8. The input will be a list of coordinates in 3-dimmensional space in the format of `x,y,z`. These represent fuseboxes. We want to connect all these fuseboxes. Our rules for doing so is going to be as follows:

1. We want to find the shortest distance between two fuseboxes, where at least one of the two boxes are unconnected.
2. We will connect those fuseboxes together. They are now a part of a circuit.
3. If one box was connected and one wasn't, the one that wasn't is not a part of a circuit with the first box and any boxes it was in a circuit with.
4. If neither box was connected, they are now a part of a new circuit, where the two boxes are the only ones in the circuit (for now).
5. Repeat this until every box is connected, always taking the shortest available distance out of all connections.


We want to know the value of the length of the three longest circuits multiplied together.

---

## My Interpretation

### Problem Description
Given 3D fusebox coordinates, repeatedly connect the closest pair of boxes where at least one box is still unconnected. The answer is the product of the lengths (box counts) of the three longest circuits.

### Reading of Rule 3
Rule 3 as written says the unconnected box "is not a part of a circuit" — I read this as a typo for "is **now** a part of a circuit with the first box and any boxes it was in a circuit with." The literal "not" would contradict rule 2 (which says connecting two boxes puts them in a circuit) and would make every circuit permanently size 2, giving a trivial answer. So the intended meaning is that the unconnected box joins the connected box's existing circuit.

### The Key Structural Insight: Circuits Never Merge
Because rule 1 requires at least one endpoint to be unconnected, an edge between two already-connected boxes can never be chosen. Therefore two existing circuits can never be joined. Circuits only ever:
- **Begin** as a pair of two previously-unconnected boxes (rule 4), or
- **Grow** by absorbing a single unconnected box into an existing circuit (rule 3).

This is a Kruskal-like "shortest edge first" process, but with merging forbidden — so the boxes end up partitioned into several separate circuits rather than one spanning tree.

### Algorithm
1. Parse all coordinates
2. Build every pairwise edge, ordered by **squared** Euclidean distance (same ordering as true distance, but exact-integer — no `sqrt`, no floating-point error)
3. Sort edges ascending; process them shortest-first (equivalent to "always take the shortest available connection")
4. For each edge:
   - both endpoints connected → skip (can't merge circuits)
   - neither connected → new circuit of size 2
   - one connected → the unconnected box joins the connected box's circuit
   - stop once every box is connected
5. Multiply the three largest circuit lengths (missing slots count as 1 if fewer than three circuits exist)

### Why No Union-Find Path Compression
Since circuits only gain leaves and never merge, a box's circuit id is fixed the moment it's set. A plain `circuitId[]` array with per-circuit size counters is enough — no find/union bookkeeping required.

### Performance Notes
- Building and sorting all pairwise edges: O(N² log N), standard for a shortest-edge process on a complete graph
- Squared-distance keys keep comparisons exact and avoid `Math.sqrt`

### Verified (original no-merge version)
- Three separated clusters of 3 → sizes 3, 3, 3 → product 27 (clusters do not merge)
- Cluster of 3 + cluster of 2 → sizes 3, 2 → product 6
- Mixed true-3D distances rank correctly → sizes 3, 2 → product 6

---

I made an error in my understanding. We want to connect the shortest 1000 fuseboxes and determine the longest 3 from there. If this connects two circuits, the circuits merge together.

---

## My Interpretation (Revised)

### Problem Description
Make the **1000 shortest connections** between fuseboxes. Merging is now allowed: if a connection joins two boxes that belong to different circuits, those circuits merge into one. After making the connections, multiply the lengths of the three longest circuits.

### What Changed From Before
- The old rule that forbade connecting two already-connected boxes is **gone**. Circuits now merge.
- Instead of continuing until every box is connected, we make exactly the **1000 shortest** connections (or all of them, if fewer than 1000 pairs exist).
- This is now standard connected-components: take the 1000 shortest edges, union their endpoints, and read off component sizes.

### Reading of "the shortest 1000"
I interpret this as the 1000 shortest **connections (edges)**, applied cheapest-first. A connection whose endpoints are already in the same circuit is redundant (it merges nothing) but still counts as one of the 1000. If the intended meaning is "1000 connections that each actually merge something," that would process more edges — let me know and I'll switch.

### Algorithm
1. Parse coordinates
2. Build every pairwise edge, keyed by squared Euclidean distance (exact-integer ordering, no `sqrt`)
3. Sort edges ascending
4. Union the endpoints of the first `min(1000, edgeCount)` edges, with **union-by-size + path compression**, allowing merges
5. Collect each circuit's size (component size at its union-find root)
6. Multiply the three largest (missing slots count as 1)

### Performance Notes
- Building/sorting all pairwise edges: O(N² log N)
- Union-find with path halving + union by size makes the 1000 unions effectively O(α(N)) each

### Verified (revised version)
- Independent union-find reference on an 80-point cloud (3160 edges, so the 1000 cutoff is active) → matches Day08 exactly (product 80)
- Three clusters of 3 with all 36 edges applied → everything merges into one circuit of 9 → 9

---

Without losing the answer we have, we now wan tto know what two fuse boxes are the last ones to be connected before all fuseboxes would be a part of a single circuit. Our result will be the x value of those two fuseboxes multiplied together

---

## My Interpretation (Part 2 / "last two connected")

### Problem Description
Keep the existing answer (three longest circuits after the 1000 shortest connections). Additionally, continue connecting shortest-first past the 1000 limit until every fusebox belongs to a single circuit, and identify the connection that finally fuses everything into one. Multiply the x-coordinates of those two fuseboxes.

### What This Actually Is
Continuing shortest-first until one circuit is exactly building a minimum spanning tree. The connection that reduces the circuit count from 2 to 1 is the **largest edge in that spanning tree** — the last merge. Its two endpoints are the "last two connected."

### Algorithm (one shared union-find pass)
1. Sort all pairwise edges by squared distance (as before)
2. Walk the edges shortest-first, unioning endpoints and tracking the number of circuits:
   - When the edge index reaches the 1000 connection limit, snapshot the three-longest-circuits product (Part 1)
   - Each edge that merges two different circuits decrements the circuit count; remember the endpoints of the most recent such merge
   - When the circuit count hits 1, Part 2's "last two" are the endpoints of that final merge
3. Answer for Part 2: `x` of the first box × `x` of the second box

Both stopping conditions (1000-edge snapshot for Part 1, single-circuit for Part 2) are handled in the same loop regardless of which happens first.

### Verified (Part 2)
- Independent reference on a 120-point cloud → matches Day08 for both parts (part 1 = 120, part 2 lastX = 2,761,728)
- Hand-checked 3-cluster line (boxes at x = 0,1 / 100,101 / 1000,1001): the final merge joins the {0,1,100,101} group to the far cluster via boxes at x=101 and x=1000 → 101 × 1000 = 101000

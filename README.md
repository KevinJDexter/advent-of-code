# advent-of-code

Copy the contents of the desired lenguage from the BaseCode folder into the desired year

For .ts:
* add import to YearExports.ts file under src, and export the same year.
* update the main call line in Main.ts to reflect the desired year and day to run
* to run main.ts from terminal: `npx ts-node Main.ts`

Manual vs AI solutions:
* Manual solutions live in `src/<year>/ChallengeCode/`, AI-generated ones in `src/<year>/ChallengeCodeAI/`.
* When adding an AI day, create `DayXX.ts` in ChallengeCodeAI and add `export * from './DayXX';` to that folder's DayExports.ts.
* To run via Main.ts, pass true as the third arg: `main("Day01", "2025", true)`.

Helper webpage:
* `node server.js`, then open http://localhost:3000 — pick year, source (Manual/AI), and day, then Run.
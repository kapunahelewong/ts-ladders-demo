// ESCAPE HATCHES: ways to tell the compiler "trust me", and why to avoid them.
//
// Nothing in this file is used by the game. It is here to read, and to try
// editing. Each example compiles, and each one is a place where TypeScript stops
// checking something for you.
//
// Ladder: Escape hatches
//   https://ts-ladders.netlify.app/ladders/escape-hatches/

// `export {}` makes this file a MODULE. A file with no import or export is a
// global script, and its names would be visible to every other file.
// https://ts-ladders.netlify.app/ladders/declarations/#step-6
export {};

// 1. A TYPE ASSERTION, written with `as`.
//    This tells TypeScript "I know better". Nothing is checked when the program
//    runs, so a wrong claim fails later, somewhere else.
//    https://ts-ladders.netlify.app/ladders/escape-hatches/#step-1
const raw: unknown = JSON.parse('"forty-two"');
const claimed = raw as number; // compiles. At runtime `claimed` is a string.
void claimed;

// 2. A safer choice: check, then use. After the `if`, TypeScript KNOWS.
//    Prefer this whenever a check is possible.
if (typeof raw === 'string') {
  raw.toUpperCase();
}

// 3. @ts-expect-error: "the next line has an error, and I know."
//    If the line ever stops being an error, TypeScript reports THAT, so the
//    comment cannot go stale. Use it in tests of error cases.
//    https://ts-ladders.netlify.app/ladders/escape-hatches/#step-3
// @ts-expect-error this assigns a string to a number on purpose
const broken: number = 'forty-two';
void broken;

// 4. `any` switches type checking OFF for a value, and the effect spreads to
//    everything derived from it. Reach for `unknown` first.
//    https://ts-ladders.netlify.app/ladders/unions/#step-7
function parseAnything(text: string): any {
  return JSON.parse(text);
}
const value = parseAnything('{"id": 1}');
value.doesNotExist.alsoNotThere(); // no error here. It would throw when it runs.

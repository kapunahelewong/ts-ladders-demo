// ESCAPE HATCHES: ways to make the compiler accept code that it cannot check,
// and the reason to avoid each one.
//
// The game does not use this file. The file is for reading and for editing.
// Each example compiles, and each one is a place where TypeScript stops
// checking something.
//
// Ladder: Escape hatches
//   https://ts-ladders.netlify.app/ladders/escape-hatches/

// `export {}` makes this file a module. A file with no import or export is a
// global script, and its names are visible to every other file.
// https://ts-ladders.netlify.app/ladders/declarations/#step-6
export {};

// 1. A type assertion, written with `as`.
//    The assertion states that a value has a type, and TypeScript accepts the
//    statement. Nothing is checked when the program runs, so a wrong statement
//    causes a failure later, in a different place.
//    https://ts-ladders.netlify.app/ladders/escape-hatches/#step-1
const raw: unknown = JSON.parse('"forty-two"');
const claimed = raw as number; // compiles, and `claimed` is a string when the program runs
void claimed;

// 2. A check, then the use. Inside the `if`, TypeScript knows that `raw` is a
//    `string`, because the check runs when the program runs. Prefer a check
//    whenever one is possible.
if (typeof raw === 'string') {
  raw.toUpperCase();
}

// 3. `@ts-expect-error` states that the next line has an error. TypeScript
//    does not report that error. If the line stops being an error, TypeScript
//    reports the comment itself, so the comment cannot become out of date.
//    Use it in tests of error cases.
//    https://ts-ladders.netlify.app/ladders/escape-hatches/#step-3
// @ts-expect-error this assigns a string to a number on purpose
const broken: number = 'forty-two';
void broken;

// 4. `any` turns off type checking for a value, and the effect spreads to every
//    value that comes from it. Prefer `unknown`.
//    https://ts-ladders.netlify.app/ladders/unions/#step-7
function parseAnything(text: string): any {
  return JSON.parse(text);
}
const value = parseAnything('{"id": 1}');
value.doesNotExist.alsoNotThere(); // no error, and a `TypeError` when the program runs

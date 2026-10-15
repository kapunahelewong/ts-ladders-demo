// DIFFICULTY: a real enum.
//
// An enum is a type and also an object that exists when the program runs.
// `directions.ts` has a constant object that does the same job without the
// `enum` keyword. An enum is not erasable syntax, because the compiler writes
// JavaScript code for it, so this project does not turn on `erasableSyntaxOnly`.
//
// Ladder: Enums and constants
//   https://ts-ladders.netlify.app/ladders/enums/#step-1
//   https://ts-ladders.netlify.app/ladders/enums/#step-5

// A numeric enum counts up from 0: `Easy` is 0, `Normal` is 1, and `Hard` is 2.
// Indexing in the other direction works too: `Difficulty[1]` is the string
// `'Normal'`.
export enum Difficulty {
  Easy,
  Normal,
  Hard,
}

// How much damage the player takes at each difficulty.
//
// The keys are enum members, so every difficulty must be listed here. If a
// fourth difficulty is added above, TypeScript reports that this object is
// missing a key.
//
// https://ts-ladders.netlify.app/ladders/record/#step-2
export const damageTaken: Record<Difficulty, number> = {
  [Difficulty.Easy]: 0.5,
  [Difficulty.Normal]: 1,
  [Difficulty.Hard]: 2,
};

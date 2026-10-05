// DIFFICULTY: a real enum.
//
// An enum is a type AND a real object at runtime. Compare it with the constant
// object in directions.ts, which does the same job without the `enum` keyword.
// (Enums are not "erasable" syntax: the compiler writes JavaScript code for
// them. That is why this project does not turn on erasableSyntaxOnly.)
//
// Ladder: Enums and constants
//   https://ts-ladders.netlify.app/ladders/enums/#step-1
//   https://ts-ladders.netlify.app/ladders/enums/#step-5

// A NUMERIC enum counts up from 0: Easy is 0, Normal is 1, Hard is 2.
// In the other direction, Difficulty[1] is the string 'Normal'.
export enum Difficulty {
  Easy,
  Normal,
  Hard,
}

// How much damage the player takes at each difficulty.
//
// The keys are enum members, so EVERY difficulty must be listed here. Add a
// fourth difficulty above and TypeScript reports this object as incomplete.
//
// https://ts-ladders.netlify.app/ladders/record/#step-2
export const damageTaken: Record<Difficulty, number> = {
  [Difficulty.Easy]: 0.5,
  [Difficulty.Normal]: 1,
  [Difficulty.Hard]: 2,
};

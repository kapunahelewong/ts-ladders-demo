// DIRECTIONS: two ways to write "one of a fixed set of values".
//
// This file shows:
//   - a constant object plus a type made from it (the alternative to an enum)
//   - a type predicate (a function that narrows its argument)
//
// Ladder: Enums and constants
//   https://ts-ladders.netlify.app/ladders/enums/#step-4

// `as const` freezes the TYPE of this object: each value keeps its exact text
// ('north', not just string) and each property becomes read-only.
// The object itself is ordinary JavaScript that exists when the program runs.
export const Direction = {
  North: 'north',
  South: 'south',
  East: 'east',
  West: 'west',
} as const;

// A type with the SAME NAME as the constant above. TypeScript allows this
// because one name can be both a value name and a type name.
//
// Read the right side from the inside out:
//   typeof Direction            the type of the object
//   keyof typeof Direction      its keys: 'North' | 'South' | 'East' | 'West'
//   (...)[ keys ]               the type at each key: 'north' | 'south' | 'east' | 'west'
//
// Add a new key to the object above and this type updates by itself.
export type Direction = (typeof Direction)[keyof typeof Direction];

// A TYPE PREDICATE. The return type `word is Direction` is the important part.
// It says: when this function returns true, `word` is a Direction.
// Callers get that narrowing without writing `as` anywhere.
//
// Ladder: Unions and narrowing
//   https://ts-ladders.netlify.app/ladders/unions/#step-6
export function isDirection(word: string): word is Direction {
  // Object.values(Direction) is the list of the four direction strings.
  return Object.values(Direction).some((direction) => direction === word);
}

// A table with one entry for EVERY direction. If a fifth direction were added,
// TypeScript would report that this object is missing a key.
//
// Ladder: Record
//   https://ts-ladders.netlify.app/ladders/record/#step-2
export const opposite: Record<Direction, Direction> = {
  north: 'south',
  south: 'north',
  east: 'west',
  west: 'east',
};

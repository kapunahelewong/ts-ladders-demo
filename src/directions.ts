// DIRECTIONS: a way to write one of a fixed set of values.
//
// This file shows:
//   - a constant object and a type made from it, as an alternative to an enum
//   - a type predicate, which is a function that narrows its argument
//
// Ladder: Enums and constants
//   https://ts-ladders.netlify.app/ladders/enums/#step-4

// `as const` changes the type of this object. Each value has the type of its
// exact text, such as `'north'`, and each property is read-only. Without
// `as const`, the type of each value is `string`. The object is ordinary
// JavaScript that exists when the program runs.
export const Direction = {
  North: 'north',
  South: 'south',
  East: 'east',
  West: 'west',
} as const;

// A type with the same name as the constant above. TypeScript allows this,
// because one name can be both a value name and a type name.
//
// The right side is read from the inside out:
//   typeof Direction            the type of the object
//   keyof typeof Direction      its keys: 'North' | 'South' | 'East' | 'West'
//   (...)[ keys ]               the type at each key: 'north' | 'south' | 'east' | 'west'
//
// If a key is added to the object above, this type includes the new value.
export type Direction = (typeof Direction)[keyof typeof Direction];

// A type predicate. The return type `word is Direction` states that when this
// function returns `true`, `word` has the type `Direction`. Callers get that
// narrowing without writing `as`.
//
// Ladder: Unions and narrowing
//   https://ts-ladders.netlify.app/ladders/unions/#step-6
export function isDirection(word: string): word is Direction {
  // `Object.values(Direction)` is the list of the four direction strings.
  return Object.values(Direction).some((direction) => direction === word);
}

// A table with one entry for every direction. If a fifth direction is added,
// TypeScript reports that this object is missing a key.
//
// Ladder: Record
//   https://ts-ladders.netlify.app/ladders/record/#step-2
export const opposite: Record<Direction, Direction> = {
  north: 'south',
  south: 'north',
  east: 'west',
  west: 'east',
};

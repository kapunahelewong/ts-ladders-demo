// COMMANDS: turning what the player types into a value the program understands.
//
// This file shows:
//   - a discriminated union: several object types that share one field, `kind`
//   - narrowing with a type predicate and with a `switch`
//   - a `Command | undefined` return type for input that may not be a command
//
// Ladder: Unions and narrowing
//   https://ts-ladders.netlify.app/ladders/unions/#step-3

import { isDirection } from './directions.js';
import type { Direction } from './directions.js';

// A discriminated union is a union whose members each have a `kind` property
// with a different literal value. `kind` is called the discriminant. Checking
// `kind` tells TypeScript which member a value is.
//
// Only the `go` member has a `direction`, and only the `take` member has an
// `itemName`. Reading `command.direction` on a `look` command is a compile error.
export type Command =
  | { kind: 'look' }
  | { kind: 'go'; direction: Direction }
  | { kind: 'take'; itemName: string }
  | { kind: 'attack' }
  | { kind: 'inventory' }
  | { kind: 'save' }
  | { kind: 'load' }
  | { kind: 'help' }
  | { kind: 'quit' };

// Some input is not a command, so the return type is `Command | undefined`.
// With `strictNullChecks` on, which `strict` turns on, every caller has to
// handle the `undefined` case before using the result.
// https://ts-ladders.netlify.app/ladders/nullability/#step-1
export function parseCommand(input: string): Command | undefined {
  // Split the text `go north` into the verb `go` and the rest, `north`.
  //
  // With `noUncheckedIndexedAccess` on, `verb` has the type `string | undefined`,
  // because reading a position of an array can find nothing. Empty input is an
  // example.
  const [verb, ...rest] = input.trim().toLowerCase().split(/\s+/);
  const argument = rest.join(' ');

  // A `switch` over a string. Each `case` returns one member of the union.
  switch (verb) {
    case 'look':
    case 'l':
      return { kind: 'look' };

    case 'go':
      // `isDirection` is a type predicate. When it returns `true`, `argument` has
      // the type `Direction`, so the object below matches `{ kind: 'go'; direction }`.
      return isDirection(argument) ? { kind: 'go', direction: argument } : undefined;

    case 'take':
      return argument === '' ? undefined : { kind: 'take', itemName: argument };

    case 'attack':
      return { kind: 'attack' };

    case 'inventory':
    case 'i':
      return { kind: 'inventory' };

    case 'save':
      return { kind: 'save' };

    case 'load':
      return { kind: 'load' };

    case 'help':
      return { kind: 'help' };

    case 'quit':
      return { kind: 'quit' };

    default:
      return undefined;
  }
}

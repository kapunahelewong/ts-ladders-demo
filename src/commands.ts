// COMMANDS: turning what the player types into a value the program understands.
//
// This file shows:
//   - a DISCRIMINATED UNION: several shapes that share one field (`kind`)
//   - narrowing with a type predicate and with a switch
//   - the Command | undefined pattern for input that may not make sense
//
// Ladder: Unions and narrowing
//   https://ts-ladders.netlify.app/ladders/unions/#step-3

import { isDirection } from './directions.js';
import type { Direction } from './directions.js';

// A DISCRIMINATED UNION. Every member has a `kind` property with a different
// literal value. `kind` is called the discriminant: checking it tells
// TypeScript which member it has.
//
// Notice that only the `go` command has a `direction`, and only `take` has an
// `itemName`. The union makes that exact: you cannot read `command.direction`
// on a `look` command.
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

// The return type `Command | undefined` is honest: some input is not a command.
// With strictNullChecks on (part of `strict`), every caller has to deal with the
// undefined case before using the result.
// https://ts-ladders.netlify.app/ladders/nullability/#step-1
export function parseCommand(input: string): Command | undefined {
  // Split "go north" into the verb "go" and the rest "north".
  //
  // The first piece is `string | undefined`: with noUncheckedIndexedAccess on,
  // reading a position of an array might find nothing, even for empty input.
  const [verb, ...rest] = input.trim().toLowerCase().split(/\s+/);
  const argument = rest.join(' ');

  // A switch over a string. Each `case` returns one member of the union.
  switch (verb) {
    case 'look':
    case 'l':
      return { kind: 'look' };

    case 'go':
      // isDirection is a type predicate. Inside this branch `argument` is a
      // Direction, so the object below is a valid { kind: 'go'; direction }.
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

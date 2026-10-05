// TYPES: the shapes of the things in the game.
//
// This file shows:
//   - object types with optional and read-only members
//   - combining types with & (intersection)
//   - a union of literal values
//   - a tuple with labeled positions
//   - Record, Partial, and Pick
//
// Ladder: Object shape
//   https://ts-ladders.netlify.app/ladders/shape/

// `import type` says "this import is only a type". It is removed when the
// code is compiled, and TypeScript will not let you use it as a value.
// https://ts-ladders.netlify.app/ladders/declarations/#step-5
import type { Direction } from './directions.js';

// A UNION OF LITERALS: a RoomId is exactly one of these four strings.
// Typing 'entrence' by mistake is a compile error, not a bug found later.
// https://ts-ladders.netlify.app/ladders/unions/#step-1
export type RoomId = 'entrance' | 'tunnel' | 'library' | 'vault';

// A TUPLE: an array with a fixed length where each position has its own type.
// The labels (x and y) are documentation for the reader.
// https://ts-ladders.netlify.app/ladders/arrays/#step-5
export type Coordinates = readonly [x: number, y: number];

// Small object types, each with one job.
// `readonly` means the member can be set when the object is made and never
// reassigned. https://ts-ladders.netlify.app/ladders/shape/#step-3
type Named = { readonly name: string };
type Described = { readonly description: string };

// INTERSECTION with &: an Item has everything from Named, everything from
// Described, and an id.
// https://ts-ladders.netlify.app/ladders/shape/#step-5
export type Item = Named & Described & { readonly id: string };

// A Record with only SOME of its keys: a room has an exit for each direction
// it has a door in, and no entry for the rest. Partial makes every key optional.
// Reading `exits.north` gives a RoomId or undefined, and TypeScript makes you
// handle both. https://ts-ladders.netlify.app/ladders/record/#step-4
export type Exits = Partial<Record<Direction, RoomId>>;

export type Room = Named &
  Described & {
    readonly id: RoomId;
    readonly position: Coordinates;
    readonly exits: Exits;
    // The question mark makes `locked` OPTIONAL: most rooms leave it out.
    // https://ts-ladders.netlify.app/ladders/shape/#step-2
    readonly locked?: boolean;
    // Not readonly: picking an item up removes it from this list.
    items: Item[];
  };

export type Player = {
  name: string;
  health: number;
  room: RoomId;
};

// UTILITY TYPES build new types from old ones.
// Pick keeps only the listed members. Partial makes them all optional.
// The result is `{ health?: number; room?: RoomId }`: "some of these changes".
// https://ts-ladders.netlify.app/ladders/utilities/#step-3
export type PlayerUpdate = Partial<Pick<Player, 'health' | 'room'>>;

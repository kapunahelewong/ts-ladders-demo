// TYPES: the shapes of the things in the game.
//
// This file shows:
//   - object types with optional and read-only members
//   - combining types with `&`, which is an intersection
//   - a union of literal values
//   - a tuple with labeled positions
//   - `Record`, `Partial`, and `Pick`
//
// Ladder: Object shape
//   https://ts-ladders.netlify.app/ladders/shape/

// `import type` states that the import is only a type. The import is removed when
// the code is compiled, and TypeScript reports an error if the name is used as a
// value.
// https://ts-ladders.netlify.app/ladders/declarations/#step-5
import type { Direction } from './directions.js';

// A union of literals: a `RoomId` is one of these four strings. Typing
// `'entrence'` by mistake is a compile error.
// https://ts-ladders.netlify.app/ladders/unions/#step-1
export type RoomId = 'entrance' | 'tunnel' | 'library' | 'vault';

// A tuple is an array with a fixed length, where each position has its own type.
// The labels `x` and `y` name the positions for the reader.
// https://ts-ladders.netlify.app/ladders/arrays/#step-5
export type Coordinates = readonly [x: number, y: number];

// Object types for the parts that items and rooms share.
// `readonly` means that the member is set when the object is made and is not
// assigned again. https://ts-ladders.netlify.app/ladders/shape/#step-3
type Named = { readonly name: string };
type Described = { readonly description: string };

// An intersection, written with `&`, has everything from each type. An `Item` has
// everything from `Named`, everything from `Described`, and an `id`.
// https://ts-ladders.netlify.app/ladders/shape/#step-5
export type Item = Named & Described & { readonly id: string };

// A `Record` that has some of its keys: a room has an exit for each direction
// that has a door, and no entry for the other directions. `Partial` makes every
// key optional. Reading `exits.north` gives a `RoomId` or `undefined`, and
// TypeScript requires the code to handle both.
// https://ts-ladders.netlify.app/ladders/record/#step-4
export type Exits = Partial<Record<Direction, RoomId>>;

export type Room = Named &
  Described & {
    readonly id: RoomId;
    readonly position: Coordinates;
    readonly exits: Exits;
    // The question mark makes `locked` optional. Most rooms leave it out.
    // https://ts-ladders.netlify.app/ladders/shape/#step-2
    readonly locked?: boolean;
    // This member is not `readonly`, because picking up an item removes the item
    // from the list.
    items: Item[];
  };

export type Player = {
  name: string;
  health: number;
  room: RoomId;
};

// Utility types build new types from existing types. `Pick` keeps the listed
// members, and `Partial` makes them optional. The result is
// `{ health?: number; room?: RoomId }`, an object that holds only the members
// that changed.
// https://ts-ladders.netlify.app/ladders/utilities/#step-3
export type PlayerUpdate = Partial<Pick<Player, 'health' | 'room'>>;

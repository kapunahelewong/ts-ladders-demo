// WORLD: the rooms and the items, written as plain data.
//
// This file shows:
//   - `satisfies`, which checks an object against a type and keeps the exact type
//   - a type made from a value, with `keyof typeof`
//   - `as const` for a list of exact values
//
// Ladder: Record, step 8 (satisfies)
//   https://ts-ladders.netlify.app/ladders/record/#step-8

import { Direction } from './directions.js';
import type { Item, Room, RoomId } from './types.js';

// `satisfies` checks that this object matches the type on the right, and then
// keeps the exact type of the object. With a type annotation such as
// `: Record<...>`, the type of the object would be `Record<...>`, and TypeScript
// would no longer know the keys. With `satisfies`, TypeScript knows that the
// object has four items, named `lamp`, `sword`, `key`, and `crown`.
export const itemCatalog = {
  lamp: { id: 'lamp', name: 'lamp', description: 'A brass lamp. It still has oil.' },
  sword: { id: 'sword', name: 'sword', description: 'A short sword. Rusty, but pointy.' },
  key: { id: 'key', name: 'key', description: 'A heavy iron key with a skull on it.' },
  crown: { id: 'crown', name: 'crown', description: 'A golden crown. It is slightly too big for anyone.' },
} satisfies Record<string, Item>;

// A type made from a value. `typeof itemCatalog` is the type of the object, and
// `keyof` gives its keys: 'lamp' | 'sword' | 'key' | 'crown'. If an item is added
// to the catalog above, this type includes it.
// https://ts-ladders.netlify.app/ladders/shape/#step-7
export type ItemId = keyof typeof itemCatalog;

// A type predicate that narrows a `string` to an `ItemId`. `Object.hasOwn` checks
// the own keys of the object, so a name such as `'toString'` does not pass.
export function isItemId(value: string): value is ItemId {
  return Object.hasOwn(itemCatalog, value);
}

// Every room id as a list, for code that checks a value from outside the program.
// `save.ts` is an example. `satisfies readonly RoomId[]` checks that each entry
// is a `RoomId`.
export const roomIds = ['entrance', 'tunnel', 'library', 'vault'] as const satisfies readonly RoomId[];

// The rooms where a monster waits. `as const` keeps the exact strings, and the
// type below turns the list into the union 'tunnel' | 'library' | 'vault'.
// https://ts-ladders.netlify.app/ladders/arrays/#step-7
export const monsterRooms = ['tunnel', 'library', 'vault'] as const;
export type MonsterRoom = (typeof monsterRooms)[number];

// One entry for each `RoomId`. If a `RoomId` is added to the union in `types.ts`
// and is not listed here, TypeScript reports the missing room.
const roomTemplates = {
  entrance: {
    id: 'entrance',
    name: 'Cave entrance',
    description: 'Daylight spills in behind you. A passage leads north into the dark.',
    position: [0, 0],
    exits: { [Direction.North]: 'tunnel' },
    items: [itemCatalog.lamp],
  },
  tunnel: {
    id: 'tunnel',
    name: 'Dripping tunnel',
    description: 'Water drips from the ceiling. Doors lead east, north, and back south.',
    position: [0, 1],
    exits: { [Direction.South]: 'entrance', [Direction.East]: 'library', [Direction.North]: 'vault' },
    items: [],
  },
  library: {
    id: 'library',
    name: 'Ruined library',
    description: 'Shelves lean over like tired giants. A door leads west.',
    position: [1, 1],
    exits: { [Direction.West]: 'tunnel' },
    items: [itemCatalog.sword, itemCatalog.key],
  },
  vault: {
    id: 'vault',
    name: 'Treasure vault',
    description: 'Gold glitters on the floor. A door leads south.',
    position: [0, 2],
    exits: { [Direction.South]: 'tunnel' },
    // An optional member in use. Only the vault has it.
    locked: true,
    items: [itemCatalog.crown],
  },
} satisfies Record<RoomId, Room>;

// A new copy of the world for each game. Picking up an item changes a room, and
// the templates above have to stay unchanged.
export function createWorld(): Record<RoomId, Room> {
  return structuredClone(roomTemplates);
}

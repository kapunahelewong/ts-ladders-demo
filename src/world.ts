// WORLD: the rooms and the items, written as plain data.
//
// This file shows:
//   - `satisfies`: check an object against a type and keep the exact type
//   - a type made from a value (keyof typeof)
//   - `as const` for a list of exact values
//
// Ladder: Record, step 8 (satisfies)
//   https://ts-ladders.netlify.app/ladders/record/#step-8

import { Direction } from './directions.js';
import type { Item, Room, RoomId } from './types.js';

// SATISFIES checks that this object matches the type on the right, and then
// keeps the exact type of the object. With a plain annotation (`: Record<...>`)
// the keys would be forgotten. With `satisfies` TypeScript still knows that
// there are exactly four items named lamp, sword, key, and crown.
export const itemCatalog = {
  lamp: { id: 'lamp', name: 'lamp', description: 'A brass lamp. It still has oil.' },
  sword: { id: 'sword', name: 'sword', description: 'A short sword. Rusty, but pointy.' },
  key: { id: 'key', name: 'key', description: 'A heavy iron key with a skull on it.' },
  crown: { id: 'crown', name: 'crown', description: 'A golden crown. It is slightly too big for anyone.' },
} satisfies Record<string, Item>;

// A TYPE MADE FROM A VALUE. `typeof itemCatalog` is the type of the object, and
// `keyof` gives its keys: 'lamp' | 'sword' | 'key' | 'crown'.
// Add an item to the catalog above and this type grows with it.
// https://ts-ladders.netlify.app/ladders/shape/#step-7
export type ItemId = keyof typeof itemCatalog;

// A TYPE PREDICATE again: narrows a plain string to an ItemId.
// Object.hasOwn checks the object's own keys, so 'toString' does not pass.
export function isItemId(value: string): value is ItemId {
  return Object.hasOwn(itemCatalog, value);
}

// Every room id as a list, for code that has to check a value from outside the
// program (see save.ts). `satisfies readonly RoomId[]` checks that each entry is
// a real RoomId.
export const roomIds = ['entrance', 'tunnel', 'library', 'vault'] as const satisfies readonly RoomId[];

// The rooms where a monster waits. `as const` keeps the exact words, and the
// type below turns the list into the union 'tunnel' | 'library' | 'vault'.
// https://ts-ladders.netlify.app/ladders/arrays/#step-7
export const monsterRooms = ['tunnel', 'library', 'vault'] as const;
export type MonsterRoom = (typeof monsterRooms)[number];

// One entry per RoomId. If a RoomId is added to the union in types.ts and not
// listed here, TypeScript reports the missing room.
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
    // Optional member in use: only the vault has it.
    locked: true,
    items: [itemCatalog.crown],
  },
} satisfies Record<RoomId, Room>;

// A fresh copy of the world for each new game. Picking up an item changes a
// room, and the templates above must stay as they were.
export function createWorld(): Record<RoomId, Room> {
  return structuredClone(roomTemplates);
}

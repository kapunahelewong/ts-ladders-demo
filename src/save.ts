// SAVE: reading data that comes from outside the program.
//
// Data from a file, a server, or a form has a type that TypeScript cannot know.
// This file shows how to read that data:
//
//   - `JSON.parse` returns `any`, which turns type checking off
//   - `unknown` requires a check before the value is used
//   - type guards turn an `unknown` value into a specific type, one check at a time
//   - a result union reports a failure without throwing
//
// Ladders: Outside data, Unions and narrowing
//   https://ts-ladders.netlify.app/ladders/outside-data/
//   https://ts-ladders.netlify.app/ladders/unions/#step-7

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
// Only the type of `GameState` is needed here. `game.ts` imports this file as a
// value, so a type-only import avoids a circular import when the program runs.
import type { GameState } from './game.js';
import type { Player, RoomId } from './types.js';
import { isItemId, monsterRooms, roomIds } from './world.js';
import type { ItemId, MonsterRoom } from './world.js';

const SAVE_FILE = 'savegame.json';

// What a save file must contain once it has been checked.
// `version: 1` is a literal type, and the only value it allows is the number 1.
// A later change to the format would use version 2.
export type SaveData = {
  version: 1;
  player: Player;
  carrying: ItemId[];
  defeated: MonsterRoom[];
};

// A result union. A function that can fail returns one of two object types, and
// the `ok` field tells them apart, which makes this a discriminated union. The
// caller has to check `ok` before reading `data` or `reason`.
export type LoadResult = { ok: true; data: SaveData } | { ok: false; reason: string };

// Type guards. Each guard checks one more thing about an `unknown` value.

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isRoomId(value: unknown): value is RoomId {
  return typeof value === 'string' && roomIds.some((id) => id === value);
}

function isMonsterRoom(value: unknown): value is MonsterRoom {
  return typeof value === 'string' && monsterRooms.some((id) => id === value);
}

function isItemIdValue(value: unknown): value is ItemId {
  return typeof value === 'string' && isItemId(value);
}

function isPlayer(value: unknown): value is Player {
  // After `isRecord` passes, `value` has the type `Record<string, unknown>`. The
  // value is an object, and the type of each property is `unknown`, so each
  // property has to be checked before it is used.
  return (
    isRecord(value) &&
    typeof value.name === 'string' &&
    typeof value.health === 'number' &&
    isRoomId(value.room)
  );
}

// The last guard combines the others. `Array.isArray` narrows a value to an
// array, and `.every(guard)` checks each item in it.
// https://ts-ladders.netlify.app/ladders/outside-data/#step-3
function isSaveData(value: unknown): value is SaveData {
  return (
    isRecord(value) &&
    value.version === 1 &&
    isPlayer(value.player) &&
    Array.isArray(value.carrying) &&
    value.carrying.every(isItemIdValue) &&
    Array.isArray(value.defeated) &&
    value.defeated.every(isMonsterRoom)
  );
}

// Reading and writing the save file.

export function toSaveData(state: GameState): SaveData {
  return {
    version: 1,
    player: { ...state.player },
    // `.filter(isItemId)` uses the type predicate to narrow the array. A
    // `string[]` goes in, and an `ItemId[]` comes out.
    // https://ts-ladders.netlify.app/ladders/narrowing-practice/#step-5
    carrying: state.inventory
      .list()
      .map((item) => item.id)
      .filter(isItemId),
    defeated: monsterRooms.filter((room) => !state.monsters.has(room)),
  };
}

export function writeSave(data: SaveData): void {
  writeFileSync(SAVE_FILE, JSON.stringify(data, null, 2));
}

export function readSave(): LoadResult {
  if (!existsSync(SAVE_FILE)) {
    return { ok: false, reason: 'There is no saved game yet. Type save first.' };
  }

  try {
    const text = readFileSync(SAVE_FILE, 'utf8');

    // `JSON.parse` returns `any`. Writing `: unknown` on this line gives `parsed`
    // the type `unknown` instead, so no line below can use `parsed` before a
    // check.
    // https://ts-ladders.netlify.app/ladders/outside-data/#step-2
    const parsed: unknown = JSON.parse(text);

    if (!isSaveData(parsed)) {
      return { ok: false, reason: 'The save file is not a valid Cave of Types save.' };
    }
    // Here `parsed` has the type `SaveData`, because the guard above returned
    // `true`.
    return { ok: true, data: parsed };
  } catch (error) {
    // Under `strict`, the caught value has the type `unknown`. Errors are usually
    // `Error` objects, but any value can be thrown, so the code checks the value
    // before reading `.message`.
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, reason: `Could not read the save file: ${message}` };
  }
}

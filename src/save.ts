// SAVE: reading data that comes from OUTSIDE the program.
//
// This file shows the most important rule for real-world TypeScript:
//   data from a file, a server, or a form has a type TypeScript cannot know.
//
//   - JSON.parse returns `any`, which switches type checking off
//   - `unknown` is the safe alternative: it forces a check before use
//   - type guards turn `unknown` into a real type, one check at a time
//   - a result union reports failure without throwing
//
// Ladders: Outside data, Unions and narrowing
//   https://ts-ladders.netlify.app/ladders/outside-data/
//   https://ts-ladders.netlify.app/ladders/unions/#step-7

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
// Only the TYPE of GameState is needed here. game.ts imports this file for real,
// so a type-only import avoids a circular import at runtime.
import type { GameState } from './game.js';
import type { Player, RoomId } from './types.js';
import { isItemId, monsterRooms, roomIds } from './world.js';
import type { ItemId, MonsterRoom } from './world.js';

const SAVE_FILE = 'savegame.json';

// What a save file must contain once it has been checked.
// `version: 1` is a LITERAL type: the only allowed value is the number 1.
// A future change to the format would use version 2.
export type SaveData = {
  version: 1;
  player: Player;
  carrying: ItemId[];
  defeated: MonsterRoom[];
};

// A RESULT UNION. A function that can fail returns one of two shapes, and the
// `ok` field tells them apart (this is a discriminated union).
// The caller has to check `ok` before it can reach `data` or `reason`.
export type LoadResult = { ok: true; data: SaveData } | { ok: false; reason: string };

// --- Type guards: each one narrows `unknown` a little further ---------------

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
  // After isRecord passes, `value` is a Record<string, unknown>: we know it is
  // an object, and we know NOTHING about what is inside, so each property has
  // to be checked before it is trusted.
  return (
    isRecord(value) &&
    typeof value.name === 'string' &&
    typeof value.health === 'number' &&
    isRoomId(value.room)
  );
}

// The last guard puts them together. `Array.isArray` narrows to an array, and
// `.every(guard)` checks each item in it.
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

// --- Reading and writing ----------------------------------------------------

export function toSaveData(state: GameState): SaveData {
  return {
    version: 1,
    player: { ...state.player },
    // `.filter(isItemId)` uses the type predicate to narrow the array itself:
    // string[] goes in and ItemId[] comes out.
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

    // JSON.parse is typed to return `any`. Writing `: unknown` on the line
    // replaces that with the safe type, so nothing below can use `parsed`
    // without a check.
    // https://ts-ladders.netlify.app/ladders/outside-data/#step-2
    const parsed: unknown = JSON.parse(text);

    if (!isSaveData(parsed)) {
      return { ok: false, reason: 'The save file is not a valid Cave of Types save.' };
    }
    // Here `parsed` is a SaveData, because the guard above returned true.
    return { ok: true, data: parsed };
  } catch (error) {
    // Under `strict`, the caught value is `unknown`. Real errors are Error
    // objects, but anything can be thrown, so check before reading `.message`.
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, reason: `Could not read the save file: ${message}` };
  }
}

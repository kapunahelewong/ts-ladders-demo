// GAME: the state of the game and what each command does.
//
// This file shows:
//   - a `switch` over a discriminated union, with an exhaustiveness check
//   - function overloads
//   - `undefined` handling: `=== undefined`, `?.`, and `??`
//   - `Partial` and `Pick` in use, in `PlayerUpdate`
//
// Ladder: Unions and narrowing, Functions, Null and undefined
//   https://ts-ladders.netlify.app/ladders/unions/#step-4
//   https://ts-ladders.netlify.app/ladders/functions/#step-7

import { describeDefeat, resolveRound } from './combat.js';
import type { Command } from './commands.js';
import { Difficulty } from './difficulty.js';
import type { Direction } from './directions.js';
import { Inventory } from './inventory.js';
import { Bat, Goblin, SkeletonKing } from './monsters.js';
import type { Monster } from './monsters.js';
import { readSave, toSaveData, writeSave } from './save.js';
import type { SaveData } from './save.js';
import type { Item, Player, PlayerUpdate, Room, RoomId } from './types.js';
import { assertNever, findByName } from './util.js';
import { createWorld, itemCatalog } from './world.js';

export type GameState = {
  player: Player;
  rooms: Record<RoomId, Room>;
  // Maps a room to the monster in it. A defeated monster is deleted from the map.
  monsters: Map<RoomId, Monster>;
  // A generic class from `inventory.ts`, with `T` set to `Item`.
  inventory: Inventory<Item>;
  difficulty: Difficulty;
};

// What a command produces. This is a second discriminated union, and `kind` tells
// the members apart.
export type Outcome =
  | { kind: 'message'; text: string }
  | { kind: 'won'; text: string }
  | { kind: 'died'; text: string }
  | { kind: 'quit' };

const say = (text: string): Outcome => ({ kind: 'message', text });

// A default parameter: `difficulty` is `Difficulty.Normal` when the caller leaves
// it out. TypeScript infers the type, `Difficulty`, from the default value.
export function newGame(name: string, difficulty = Difficulty.Normal): GameState {
  return {
    player: { name, health: 10, room: 'entrance' },
    rooms: createWorld(),
    monsters: new Map<RoomId, Monster>([
      ['tunnel', new Bat()],
      ['library', new Goblin()],
      ['vault', new SkeletonKing()],
    ]),
    inventory: new Inventory<Item>(),
    difficulty,
  };
}

// Rebuilds a game from save data that has been checked. `save.ts` does the
// checking.
function restoreGame(data: SaveData): GameState {
  const state = newGame(data.player.name);
  state.player = { ...data.player };

  for (const id of data.carrying) {
    // `id` has the type `ItemId`, so this lookup always finds an item.
    state.inventory.add(itemCatalog[id]);
    // The item is in the player's hands now, so remove it from every room.
    for (const room of Object.values(state.rooms)) {
      room.items = room.items.filter((item) => item.id !== id);
    }
  }
  for (const room of data.defeated) {
    state.monsters.delete(room);
  }
  return state;
}

// A partial update. The parameter type is `PlayerUpdate`, which is
// `{ health?: number; room?: RoomId }`, so a caller passes only the members that
// changed. `Object.assign` copies the given members onto the player.
function updatePlayer(player: Player, update: PlayerUpdate): void {
  Object.assign(player, update);
}

function currentRoom(state: GameState): Room {
  // Indexing a `Record` with a union of its own keys always finds a value, so the
  // result has the type `Room`. The type is not `Room | undefined`.
  return state.rooms[state.player.room];
}

// Function overloads. Two signatures are written first, and one implementation
// follows. Callers see only the first two signatures:
//
//   lookup(state, 'monster')        returns Monster | undefined
//   lookup(state, 'item', 'lamp')   returns Item | undefined
//
// The result type depends on the first argument. A single signature that uses
// unions cannot state that relationship. The implementation signature, which is
// the third, cannot be called from outside.
// https://ts-ladders.netlify.app/ladders/functions/#step-7
function lookup(state: GameState, kind: 'monster'): Monster | undefined;
function lookup(state: GameState, kind: 'item', name: string): Item | undefined;
function lookup(state: GameState, kind: 'monster' | 'item', name?: string): Monster | Item | undefined {
  if (kind === 'monster') {
    // Optional chaining: `?.` reads a member when the value is not `undefined`, and
    // gives `undefined` otherwise.
    // https://ts-ladders.netlify.app/ladders/nullability/#step-4
    const monster = state.monsters.get(state.player.room);
    return monster?.isAlive ? monster : undefined;
  }
  // `name ?? ''` uses the empty string when `name` is `undefined`.
  // https://ts-ladders.netlify.app/ladders/nullability/#step-5
  return findByName(currentRoom(state).items, name ?? '');
}

function describeRoom(state: GameState): string {
  const room = currentRoom(state);
  const lines = [`== ${room.name} ==`, room.description];

  const monster = lookup(state, 'monster');
  if (monster !== undefined) {
    // Inside this `if`, `monster` has the type `Monster`. Outside it, the type is
    // `Monster | undefined`.
    lines.push(monster.describe(), monster.roar());
  }
  if (room.items.length > 0) {
    lines.push(`You see: ${room.items.map((item) => item.name).join(', ')}.`);
  }
  // `Object.keys` gives the directions that have an exit.
  lines.push(`Exits: ${Object.keys(room.exits).join(', ')}.`);
  return lines.join('\n');
}

function go(state: GameState, direction: Direction): Outcome {
  const monster = lookup(state, 'monster');
  if (monster !== undefined) {
    return say(`The ${monster.name} blocks your way. Try: attack`);
  }

  // `exits` is a `Partial` `Record`, so the result can be `undefined`.
  const nextId = currentRoom(state).exits[direction];
  if (nextId === undefined) {
    return say('You cannot go that way.');
  }

  const next = state.rooms[nextId];
  if (next.locked && !state.inventory.has(itemCatalog.key.id)) {
    return say('The door is locked. You need a key.');
  }

  updatePlayer(state.player, { room: nextId });
  return say(describeRoom(state));
}

function take(state: GameState, itemName: string): Outcome {
  const item = lookup(state, 'item', itemName);
  if (item === undefined) {
    return say(`There is no "${itemName}" here.`);
  }

  const room = currentRoom(state);
  room.items = room.items.filter((candidate) => candidate.id !== item.id);
  state.inventory.add(item);

  if (item.id === itemCatalog.crown.id) {
    return { kind: 'won', text: `You lift the crown. It is far too big, but it is yours. You win, ${state.player.name}!` };
  }
  return say(`You take the ${item.name}.`);
}

function attack(state: GameState): Outcome {
  const monster = lookup(state, 'monster');
  if (monster === undefined) {
    return say('There is nothing to attack here.');
  }

  // The sword adds 3 to the damage.
  const power = 2 + (state.inventory.has(itemCatalog.sword.id) ? 3 : 0);
  const round = resolveRound(power, monster, state.difficulty);
  updatePlayer(state.player, { health: state.player.health - round.taken });

  if (!monster.isAlive) {
    state.monsters.delete(state.player.room);
    return say(`You hit the ${monster.name} for ${round.dealt}. ${describeDefeat(monster)}`);
  }
  if (state.player.health <= 0) {
    return { kind: 'died', text: `The ${monster.name} wins this one. You collapse. Game over.` };
  }
  return say(
    `You hit the ${monster.name} for ${round.dealt}. It hits back for ${round.taken}. You have ${state.player.health} health.`,
  );
}

const HELP = [
  'Commands:',
  '  look              describe the room',
  '  go <direction>    go north, south, east, or west',
  '  take <item>       pick something up',
  '  attack            fight the monster in the room',
  '  inventory         list what you carry',
  '  save / load       save or load your game',
  '  quit              leave the cave',
].join('\n');

// The exhaustive `switch`.
//
// Each `case` handles one member of the `Command` union. Inside a `case`,
// TypeScript knows which member `command` is, so `command.direction` is
// available in the `'go'` case and in no other case.
//
// The `default` branch is the check. When every member has a `case`, `command` is
// narrowed to `never` by the time it reaches `default`, and `assertNever`
// accepts it. If a new kind is added to `Command` without a `case`, `command` is
// no longer `never` here, and the line is a compile error that names the missing
// kind.
// https://ts-ladders.netlify.app/ladders/unions/#step-4
export function applyCommand(state: GameState, command: Command): Outcome {
  switch (command.kind) {
    case 'look':
      return say(describeRoom(state));
    case 'go':
      return go(state, command.direction);
    case 'take':
      return take(state, command.itemName);
    case 'attack':
      return attack(state);
    case 'inventory': {
      const names = state.inventory.list().map((item) => item.name);
      return say(names.length > 0 ? `You carry: ${names.join(', ')}.` : 'You carry nothing.');
    }
    case 'help':
      return say(HELP);
    case 'save':
      writeSave(toSaveData(state));
      return say('Game saved.');
    case 'load': {
      const result = readSave();
      // Checking `result.ok` narrows the union. In the `true` branch `data`
      // exists, and in the `false` branch `reason` exists.
      if (!result.ok) {
        return say(result.reason);
      }
      Object.assign(state, restoreGame(result.data));
      return say(`Game loaded.\n${describeRoom(state)}`);
    }
    case 'quit':
      return { kind: 'quit' };
    default:
      return assertNever(command);
  }
}

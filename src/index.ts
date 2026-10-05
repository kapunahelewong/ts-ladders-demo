// INDEX: a "barrel file". It re-exports names from the other files so that the
// rest of the code can import everything from one place.
//
//   import { applyCommand, Direction } from './index.js';
//
// Without it, each import would need the path of the file that defines the name,
// and moving a file would break its importers.
//
// Ladder: Modules and imports
//   https://ts-ladders.netlify.app/ladders/modules/#step-4

// `export *` passes along every named export of a file.
export * from './types.js';

// A named re-export passes along only the names you list.
export { Direction, isDirection, opposite } from './directions.js';
export { Difficulty, damageTaken } from './difficulty.js';
export { parseCommand } from './commands.js';
export { Monster, Bat, Goblin, SkeletonKing } from './monsters.js';
export { Inventory } from './inventory.js';
export { applyCommand, newGame } from './game.js';

// `export type` re-exports names that are ONLY types. They are removed when the
// code is compiled, and `verbatimModuleSyntax` requires the word `type` here.
export type { Command } from './commands.js';
export type { Attacker } from './monsters.js';
export type { GameState, Outcome } from './game.js';

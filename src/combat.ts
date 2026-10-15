// COMBAT: one round of a fight.
//
// This file shows:
//   - `instanceof`, which narrows a value to a class
//   - a function that takes an instance of a class
//
// Ladder: Narrowing in practice
//   https://ts-ladders.netlify.app/ladders/narrowing-practice/#step-1

import { damageTaken } from './difficulty.js';
import type { Difficulty } from './difficulty.js';
// These classes are imported as values, with no `type` keyword, because
// `instanceof` needs the class when the program runs. `Monster` is used only as
// a type, so it is imported with `import type`.
import { Bat, Goblin, SkeletonKing } from './monsters.js';
import type { Monster } from './monsters.js';

// The result of one round.
export type Round = { dealt: number; taken: number };

export function resolveRound(playerPower: number, monster: Monster, difficulty: Difficulty): Round {
  monster.takeDamage(playerPower);

  // The monster hits back only if it is still alive.
  // `damageTaken[difficulty]` looks up a number in the table in `difficulty.ts`.
  const taken = monster.isAlive ? Math.ceil(monster.attackPower() * damageTaken[difficulty]) : 0;

  return { dealt: playerPower, taken };
}

// Narrowing with `instanceof`. `monster` has the type `Monster`, which can be
// any subclass. Inside the branch where `monster instanceof SkeletonKing` is
// true, TypeScript treats `monster` as a `SkeletonKing`, so the members that
// only `SkeletonKing` has are available there.
export function describeDefeat(monster: Monster): string {
  if (monster instanceof SkeletonKing) {
    return 'The skeleton king collapses into a polite pile of bones. His crown no longer has an owner.';
  }
  if (monster instanceof Goblin) {
    return 'The goblin drops the book and runs off into the shelves.';
  }
  if (monster instanceof Bat) {
    return 'The bat flutters away, offended.';
  }
  // Every `Monster` subclass has a branch above, so this line runs only for a
  // subclass that is added later.
  return `The ${monster.name} is defeated.`;
}

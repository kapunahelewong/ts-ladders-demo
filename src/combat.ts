// COMBAT: one round of a fight.
//
// This file shows:
//   - instanceof, which narrows a value to a class
//   - a plain function that takes a class instance
//
// Ladder: Narrowing in practice
//   https://ts-ladders.netlify.app/ladders/narrowing-practice/#step-1

import { damageTaken } from './difficulty.js';
import type { Difficulty } from './difficulty.js';
// Here the classes are imported as VALUES (no `type`), because `instanceof`
// needs the real class at runtime. `Monster` is only used as a type.
import { Bat, Goblin, SkeletonKing } from './monsters.js';
import type { Monster } from './monsters.js';

// A small object type for the result of one round.
export type Round = { dealt: number; taken: number };

export function resolveRound(playerPower: number, monster: Monster, difficulty: Difficulty): Round {
  monster.takeDamage(playerPower);

  // The monster hits back only if it is still alive.
  // `damageTaken[difficulty]` looks up a number in the table from difficulty.ts.
  const taken = monster.isAlive ? Math.ceil(monster.attackPower() * damageTaken[difficulty]) : 0;

  return { dealt: playerPower, taken };
}

// INSTANCEOF NARROWING. `monster` has the type Monster, which could be any
// subclass. After `monster instanceof SkeletonKing` is true, TypeScript treats
// it as a SkeletonKing inside that branch, so subclass-only members would be
// available there.
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
  // Every Monster subclass has a branch above, so this line is only a fallback
  // for a subclass added later.
  return `The ${monster.name} is defeated.`;
}

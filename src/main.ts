// MAIN: the program. It reads a line, turns the line into a `Command`, applies
// the command, and prints the result. The logic is in the other files, and this
// file connects them.
//
// This file shows:
//   - importing everything from the barrel file (index.ts)
//   - an async function with a Promise return type
//   - handling `undefined` before using a value
//   - a second exhaustive `switch`, this one over `Outcome`

// The path ends in `.js`, although the file is `index.ts`. With the `NodeNext`
// setting, the path is written as it will be after the build.
// https://ts-ladders.netlify.app/ladders/project-setup/#step-4
import { applyCommand, newGame, parseCommand } from './index.js';
import { assertNever } from './util.js';
import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';

// An `async` function returns a `Promise`. The return type `Promise<void>`
// states that the function finishes later and returns no value. `for await`
// waits for each line that the player types.
// https://ts-ladders.netlify.app/ladders/functions/#step-5
async function main(): Promise<void> {
  // `process.argv[2]` is the first word after the command, or `undefined` when
  // there is none. `??` supplies a default for `undefined` and for `null`.
  const name = process.argv[2] ?? 'Adventurer';
  const state = newGame(name);

  console.log('=== CAVE OF TYPES ===');
  console.log(`Welcome, ${name}. Somewhere in this cave is a crown. Type "help" for commands.\n`);

  // The first look around.
  const first = parseCommand('look');
  if (first !== undefined) {
    const outcome = applyCommand(state, first);
    if (outcome.kind === 'message') console.log(outcome.text);
  }

  const rl = readline.createInterface({ input, output });
  rl.setPrompt('\n> ');
  rl.prompt();

  for await (const line of rl) {
    const command = parseCommand(line);

    // `parseCommand` returns `Command | undefined`. Until the `undefined` case is
    // handled, `command` cannot be passed to `applyCommand`.
    if (command === undefined) {
      console.log('I do not understand. Type "help" for the list of commands.');
      rl.prompt();
      continue;
    }

    const outcome = applyCommand(state, command);

    // A second exhaustive `switch`. If a new kind is added to `Outcome`,
    // TypeScript reports the `assertNever` line until a `case` handles it.
    switch (outcome.kind) {
      case 'message':
        console.log(outcome.text);
        break;
      case 'won':
        console.log(outcome.text);
        rl.close();
        return;
      case 'died':
        console.log(outcome.text);
        rl.close();
        return;
      case 'quit':
        console.log('You leave the cave. Goodbye!');
        rl.close();
        return;
      default:
        assertNever(outcome);
    }
    rl.prompt();
  }
}

// A failure inside an `async` function becomes a rejected `Promise`. Without a
// `catch`, Node ends the program with an unhandled rejection error. This `catch`
// prints a message and sets the exit code.
main().catch((error: unknown) => {
  console.error('The game crashed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

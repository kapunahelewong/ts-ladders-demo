# Cave of Types

A text adventure that you play in the terminal, and a guided tour of TypeScript while you read it.

You walk through four rooms, pick up a lamp, a sword, and a key, beat three monsters, and take a crown from a vault. This is a small game that demonstrates TypeScript features. Every file is short, and every file has comments that explain what each piece of TypeScript does and why.

This project is the code companion to **[TypeScript Ladders: Foundations](https://ts-ladders.netlify.app/)**. Each comment in the code links to the card that teaches that pattern, so you can read the code, then open the card, or the other way around.

## Play it

You need Node 22 or newer.

```bash
git clone https://github.com/kapunahelewong/ts-ladders-demo.git
cd ts-ladders-demo
npm install
npm start
```

To use your own name:

```bash
npm start -- Ada
```

Type `help` in the game for the commands. A winning run takes about a minute:

```text
take lamp
go north
attack
attack
go east
attack
attack
attack
take sword
take key
go west
go north
attack
attack
take crown
```

## Read it

Read the files in this order. Each one adds a few ideas, and each one is under 150 lines.

| Order | File | What it shows | Ladders |
| --- | --- | --- | --- |
| 1 | [`tsconfig.json`](tsconfig.json) | Every compiler option the project uses, with a comment on each. | [Project setup](https://ts-ladders.netlify.app/ladders/project-setup/) |
| 2 | [`src/types.ts`](src/types.ts) | Object types, optional and read-only members, `&`, tuples, `Record`, `Partial`, `Pick`. | [Object shape](https://ts-ladders.netlify.app/ladders/shape/), [Record](https://ts-ladders.netlify.app/ladders/record/), [Utilities](https://ts-ladders.netlify.app/ladders/utilities/) |
| 3 | [`src/directions.ts`](src/directions.ts) | A constant object and a type made from it, a type predicate, a `Record` with every key. | [Enums and constants](https://ts-ladders.netlify.app/ladders/enums/) |
| 4 | [`src/difficulty.ts`](src/difficulty.ts) | A real `enum`. | [Enums and constants](https://ts-ladders.netlify.app/ladders/enums/#step-1) |
| 5 | [`src/world.ts`](src/world.ts) | `satisfies`, `keyof typeof`, `as const`. | [Record](https://ts-ladders.netlify.app/ladders/record/#step-8) |
| 6 | [`src/commands.ts`](src/commands.ts) | A discriminated union and parsing text into it. | [Unions and narrowing](https://ts-ladders.netlify.app/ladders/unions/) |
| 7 | [`src/monsters.ts`](src/monsters.ts) | Abstract classes, subclasses, parameter properties, `private` and `#`, `implements`. | [Classes](https://ts-ladders.netlify.app/ladders/classes/) |
| 8 | [`src/inventory.ts`](src/inventory.ts) | A generic class with a constraint. | [Generics](https://ts-ladders.netlify.app/ladders/generics/) |
| 9 | [`src/util.ts`](src/util.ts) | A generic function, an assertion function, and the `never` check. | [Generics](https://ts-ladders.netlify.app/ladders/generics/), [Narrowing in practice](https://ts-ladders.netlify.app/ladders/narrowing-practice/) |
| 10 | [`src/combat.ts`](src/combat.ts) | `instanceof` narrowing. | [Narrowing in practice](https://ts-ladders.netlify.app/ladders/narrowing-practice/#step-1) |
| 11 | [`src/game.ts`](src/game.ts) | The exhaustive `switch`, function overloads, `?.` and `??`. | [Unions](https://ts-ladders.netlify.app/ladders/unions/#step-4), [Functions](https://ts-ladders.netlify.app/ladders/functions/#step-7), [Null and undefined](https://ts-ladders.netlify.app/ladders/nullability/) |
| 12 | [`src/save.ts`](src/save.ts) | Data from outside: `unknown`, type guards, a result union. | [Typing outside data](https://ts-ladders.netlify.app/ladders/outside-data/) |
| 13 | [`src/index.ts`](src/index.ts) | A barrel file, `export *`, `export type`. | [Modules and imports](https://ts-ladders.netlify.app/ladders/modules/) |
| 14 | [`src/main.ts`](src/main.ts) | `async` and `Promise`, and a second exhaustive `switch`. | [Functions](https://ts-ladders.netlify.app/ladders/functions/#step-5) |
| 15 | [`src/escape-hatches.ts`](src/escape-hatches.ts) | `as`, `@ts-expect-error`, and `any`: what they do and why to avoid them. | [Escape hatches](https://ts-ladders.netlify.app/ladders/escape-hatches/) |

## Break it on purpose

Changing the code on purpose shows what the compiler checks. Run `npm run check` after each change. The command checks the types and writes no files.

1. **Add a command.** In `src/commands.ts`, add `| { kind: 'dance' }` to `Command`. Do not change anything else. The error appears in `src/game.ts`, on the `assertNever` line, and the message names the missing kind. That is the exhaustiveness check from [Unions, step 4](https://ts-ladders.netlify.app/ladders/unions/#step-4). Fix it by adding a `case 'dance'`.
2. **Add a room.** Add `'cellar'` to `RoomId` in `src/types.ts`. The error appears in `src/world.ts`, because `roomTemplates` has to list every room.
3. **Add a direction.** Add `Up: 'up'` to the `Direction` object. The error appears in `opposite`, which has to list every direction.
4. **Forget `override`.** Delete the word `override` in front of `roar()` in `SkeletonKing`. The compiler reports it, because `roar` replaces a method that `Monster` already has and `noImplicitOverride` is on.
5. **Break the save file.** Run the game, type `save`, and edit `savegame.json` so that `health` is a string. Type `load`. The type guards reject the file, and the game prints a message and loads no data.
6. **Skip a check.** In `src/save.ts`, delete the `if (!isSaveData(parsed))` block. The `return` line becomes an error, because `parsed` is `unknown` and not known to be a `SaveData`. Now change `const parsed: unknown` to `const parsed: any`. The error disappears and the program accepts any file. This is the reason that TypeScript Ladders recommends `unknown`.

## Ideas to extend it

Each of these touches a different part of the code, so pick the one that matches what you want to practice.

- A new item and a new room (types, world data).
- A new monster subclass (classes, `instanceof`).
- A `map` command that prints each room's `position` (tuples).
- A `use <item>` command (discriminated unions, `Record`).
- A `Difficulty` choice from the command line (enums, parsing outside data).

## Commands

| Command | What it does |
| --- | --- |
| `npm start` | Builds the project and starts the game. |
| `npm run check` | Checks the types and writes nothing. |
| `npm run build` | Writes the compiled JavaScript to `dist/`. |

## License

[BSD Zero Clause License (0BSD)](LICENSE). The license allows anyone to use, copy, change, and share the code for any purpose, with no need to credit anyone.

## About this project

The code compiles under TypeScript 5.9 with `strict` on, and the playthrough above was run to the crown. The ladder links point to specific cards, so they stay accurate as long as the card order on the site does not change.

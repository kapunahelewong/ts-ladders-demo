// UTIL: small helpers that show generics, assertion functions, and `never`.
//
// Ladders: Generics, Narrowing in practice, Unions
//   https://ts-ladders.netlify.app/ladders/generics/
//   https://ts-ladders.netlify.app/ladders/narrowing-practice/
//   https://ts-ladders.netlify.app/ladders/unions/#step-4

// A generic function with a constraint.
//
//   <T extends { name: string }>
//
// `T` is a type parameter, and the caller chooses its type. `extends` is a
// constraint: `T` has to be a type with a `name` that is a `string`. The
// constraint is what allows the body to write `candidate.name`.
//
// The function works for items, monsters, and any other type with a `name`, and
// the result has the same type as the list that the caller passed in. No
// assertion is needed.
// https://ts-ladders.netlify.app/ladders/generics/#step-3
export function findByName<T extends { name: string }>(list: T[], name: string): T | undefined {
  // `Array.find` returns the first match, or `undefined` when nothing matches.
  // The return type `T | undefined` states both cases.
  return list.find((candidate) => candidate.name === name);
}

// An assertion function. The return type `asserts value is T` states that when
// the function returns, `value` has the type `T`. When the check fails, the
// function throws, so the code after the call never runs with an `undefined`
// value.
// https://ts-ladders.netlify.app/ladders/narrowing-practice/#step-4
export function assertDefined<T>(value: T | undefined, what: string): asserts value is T {
  if (value === undefined) {
    throw new Error(`Expected ${what} to exist`);
  }
}

// Exhaustiveness with `never`.
//
// `never` is the type that has no values. After a `switch` has handled every
// member of a union, the type that is left over is `never`. Passing the leftover
// to a function that requires `never` is allowed only when nothing is left over.
//
// To try it, add a new kind to `Command` in `commands.ts` and do not add a
// `case` for it. TypeScript reports an error on the `assertNever` call, and the
// message names the missing kind.
// https://ts-ladders.netlify.app/ladders/unions/#step-4
export function assertNever(value: never): never {
  // This line runs only when the types were bypassed, for example by data that
  // comes from outside the program.
  throw new Error(`Unhandled value: ${JSON.stringify(value)}`);
}

// UTIL: small helpers that show generics, assertion functions, and `never`.
//
// Ladders: Generics, Narrowing in practice, Unions
//   https://ts-ladders.netlify.app/ladders/generics/
//   https://ts-ladders.netlify.app/ladders/narrowing-practice/
//   https://ts-ladders.netlify.app/ladders/unions/#step-4

// A GENERIC FUNCTION WITH A CONSTRAINT.
//
//   <T extends { name: string }>
//
// T is a placeholder for a type. The caller chooses it. `extends` is a
// CONSTRAINT: whatever T is, it must have a `name` that is a string. That is
// what lets the body write `candidate.name`.
//
// It works for items, monsters, or anything else with a name, and the result
// has the same type the caller passed in. No casting.
// https://ts-ladders.netlify.app/ladders/generics/#step-3
export function findByName<T extends { name: string }>(list: T[], name: string): T | undefined {
  // Array.find returns the first match or undefined. `T | undefined` in the
  // return type is how this function admits that nothing may match.
  return list.find((candidate) => candidate.name === name);
}

// AN ASSERTION FUNCTION. The return type `asserts value is T` says:
// "if this function returns at all, `value` is a T afterwards."
// If the check fails the function throws, so the code after the call is safe.
// https://ts-ladders.netlify.app/ladders/narrowing-practice/#step-4
export function assertDefined<T>(value: T | undefined, what: string): asserts value is T {
  if (value === undefined) {
    throw new Error(`Expected ${what} to exist`);
  }
}

// EXHAUSTIVENESS WITH never.
//
// `never` is the type with no values. After a switch has handled every member
// of a union, the leftover type is never. Passing the leftover to a function
// that wants a never is allowed only when nothing is left over.
//
// Try it: add a new kind to `Command` in commands.ts and do NOT add a case for
// it. TypeScript will report an error on the assertNever call, and the message
// names the missing kind.
// https://ts-ladders.netlify.app/ladders/unions/#step-4
export function assertNever(value: never): never {
  // This line runs only if the types were bypassed, for example by data from
  // outside the program.
  throw new Error(`Unhandled value: ${JSON.stringify(value)}`);
}

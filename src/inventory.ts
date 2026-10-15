// INVENTORY: a generic class.
//
// This file shows:
//   - a class with a type parameter
//   - a constraint on the type parameter
//   - `Map`, whose `get` method returns `undefined` for a missing key
//
// Ladder: Generics
//   https://ts-ladders.netlify.app/ladders/generics/

// `Inventory<T>` is a class with a type parameter `T`, written in angle
// brackets. The code that uses the class chooses `T`:
//
//   new Inventory<Item>()      an inventory of items
//   new Inventory<Monster>()   an inventory of monsters, with no change to the class
//
// The constraint `extends { readonly id: string }` means that `T` can be any
// type that has a `string` member named `id`. The constraint is what allows the
// methods below to use `item.id`.
// https://ts-ladders.netlify.app/ladders/generics/#step-1
export class Inventory<T extends { readonly id: string }> {
  // A `Map` from an id to an item. The type of the `Map` uses `T`, so the type
  // changes with `T`.
  private readonly items = new Map<string, T>();

  add(item: T): void {
    this.items.set(item.id, item);
  }

  has(id: string): boolean {
    return this.items.has(id);
  }

  // `Map.get` returns `T | undefined`, because the key may not be in the `Map`.
  // `remove` returns the same type, so a caller handles the missing case.
  remove(id: string): T | undefined {
    const item = this.items.get(id);
    this.items.delete(id);
    return item;
  }

  // The spread syntax `[...]` copies the values of the `Map` into an array.
  list(): T[] {
    return [...this.items.values()];
  }

  get size(): number {
    return this.items.size;
  }
}

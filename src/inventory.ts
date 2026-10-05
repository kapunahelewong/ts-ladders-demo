// INVENTORY: a generic class.
//
// This file shows:
//   - a class with a type parameter
//   - a constraint on the type parameter
//   - Map, which returns undefined for a missing key
//
// Ladder: Generics
//   https://ts-ladders.netlify.app/ladders/generics/

// `Inventory<T>` is a class with a PLACEHOLDER type T, written in angle
// brackets. Whoever uses the class chooses T:
//
//   new Inventory<Item>()      an inventory of items
//   new Inventory<Monster>()   an inventory of monsters (no code change)
//
// The CONSTRAINT `extends { readonly id: string }` means T can be any type that
// has a string `id`. That is what lets the methods below use `item.id`.
// https://ts-ladders.netlify.app/ladders/generics/#step-1
export class Inventory<T extends { readonly id: string }> {
  // A Map from id to item. Its type uses T, so it follows whatever T is.
  private readonly items = new Map<string, T>();

  add(item: T): void {
    this.items.set(item.id, item);
  }

  has(id: string): boolean {
    return this.items.has(id);
  }

  // Map.get returns `T | undefined`, because the key may not be there.
  // This method keeps that honest in its own return type.
  remove(id: string): T | undefined {
    const item = this.items.get(id);
    this.items.delete(id);
    return item;
  }

  // The spread `[...]` turns the Map's values into an ordinary array.
  list(): T[] {
    return [...this.items.values()];
  }

  get size(): number {
    return this.items.size;
  }
}

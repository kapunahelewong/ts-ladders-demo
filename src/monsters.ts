// MONSTERS: classes.
//
// This file shows:
//   - an abstract class with subclasses
//   - parameter properties, which are constructor parameters that declare fields
//   - `public`, `protected`, `private`, `readonly`, and `#private`
//   - implementing an interface
//   - the `override` keyword
//
// Ladder: Classes
//   https://ts-ladders.netlify.app/ladders/classes/

// An interface describes the members that a type must have. An interface has no
// code, and it is removed when the code is compiled. A class that says
// `implements Attacker` is checked against the interface.
// https://ts-ladders.netlify.app/ladders/classes/#step-4
export interface Attacker {
  attackPower(): number;
}

// An abstract class cannot be constructed with `new`. The class exists to be
// extended. `abstract describe()` is a required member: every subclass has to
// write it, and TypeScript reports an error when a subclass does not.
// https://ts-ladders.netlify.app/ladders/classes/#step-5
export abstract class Monster implements Attacker {
  // `#roared` is a private field that JavaScript enforces when the program runs.
  // `private`, below, is checked by TypeScript only, and it is removed when the
  // code is compiled.
  // https://ts-ladders.netlify.app/ladders/classes/#step-3
  #roared = false;

  // Parameter properties. A modifier in front of a constructor parameter, which
  // is `public`, `protected`, `private`, or `readonly`, makes the parameter a
  // field. One line declares the field, accepts the argument, and assigns it.
  //
  //   public readonly name   any code can read it, and no code can assign it again
  //   protected health       this class and its subclasses can use it
  //   private power          this class can use it
  //
  // https://ts-ladders.netlify.app/ladders/classes/#step-2
  constructor(
    public readonly name: string,
    protected health: number,
    private readonly power: number,
  ) {}

  // Subclasses must provide this member. This line is a signature and has no body.
  abstract describe(): string;

  attackPower(): number {
    return this.power;
  }

  // A getter is read like a field, as in `monster.isAlive`, and is written like a
  // method.
  get isAlive(): boolean {
    return this.health > 0;
  }

  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
  }

  roar(): string {
    if (this.#roared) {
      return `${this.name} growls.`;
    }
    this.#roared = true;
    return `${this.name} roars!`;
  }
}

// A subclass is written with `extends`, and it has every member of `Monster`.
// The constructor of a subclass has to call `super(...)` first, which runs the
// constructor of `Monster`.
export class Bat extends Monster {
  constructor() {
    super('cave bat', 3, 1);
  }

  // `override` states that this member replaces a member of the parent class.
  // For an abstract method like this one the word is optional, and this project
  // writes it so that the replacement is visible. Replacing a method that has a
  // body requires the word, as `roar` in `SkeletonKing` below shows.
  override describe(): string {
    return 'A cave bat flaps in circles, squeaking.';
  }
}

export class Goblin extends Monster {
  constructor() {
    super('goblin', 6, 2);
  }

  override describe(): string {
    return 'A goblin guards the shelves. It is holding a book upside down.';
  }
}

export class SkeletonKing extends Monster {
  constructor() {
    super('skeleton king', 10, 3);
  }

  override describe(): string {
    return 'A skeleton king sits on a pile of gold. His crown is missing, and he is not happy about it.';
  }

  // `roar` already exists on `Monster` and has a body, so replacing it requires the
  // word `override`. The `noImplicitOverride` setting in `tsconfig.json` turns on
  // that requirement. If the word is deleted, TypeScript reports the line. The
  // requirement would also catch a typo in a method name: `rour()` without `override`
  // would be a new method and no error, and `override rour()` would be an error.
  override roar(): string {
    return 'The skeleton king rattles his bones and roars!';
  }
}

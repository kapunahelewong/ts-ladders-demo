// MONSTERS: classes.
//
// This file shows:
//   - an abstract class with subclasses
//   - parameter properties (a constructor that declares fields)
//   - public, protected, private, readonly, and #private
//   - implementing an interface
//   - the `override` word
//
// Ladder: Classes
//   https://ts-ladders.netlify.app/ladders/classes/

// An INTERFACE describes what something must be able to do. It has no code and
// is removed when the code is compiled. A class that says `implements Attacker`
// is checked against it.
// https://ts-ladders.netlify.app/ladders/classes/#step-4
export interface Attacker {
  attackPower(): number;
}

// An ABSTRACT class cannot be constructed with `new`. It exists to be extended.
// `abstract describe()` is a REQUIRED member: every subclass must write it,
// and TypeScript reports an error if a subclass forgets.
// https://ts-ladders.netlify.app/ladders/classes/#step-5
export abstract class Monster implements Attacker {
  // `#roared` is a private field enforced by JavaScript itself at runtime.
  // `private` (below) is checked only by TypeScript and then disappears.
  // https://ts-ladders.netlify.app/ladders/classes/#step-3
  #roared = false;

  // PARAMETER PROPERTIES. A modifier in front of a constructor parameter
  // (public, protected, private, or readonly) makes the parameter a FIELD.
  // One line declares the field, accepts the argument, and assigns it.
  //
  //   public readonly name   anyone can read it, nobody can reassign it
  //   protected health       this class and its subclasses can use it
  //   private power          only this class can use it
  //
  // https://ts-ladders.netlify.app/ladders/classes/#step-2
  constructor(
    public readonly name: string,
    protected health: number,
    private readonly power: number,
  ) {}

  // Subclasses must provide this. There is no body here, only a signature.
  abstract describe(): string;

  attackPower(): number {
    return this.power;
  }

  // A getter: used like a field (`monster.isAlive`), written like a method.
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

// A SUBCLASS: written with `extends`. It gets every member of Monster.
// The constructor of a subclass must call `super(...)` first, which runs the
// constructor of Monster.
export class Bat extends Monster {
  constructor() {
    super('cave bat', 3, 1);
  }

  // `override` says "I am replacing a member of the parent class".
  // For an abstract method like this one the word is optional, and this project
  // writes it anyway so the intent is visible. Replacing a regular method needs
  // it: see `roar` in SkeletonKing below.
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

  // `roar` already exists on Monster and has a body, so replacing it REQUIRES the
  // word `override` (the noImplicitOverride setting in tsconfig.json). Delete the
  // word and TypeScript reports the line. That catches a typo in a method name:
  // `rour()` without `override` would be a silent new method, and with `override`
  // it is an error.
  override roar(): string {
    return 'The skeleton king rattles his bones and roars!';
  }
}

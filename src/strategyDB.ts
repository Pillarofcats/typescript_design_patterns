//In-memory databases are purpose-built databases that rely primarily on memory for data storage, in contrast to databases that store data on disk or SSDs. In-memory data stores are designed to enable minimal response times by eliminating the need to access disks.

//OBESERVER PATTERN
type Listener<EventType> = (e: EventType) => void;

function createObserver<EventType>(): {
  //Return types
  subscribe: (listener: Listener<EventType>) => () => void;
  publish: (event: EventType) => void;
} {
  //Function code
  //Listeners array is a closure
  let listeners: Listener<EventType>[] = []
  return {
    subscribe: (listener: Listener<EventType>): () => void => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter(l => l !== listener)
      }
    },
    publish: (event: EventType) => {
      listeners.forEach((l) => l(event))
    }
  }
}

interface BeforeSetEvent<T> {
  value: T;
  newValue: T;
}

interface AfterSetEvent<T> {
  value: T;
}

interface Pokemon {
  name: string;
  pokeNum: number;
  attack: number;
  defense: number;
}

interface DBid {
  name: string;
}

interface DB<T extends DBid> {
  set(data: T): void
  get(name: string): T | undefined

  onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void;
  onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void;
  //VISITOR PATTERN - DEFINITION
  visit(visitor: (item: T) => void): void
  selectBest(scoreStrategy: (item: T) => number): T | undefined
}

// class InMemoryDatabase<T extends DBid> implements DB<T> {
//   private db: Record<string, T> = {};
  
//   public set(data: T): void {
//     this.db[data.name] = data;
//   }

//   public get(name:string): T | undefined{
//     return this.db[name]
//   }
// }

//FACTORY PATTERN
function createDB<T extends DBid> () {
  //Create DB
  class InMemoryDatabase implements DB<T> {
    private db: Record<string, T> = {};
    
    private beforeAddListeners = createObserver<BeforeSetEvent<T>>();
    private afterAddListeners = createObserver<AfterSetEvent<T>>();

    static instance: InMemoryDatabase = new InMemoryDatabase()

    constructor() {}

    public set(data: T): void {

      this.beforeAddListeners.publish({
        newValue: data,
        value: this.db[data.name]
      })

      this.db[data.name] = data;

      this.afterAddListeners.publish({
        value: data
      })
    }

    public get(name:string): T | undefined {
      return this.db[name]
    }

    onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void {
      return this.beforeAddListeners.subscribe(listener)
    }

    onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void {
      return this.afterAddListeners.subscribe(listener)
    }

    //VISITOR PATTERN
    visit(visitor: (item: T) => void): void {
      Object.values(this.db).forEach(visitor)
    }

    //STRATEGY PATTERN
    selectBest(scoreStrategy: (item: T) => number): T | undefined {
      //Setting literal type of found, initializing found object with {max: 0, item: undefined}
      const found: {
        max: number;
        item: T | undefined;
      } = {
        max: 0,
        item: undefined
      }

      Object.values(this.db).reduce((found, item) => {
        const score = scoreStrategy(item)
        if(score > found.max) {
          found.max = score
          found.item = item
        }
        return found
      }, found)

      return found.item
    }
  }//End Class InMemoryDatabase

  return InMemoryDatabase
}

const pokeDB = createDB<Pokemon>()

pokeDB.instance.set({
  name: "Bulbasaur",
  pokeNum: 1,
  attack: 45,
  defense: 42
})

pokeDB.instance.set({
  name: "Charmander",
  pokeNum: 4,
  attack: 62,
  defense: 36
})

pokeDB.instance.set({
  name: "Squirtle",
  pokeNum: 7,
  attack: 31,
  defense: 52
})

console.log("\nSTRATEGY PATTERN")
//Strategy will get best attack pokemon and best defense pokemon
const bestAttackPokemon = pokeDB.instance.selectBest(({attack}) => attack)
const bestDefensePokemon = pokeDB.instance.selectBest(({defense}) => defense)
console.log("\nBest attack pokemon: ", bestAttackPokemon)
console.log("Best defense pokemon: ", bestDefensePokemon)
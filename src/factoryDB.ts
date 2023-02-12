//In-memory databases are purpose-built databases that rely primarily on memory for data storage, in contrast to databases that store data on disk or SSDs. In-memory data stores are designed to enable minimal response times by eliminating the need to access disks.

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
    
    public set(data: T): void {
      this.db[data.name] = data;
    }

    public get(name:string): T | undefined{
      return this.db[name]
    }
  }

  return new InMemoryDatabase()
}

const pokeDB1 = createDB<Pokemon>()

pokeDB1.set({
  name: "Bulbasaur",
  pokeNum: 1,
  attack: 45,
  defense: 42
})

const pokeDB2 = createDB<Pokemon>()

pokeDB2.set({
  name: "Charmander",
  pokeNum: 4,
  attack: 62,
  defense: 36
})

pokeDB2.set({
  name: "Squirtle",
  pokeNum: 7,
  attack: 31,
  defense: 52
})

console.log("\nFACTORY PATTERN\n")
console.log("PokemonDB1: ", pokeDB1)
console.log("\nPokemonDB2: ", pokeDB2)
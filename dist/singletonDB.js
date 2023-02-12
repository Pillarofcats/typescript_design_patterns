"use strict";
//In-memory databases are purpose-built databases that rely primarily on memory for data storage, in contrast to databases that store data on disk or SSDs. In-memory data stores are designed to enable minimal response times by eliminating the need to access disks.
Object.defineProperty(exports, "__esModule", { value: true });
// class InMemoryDatabase<T extends DBid> implements DB<T> {
//   private db: Record<string, T> = {};
//   public set(data: T): void {
//     this.db[data.name] = data;
//   }
//   public get(name:string): T | undefined{
//     return this.db[name]
//   }
// }
//FACTORY PATTERN (return new inMemoryDatabase())
function createDB() {
    //Create DB
    class InMemoryDatabase {
        constructor() {
            this.db = {};
        }
        set(data) {
            this.db[data.name] = data;
        }
        get(name) {
            return this.db[name];
        }
    }
    //SINGLETON PATTERN - Create one instance of DB to be used
    //Create one instance and return it
    const singletonDB = new InMemoryDatabase();
    return singletonDB;
}
const pokeDB = createDB();
pokeDB.set({
    name: "Bulbasaur",
    pokeNum: 1,
    attack: 45,
    defense: 42
});
pokeDB.set({
    name: "Charmander",
    pokeNum: 4,
    attack: 62,
    defense: 36
});
pokeDB.set({
    name: "Squirtle",
    pokeNum: 7,
    attack: 31,
    defense: 52
});
console.log("\nSINGLETON PATTERN\n");
console.log(pokeDB);
//# sourceMappingURL=singletonDB.js.map
"use strict";
//In-memory databases are purpose-built databases that rely primarily on memory for data storage, in contrast to databases that store data on disk or SSDs. In-memory data stores are designed to enable minimal response times by eliminating the need to access disks.
Object.defineProperty(exports, "__esModule", { value: true });
function createObserver() {
    //Function code
    //Listeners array is a closure
    let listeners = [];
    return {
        subscribe: (listener) => {
            listeners.push(listener);
            return () => {
                listeners = listeners.filter(l => l !== listener);
            };
        },
        publish: (event) => {
            listeners.forEach((l) => l(event));
        }
    };
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
function createDB() {
    //Create DB
    class InMemoryDatabase {
        constructor() {
            this.db = {};
            this.beforeAddListeners = createObserver();
            this.afterAddListeners = createObserver();
        }
        set(data) {
            this.beforeAddListeners.publish({
                newValue: data,
                value: this.db[data.name]
            });
            this.db[data.name] = data;
            this.afterAddListeners.publish({
                value: data
            });
        }
        get(name) {
            return this.db[name];
        }
        onBeforeAdd(listener) {
            return this.beforeAddListeners.subscribe(listener);
        }
        onAfterAdd(listener) {
            return this.afterAddListeners.subscribe(listener);
        }
    }
    InMemoryDatabase.instance = new InMemoryDatabase();
    return InMemoryDatabase;
}
const pokeDB = createDB();
//Observer - after adding item it will print the item
const unsub = pokeDB.instance.onAfterAdd(({ value }) => {
    console.log("On after add listener: ", value);
});
console.log("\nOBSERVER PATTERN\n");
//Observer will print pokemon after being 'set'
pokeDB.instance.set({
    name: "Bulbasaur",
    pokeNum: 1,
    attack: 45,
    defense: 42
});
pokeDB.instance.set({
    name: "Charmander",
    pokeNum: 4,
    attack: 62,
    defense: 36
});
//Stop "On after add" listener
//Squirtle won't be logged out due to the listener being removed
console.log("Unsub from 'after add listener': Squirtle is not printed here.", unsub());
pokeDB.instance.set({
    name: "Squirtle",
    pokeNum: 7,
    attack: 31,
    defense: 52
});
console.log("\n", pokeDB, "\n");
//# sourceMappingURL=observerDB.js.map
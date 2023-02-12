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
        //VISITOR PATTERN
        visit(visitor) {
            Object.values(this.db).forEach(visitor);
        }
        //STRATEGY PATTERN
        selectBest(scoreStrategy) {
            //Setting literal type of found, initializing found object with {max: 0, item: undefined}
            const found = {
                max: 0,
                item: undefined
            };
            Object.values(this.db).reduce((found, item) => {
                const score = scoreStrategy(item);
                if (score > found.max) {
                    found.max = score;
                    found.item = item;
                }
                return found;
            }, found);
            return found.item;
        }
    } //End Class InMemoryDatabase
    InMemoryDatabase.instance = new InMemoryDatabase();
    return InMemoryDatabase;
}
const pokeDB = createDB();
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
pokeDB.instance.set({
    name: "Squirtle",
    pokeNum: 7,
    attack: 31,
    defense: 52
});
console.log("\nSTRATEGY PATTERN");
//Strategy will get best attack pokemon and best defense pokemon
const bestAttackPokemon = pokeDB.instance.selectBest(({ attack }) => attack);
const bestDefensePokemon = pokeDB.instance.selectBest(({ defense }) => defense);
console.log("\nBest attack pokemon: ", bestAttackPokemon);
console.log("Best defense pokemon: ", bestDefensePokemon);
//# sourceMappingURL=strategyDB.js.map
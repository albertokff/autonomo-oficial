import * as SQLite from 'expo-sqlite';

let dbPromise;

export async function openDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('autonomoapp.db');
  }
  return dbPromise;
}

export async function createTableServices() {
  const db = await openDb();
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT
    );`
  );
}

export async function insert(table, campos) {
  const db = await openDb();
  
  const columns = campos.map(c => c.name).join(', ');
  const values = campos.map(c => c.value);

  const placeholders = campos.map(() => '?').join(', ');

  const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

  return await db.runAsync(query, values);
}

export async function getAllServices() {
  const db = await openDb();
  const result = await db.getAllAsync('SELECT * FROM services');
  return result;
}

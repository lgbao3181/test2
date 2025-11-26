import * as SQLite from 'expo-sqlite';
export async function taoMoi(){
    const db = await SQLite.openDatabaseAsync('databaseName');
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS DanhBa (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        favorite INTEGER DEFAULT 0,
        created_at INTEGER);
        `)
  const rows = await db.getAllAsync('SELECT * FROM DanhBa;');

  if (rows.length === 0) {
    await db.execAsync(`
      INSERT INTO DanhBa (name, phone) VALUES ('A', 123);
      INSERT INTO DanhBa (name, phone) VALUES ('B', 456);
    `);
  }

  console.log(await db.getAllAsync('SELECT * FROM DanhBa'))
    return db
}
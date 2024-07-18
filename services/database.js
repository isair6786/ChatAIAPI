import * as SQLite from 'expo-sqlite';


export async function CrearDb() {
    const db = await SQLite.openDatabaseAsync('ChatMensajesDB');
    return db;
}

export async function SelectTabla(tabla,db) {
    const firstRow = await db.getFirstAsync('SELECT * FROM '+tabla);
    return firstRow;
}

export async function CrearTabla(db){
    //Para crear tabla 
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS ChatMensajes (idChatRow INTEGER PRIMARY KEY NOT NULL,
         MensajeChat TEXT NOT NULL, UsuarioChat INTEGER);
        `);
}

export async function SelectTablaCompleta(tabla,db) {
    const AllRows = await db.getAllAsync('SELECT * FROM '+tabla);
    return AllRows;
}

export async function InsertarChat(MensajeChat,UsuarioChat,db){
    //Para UsuarioChat 1 = Usuario 0=ChatGPT
    const result = await db.runAsync('INSERT INTO ChatMensajes (MensajeChat, UsuarioChat) VALUES (?, ?)', MensajeChat, UsuarioChat);
    return result
}


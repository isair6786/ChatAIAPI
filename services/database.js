import * as SQLite from 'expo-sqlite';
import UserKind from '../Constants/UserKind';


export async function CrearDb() {
    console.log('creando baser')
    const db = await SQLite.openDatabaseAsync('ChatMensajesDB');
    //await BorrarTabla(db)
    return db;

}

export async function SelectTabla(tabla, db) {
    const firstRow = await db.getFirstAsync('SELECT * FROM ' + tabla);
    return firstRow;
}

export async function CrearTabla(db) {
    //Para crear tabla 
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS ChatMensajes (idChatRow INTEGER PRIMARY KEY NOT NULL,
         MensajeChat TEXT NOT NULL, UsuarioChat INTEGER,FechaHora TEXT DEFAULT (datetime('now')))
        `);
}

export async function BorrarTabla(db) {
    //Para crear tabla 
    await db.execAsync(`
        DROP TABLE IF EXISTS ChatMensajes
        `);
}

export async function SelectTablaCompleta(tabla, db, orderby = 'ASC') {
    const AllRows = await db.getAllAsync('SELECT * FROM ' + tabla + ' ORDER BY idChatRow ' + orderby);
    return AllRows;
}

export async function InsertarChat(MensajeChat, UserChat, db) {
    //Para UsuarioChat 1 = Usuario 0=ChatGPT
    const result = await db.runAsync('INSERT INTO ChatMensajes (MensajeChat, UsuarioChat) VALUES (?, ?)', MensajeChat, UserChat);
    return result
}

export async function LeerChat(db) {
    //Para UsuarioChat 1 = Usuario 0=ChatGPT
    const messages = await SelectTablaCompleta('ChatMensajes', db, 'DESC');
    //console.log('Mensajes en la base de datos:', messages);
    return messages
}

export async function LeerContexto(db) {
    //Para UsuarioChat 1 = Usuario 0=ChatGPT
    const messages = await SelectTablaCompleta('ChatMensajes', db);
    return messages
}
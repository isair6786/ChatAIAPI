import * as SQLite from 'expo-sqlite';
import UserKind from '../Constants/UserKind';
import { FIREBASE_AUTH } from './Firebase/FirebaseConfig';
import { Alert } from 'react-native';


export async function CrearDb() {
    //console.log('creando baser')
    const db = await SQLite.openDatabaseAsync('ChatMensajesDB');
    /*await BorrarTabla(db)
    await BorrarTabla(db, 'CalendarsUsers')
    await BorrarTabla(db, 'CalendarsUsersData')*/
    CreateTableCalendar(db)
    CrearTabla(db)
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
         MensajeChat TEXT NOT NULL, UsuarioChat INTEGER,FechaHora TEXT DEFAULT (datetime('now')),uuid TEXT NOT NULL)
        `);
}

export async function BorrarTabla(db, tabla = 'ChatMensajes') {
    await db.execAsync(`
        DROP TABLE IF EXISTS ${tabla}
        `);
}

export async function SelectTablaCompleta(tabla, db, orderby = 'ASC', campo = 'idChatRow') {
    const AllRows = await db.getAllAsync(`SELECT * FROM ${tabla} where uuid= '${FIREBASE_AUTH.currentUser.uid}' ORDER BY  ${campo} ${orderby}`);
    return AllRows;
}

export async function InsertarChat(MensajeChat, UserChat, db) {
    //Para UsuarioChat 1 = Usuario 0=ChatGPT
    const result = await db.runAsync('INSERT INTO ChatMensajes (MensajeChat, UsuarioChat,uuid) VALUES (?, ?,?)', MensajeChat, UserChat, FIREBASE_AUTH.currentUser.uid);
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


/* CALENDAR*/


export async function CreateTableCalendar(db) {
    //Para crear tabla 
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS CalendarsUsers (idCalendar INTEGER PRIMARY KEY NOT NULL,
         uuid TEXT NOT NULL  ,email TEXT NOT NULL, token TEXT NOT NULL,id_provider text not null)
        `);
    await db.execAsync(`
         PRAGMA journal_mode = WAL;
         CREATE TABLE IF NOT EXISTS CalendarsUsersData 
         (idCalendarData INTEGER PRIMARY KEY NOT NULL,
          uuid TEXT NOT NULL  ,
          email TEXT NOT NULL,
           calendario TEXT NOT NULL,
           id_calentario text NOT NULL,
           activo INTEGER NOT NULL)
         `);
}

export async function InsertCalendar(_uuid, _email, _token, _id_provider, db) {

    const result = await db.runAsync(`INSERT INTO CalendarsUsers
         (uuid, email,token,id_provider) VALUES (?,?,?,?)`,
        _uuid, _email, _token, _id_provider);
    return result
}

export async function InsertDataCalendar(_uuid, _email, _calendar, _calendarId, _activo) {
    const db = CrearDb()
    const result = await db.runAsync(`INSERT INTO CalendarsUsersData
         (uuid, email,calendario,id_calentario,activo) VALUES (?, ?,?,?,?)`,
        _uuid, _email, _calendar, _calendarId, _activo);
    return result
}

export async function UpdateActivoByUuidEmail(_uuid, _email, _activo) {
    const db = CrearDb();
    const result = await db.runAsync(
        `UPDATE CalendarsUsersData SET activo = ? WHERE uuid = ? AND email = ?`,
        _activo, _uuid, _email
    );
    return result;
}

export async function DeleteTable(table) {
    //Para vaciar tabla 
    await db.execAsync(`DELETE TABLE ` + table);
}

export async function SelectDataUserByUUID(_table, _email, db) {
    const firstRow = await db.getFirstAsync(`SELECT * FROM  ${_table} where uuid = '${FIREBASE_AUTH.currentUser.uid}' and email= '${_email}'`);
    return firstRow;
}
//Funcion que se ejecuta al loguearse con proveedores externos
// para crear los datos locales del calendario del usuario
export async function CreateDataUser(_user, _idProvider, _addAccount = false) {
    var isError=false
    const db = await CrearDb();
    await CreateTableCalendar(db);
    const _email = _user.email
    const _token = ""
        //Validamos si ya tiene logueada las dos cuentas
    var countAccounts = await SelectTableCalendar('CalendarsUsers', 'desc', 'uuid');
    //Validamos si ya existe esa cuenta asociada a nuestro usuario logueado
    if (countAccounts.length < 2) {
        var ExistsUser = await SelectDataUserByUUID('CalendarsUsers', _email, db)
        if (ExistsUser === null) {
            console.log('entramos')
            await InsertCalendar(FIREBASE_AUTH.currentUser.uid, _email, _token, _idProvider, db)
        } else if (_addAccount) {
            isError=true
            Alert.alert("Cuenta ya vinculada", "La cuenta que deseas vincular ya se encuentra asociada a tu usuario")
        }
    } else if (_addAccount) {
        isError=true
        Alert.alert("Limite de cuentas", "Solo puedes vincular dos cuentas a la vez")
    }

    return isError

}

export async function SelectTableCalendar(tabla, orderby = 'ASC', campo = 'idChatRow') {
    const db = await CrearDb();
    const AllRows = await db.getAllAsync(`SELECT * FROM  ${tabla}  where uuid='${FIREBASE_AUTH.currentUser.uid}' ORDER BY  ${campo}  ${orderby}`);
    return AllRows;
}

export async function DeleteAccountCalendar(email) {
    const db = await CrearDb();
    await db.getAllAsync(`DELETE FROM  CalendarsUsers  where uuid='${FIREBASE_AUTH.currentUser.uid}' and email = '${email}'`);
}

/*Para la cuenta de uso de chat */
async function CreateTableAccount(db) {
    //Para crear tabla 
    await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS AccountChat (id INTEGER PRIMARY KEY NOT NULL,
         uuid TEXT NOT NULL  ,email TEXT NOT NULL)
        `);
}
export async function SelectAccountUserByUUID(_table="AccountChat") {
    const db = await CrearDb();
    await CreateTableAccount(db) 
    const firstRow = await db.getFirstAsync(`SELECT * FROM  ${_table} where uuid = '${FIREBASE_AUTH.currentUser.uid}'`);
    return firstRow;
}

export async function SetAccountChat(_email) {
    const db = await CrearDb();
    await CreateTableAccount(db) 
    const data = await SelectAccountUserByUUID("AccountChat")
    if (data<1){
        await db.runAsync(
            `INSERT INTO AccountChat(uuid,email) VALUES(?,?)`,
            FIREBASE_AUTH.currentUser.uid,_email
        );
    
    }else{
        await db.runAsync(
            `UPDATE AccountChat SET email = ? WHERE uuid = ? `,
            _email,FIREBASE_AUTH.currentUser.uid
        );
    }

}
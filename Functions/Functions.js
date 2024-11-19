import Colors from "../Constants/Colors";
import { FIREBASE_AUTH } from "../services/Firebase/FirebaseConfig";
import { SECRET } from "@env"
import CryptoJS from 'crypto-js';
export function NameSplit(name) {
    const nombre = name.split(' ')
    const nameDisplay = nombre.length > 2 ? nombre[0] + ' ' + nombre[2] : name
    return nameDisplay
}

export function getRandomLightColor() {
    // Obtener todas las claves de colores
    const colorKeys = Object.keys(Colors);

    // Filtrar solo las variantes "light"
    const lightColors = colorKeys.map(key => Colors[key].light);

    // Elegir un color "light" aleatorio
    const randomLightColor = lightColors[Math.floor(Math.random() * lightColors.length)];
    //console.log(randomLightColor)
    return randomLightColor;
}
//Funcion para crear el token que se almacenará en la base de firebase para consultas
export function createObjTokenProvider(dataCredential,ProviderId){
    var token ={
        uuid:'',//para asociar al usuario logueado
        accessToken:'',
        refreshToken:'',
        email:'',
        providerId:'',
        createAt:obtenerFechaActual()
    }
    token.email=dataCredential.email;
    token.uuid=FIREBASE_AUTH.currentUser.uid;
    token.accessToken=dataCredential.access_token;
    token.refreshToken=dataCredential.refresh_token;
    token.providerId=ProviderId;
    
    return  token;
}
export const obtenerFechaActual = () => {
    /*const fechaHoy = new Date();
    const dia = String(fechaHoy.getDate()).padStart(2, '0');
    const mes = String(fechaHoy.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const año = fechaHoy.getFullYear();
    const fechaFormateada = `${dia}/${mes}/${año}`;
    return fechaFormateada; */
    const fechaHoy = new Date();

  const opciones = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Para formato de 24 horas
  };

  const fechaFormateada = fechaHoy.toLocaleString('es-SV', opciones).replace(',', ''); //Hora local El Salvador
  return fechaFormateada
};

export const obtenerSoloFechaActual = () => {
    const fechaHoy = new Date();
    const año = fechaHoy.getFullYear();
    const mes = String(fechaHoy.getMonth() + 1).padStart(2, '0'); // getMonth() devuelve de 0 a 11, se suma 1
    const día = String(fechaHoy.getDate()).padStart(2, '0'); // getDate() devuelve el día del mes

    const fechaFormateada = `${año}-${mes}-${día}`;
    return fechaFormateada;
};
export const sumaRestaFecha = (_fecha, cantidad = 0) => {
    const fecha = new Date(_fecha);
    fecha.setDate(fecha.getDate() + cantidad); // Sumar o restar días

    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // getMonth() devuelve de 0 a 11, se suma 1
    const día = String(fecha.getDate()).padStart(2, '0'); // getDate() devuelve el día del mes

    const fechaFormateada = `${año}-${mes}-${día}`;
    return fechaFormateada
};
export const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData); // Convierte el string JSON a un objeto de nuevo
};
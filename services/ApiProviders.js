import { API_PROVIDERS_URL } from "@env"
import axios from 'axios';
import { FIREBASE_AUTH } from "./Firebase/FirebaseConfig";
import { sumaRestaFecha } from "../Functions/Functions";

export async function EnviarMensaje(context) {

}
export async function GuardarToken(_token) {
    const uuid = FIREBASE_AUTH.currentUser.uid
    var data = {
        uid:uuid,
        token: _token
    }
    try {
        const response = await axios.post(API_PROVIDERS_URL + "/api/saveToken", data);
        //console.log('Respuesta del servidor:', response.data);
    } catch (error) {
        console.log(error)
    }
}
export async function EliminarToken(email) {
    const uuid = FIREBASE_AUTH.currentUser.uid

    try {
        const response = await axios.delete(API_PROVIDERS_URL + `/api/deleteTokenbyUidEmail?uid=${uuid}&email=${email}`);
        //console.log('Respuesta del servidor:', response.data);
    } catch (error) {
        console.log(error)
    }
}
export async function ConsultarEventos(_date) {
    const uuid = FIREBASE_AUTH.currentUser.uid
    try {
        const response = await axios.get(API_PROVIDERS_URL + `/api/getCalendarEventsbyDate?uid=${uuid}&date=${sumaRestaFecha(_date,-4)}&endDate=${sumaRestaFecha(_date,7)}`,);
        return response.data;
    } catch (error) {
        console.log(error)
        return [];
    }
    
}

export async function getRecentEmails() {
    try {
        const response=await axios.get(API_PROVIDERS_URL + `/api/readEmailbyProvider?uid=${FIREBASE_AUTH.currentUser.uid}`);
        return response.data.message;  // Suponiendo que la respuesta tenga una propiedad "emails"
    } catch (error) {
        console.error("Error fetching emails: ", error);
        return [];  // Devuelve un arreglo vacío en caso de error
    }
}

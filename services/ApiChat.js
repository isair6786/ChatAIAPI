import { API_URL, API_TOKEN } from "@env"
import axios from 'axios';
import { SelectAccountUserByUUID } from "./database";
import { FIREBASE_AUTH } from "./Firebase/FirebaseConfig";
import { Alert } from "react-native";

export async function EnviarMensaje(context) {
   
    var emailUid=await SelectAccountUserByUUID();
    var data = {
            contexto: JSON.stringify(context),
            uid:FIREBASE_AUTH.currentUser.uid,
            correoUid:emailUid.email
        }
    
    var mensaje = '';
    try {
        const response = await axios.post(API_URL + "/send-message", data);
        //console.log('Respuesta del servidor:', response.data);
        mensaje = response.data.responseMessage
    } catch (error) {
        if (error.response) {
             mensaje = "El servicio no esta disponible, intente nuevamente en un momento"
        } else {
             mensaje = "Ocurrio un error al enviar el mensaje, intente nuevamente"
        } 
        mensaje = "Ocurrio un error al enviar el mensaje, intente nuevamente"
    }
    return mensaje
}
export async function ValidarApi() {
    var mensaje = '';
    try {
        const response = await axios.get(API_URL);
        // Manejar la respuesta exitosa
        //(response.data.responseMessage);
        mensaje = response.data.responseMessage
    } catch (error) {
        // Manejar cualquier error
        console.error('Error:', error);
        mensaje = error
    }
    return mensaje;
}
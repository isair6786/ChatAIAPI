import { API_URL, API_TOKEN } from "@env"
import axios from 'axios';

export async function EnviarMensaje(context) {
    var data = {
            contexto: JSON.stringify(context)
        }
        //console.log(data)
    var mensaje = '';
    try {
        const response = await axios.post(API_URL + "/send-message", data);
        //console.log('Respuesta del servidor:', response.data);
        mensaje = response.data.responseMessage
    } catch (error) {
        if (error.response) {
            console.error('Error de validación:', error.response.data);
            console.error('Código de estado:', error.response.status);
            console.error('Encabezados:', error.response.headers);
        } else if (error.request) {
            console.error('No se recibió respuesta:', error.request);
        } else {
            console.error('Error al configurar la solicitud:', error.message);
        }
        mensaje = error.response
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
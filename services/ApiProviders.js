import { API_PROVIDERS_URL } from "@env"
import axios from 'axios';
import { FIREBASE_AUTH } from "./Firebase/FirebaseConfig";
import { sumaRestaFecha } from "../Functions/Functions";

export async function EnviarMensaje(context) {

}
export async function GuardarToken(_token) {
    const uuid = FIREBASE_AUTH.currentUser.uid
    var data = {
        uid: uuid,
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
        const response = await axios.get(API_PROVIDERS_URL + `/api/getCalendarEventsbyDate?uid=${uuid}&date=${sumaRestaFecha(_date, -4)}&endDate=${sumaRestaFecha(_date, 7)}`,);
        return response.data;
    } catch (error) {
        console.log(error)
        return [];
    }

}

export async function AnalisisAgenda(_date,_dateEnd,esRango) {
    const uuid = FIREBASE_AUTH.currentUser.uid
    try {
        const response = await axios.get(API_PROVIDERS_URL + `/api/getCalendarEventsbyDate?uid=${uuid}&date=${sumaRestaFecha(_date, -4)}&endDate=${sumaRestaFecha(_date, 7)}`,);
        return response.data;
    } catch (error) {
        console.log(error)
        return [];
    }

}

export async function getRecentEmails() {
    try {
        const response = await axios.get(API_PROVIDERS_URL + `/api/readEmailbyProvider?uid=${FIREBASE_AUTH.currentUser.uid}`);
        //console.log(response)
        return response.data.message;  // Suponiendo que la respuesta tenga una propiedad "emails"
    } catch (error) {
        console.error("Error fetching emails: ", error);
        return [];  // Devuelve un arreglo vacío en caso de error
    }
}
export async function getAccounts() {
    try {
        const response = await axios.get(API_PROVIDERS_URL + `/api/readCreatedToken?uid=${FIREBASE_AUTH.currentUser.uid}`);
        return response.data.message;  // Suponiendo que la respuesta tenga una propiedad "emails"
    } catch (error) {
        console.error("Error fetching emails: ", error);
        return [];  // Devuelve un arreglo vacío en caso de error
    }
}
export async function MarcarCorreoComoLeido(email, emailId) {
    const uuid = FIREBASE_AUTH.currentUser.uid
    var data = {
        uid: uuid,
        email,
        emailId
    }
    try {
        const response = await axios.post(API_PROVIDERS_URL + "/api/setEmailtoRead", data);
        return response.data
    } catch (error) {
        console.log(error)
    }
}
export async function eliminarEvento(eventId, email, calendarId, providerId) {
    const uuid = FIREBASE_AUTH.currentUser.uid
    let response;
    try {
        if (providerId == "microsoft.com") {
            response = await axios.delete(API_PROVIDERS_URL + `/api/deleteMicrosoftEventById?uid=${uuid}&eventId=${eventId}&email=${email}`);
        } else {
            response = await axios.delete(API_PROVIDERS_URL + `/api/DeleteGoogleEventbyId?uid=${uuid}&calendarId=${calendarId}&eventId=${eventId}&email=${email}`);
        }
        return {
            "success": true,
            "message": response.data
        }
    } catch (error) {
        console.log(error)
        return {
            "success": false,
            "message": error
        }
    }
}
export async function ActualizarEvento(data,providerId) {
    const uid = FIREBASE_AUTH.currentUser.uid;
    const dataAttendees = data.attendees;
    let AttendeesFormat = [];
    if (providerId == "microsoft.com") {
        AttendeesFormat = dataAttendees.map(element => {
            return ({
                "emailAddress": {
                    "name": element,
                    "address": element
                }
            })
        })
    } else {
        AttendeesFormat = dataAttendees.map(element => {
            return (
                {"email":element}
            )
        })
    }
    data.attendees = AttendeesFormat
    let payload = {
        uid,
        data
    }
    console.log(payload)
    let response;
    try {
        if (providerId == "microsoft.com") {
            response = await axios.put(API_PROVIDERS_URL + `/api/UpdateMicrosoftEventById`,payload);    
        } else {
            response = await axios.put(API_PROVIDERS_URL + `/api/UpdateGoogleEventById`,payload);    
        }
        return {
            "success": true,
            "message": "",//response.data
        }
    } catch (error) {
        console.log(error)
        return {
            "success": false,
            "message": error
        }
    }
}
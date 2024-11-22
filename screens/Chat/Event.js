import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { View, Text, TextInput, Button, Platform, ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from "react-native-vector-icons/Ionicons";
import Colors from '../../Constants/Colors';
import { ActualizarEvento, eliminarEvento } from '../../services/ApiProviders';
import { Alert } from 'react-native';
import moment from 'moment-timezone';
import searchAnimated from '../../assets/animations/find.json';
import LottieView from 'lottie-react-native';


// Componente para agregar y gestionar múltiples correos electrónicos
function MultiEmailInput({ dataEmails, setNewArrayEmail }) {
    const [emails, setEmails] = useState(''); // Almacena los correos como un string
    const [emailArray, setEmailArray] = useState([]); // Almacena los correos como un array
    const [emailToSend, setemailToSend] = useState([]); // Almacena los correos como un array
    const [isValid, setIsValid] = useState(true); // Estado para validar los correos

    const handleChange = (text) => {
        setEmails(text);
    };
    
    const handleAddEmails = () => {
        // Separa los correos por comas
        const emailList = emails.split(',').map(email => email.trim());

        // Validar que todos los correos sean válidos
        const validEmails = emailList.every((email) => validateEmail(email));

        if (validEmails) {
            setEmailArray(prev => [...prev, ...emailList]);
            setNewArrayEmail(prev => [...prev, ...emailList])
            setIsValid(true);
        } else {
            setIsValid(false); // Si algún correo es inválido, se marca como no válido
        }

        setEmails(''); // Limpiar el input después de agregar
    };

    // Función simple de validación de correo electrónico
    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    };

    const handleDeleteEmail = (email) => {
        // Filtrar el correo a eliminar
        const updatedEmails = emailArray.filter((e) => e !== email);
        setNewArrayEmail(updatedEmails);
        setEmailArray(updatedEmails); // Actualizar el array de correos
    };
    //Hooks
    useEffect(() => {
        setEmailArray(dataEmails)
        setemailToSend(dataEmails)
    }, [dataEmails])



    return (
        <View>
            <View className="mb-5 mt-5">
                {emailArray.length > 0 ? emailArray.map((email, index) => (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                        <Text style={{ fontSize: 16 }}>{email}</Text>
                        <TouchableOpacity className='flex-row justify-between items-center p-2'
                            onPress={() => handleDeleteEmail(email)} >
                            <Ionicons name="close-circle" size={20} color={Colors.Rose.dark} />
                        </TouchableOpacity>
                    </View>
                )) : <Text style={{ fontSize: 16 }}>No hay asistentes</Text>}
            </View>
            <View className='flex-row'>
                <TextInput className='mr-2'
                    style={{
                        borderWidth: 1,
                        borderColor: isValid ? 'gray' : 'red',
                        padding: 10,
                        borderRadius: 5,
                    }}
                    placeholder="Ingresa correos separados por comas"
                    value={emails}
                    onChangeText={handleChange}
                />

                <TouchableOpacity style={{
                    backgroundColor: "white",
                    shadowColor: "black",
                    shadowOffset: { width: 1, height: 5 },
                    shadowOpacity: 0.2,
                    shadowRadius: 10,
                    elevation: 2,
                }} className='flex-row justify-between items-center p-2 rounded' onPress={handleAddEmails}>
                    <Ionicons name="add-circle" size={20} color="black" />
                    <Text> Añadir</Text>
                </TouchableOpacity>

            </View>
            {!isValid && <Text style={{ color: 'red', marginTop: 10 }}>Algunos correos no son válidos.</Text>}


        </View>
    );
}

export default function EventDetailScreen({ route, navigation ,setRender }) {
    const { event } = route.params; // Recibir el evento seleccionado desde la navegación
    const [currentAccount, setCurrentAccount] = useState("")
    const [currentProvider, setCurrentProvider] = useState("")
    const [disableButtons, setdisableButtons] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoadingShedzy, setisLoadingShedzy] = useState(false);
    const [TextSchedzy, setTextSchedzy] = useState("");
    const [currentEvent, setCurrentEvent] = useState({
        "calendarId": "",
        "eventId": "",
        "summary": "",
        "description": "",
        "start": "",
        "end": "",
        "sendUpdates": "all",
        "attendees": ""
    });

    // Manejo del formulario
    const [title, setTitle] = useState(event.name);
    const [details, setDetails] = useState(event.notes);
    const [startDate, setStartDate] = useState(new Date(event.startDate)); // Suponiendo que `startDate` es parte del objeto del evento
    const [endDate, setEndDate] = useState(new Date(event.endDate));
    const [emails, setEmails] = useState([]); // Correos electrónicos

    // Para manejo del picker
    const [showPicker, setShowPicker] = useState(false); // Para manejar la visibilidad del picker
    const [timeToChange, setTimeToChange] = useState(new Date(event.startDate));
    const [mode, setMode] = useState("date"); // Modo: "date" o "time"
    const [typeDate, setTypeDate] = useState("start"); // Tipo: "start" o "end"

    const handleEdit = () => {
        // Lógica para editar el evento (llamada API o actualización local)
        let fechaFin = moment(endDate).tz("America/Guatemala").format("YYYY-MM-DDTHH:mm:ss")+"Z";
        let fechaDesde = moment(startDate).tz("America/Guatemala").format("YYYY-MM-DDTHH:mm:ss")+"Z";
 
        console.log('Editar evento:', {
            ...currentEvent,
            "summary": title,
            "description": details,
            "start":fechaDesde,
            "end": fechaFin,
            "attendees": emails
        });
        Alert.alert(
            "Modificar evento",
            `¿Desea modificar el evento?`,
            [
                {
                    text: "Cancelar",
                    style: "cancel", // Estilo de botón 'cancelar'
                },
                {
                    text: "Sí",
                    onPress: async () => {
                        setdisableButtons(true)
                        let response = await ActualizarEvento({
                            ...currentEvent,
                            "summary": title,
                            "description": details,
                            "start": fechaDesde,
                            "end": fechaFin,
                            "attendees": emails,
                            "email":currentAccount
                        },currentProvider)
                        if (response.success) {
                            //para actualizar calendario
                            setRender(prev=>!prev)
                            Alert.alert(
                                "Evento Modificado",
                                `Será redirigido a la pagina principal`)
                            setTimeout(() => { navigation.reset({
                                index: 0,
                                routes: [{ name: 'Agendas' }]
                            })}, 2000)
                            
                        } else {
                            setdisableButtons(false)
                            Alert.alert(
                                "Error",
                                `Ocurrio un error modificando el evento , intente nuevamente `)
                        }
                    },
                },
            ],
            { cancelable: true }
        );
        
    };

    const handleDelete = () => {
        // Lógica para eliminar el evento (llamada API)
        Alert.alert(
            "Eliminar evento",
            `¿Desea eliminar el evento actual? Esto no se puede revertir`,
            [
                {
                    text: "Cancelar",
                    style: "cancel", // Estilo de botón 'cancelar'
                },
                {
                    text: "Sí",
                    onPress: async () => {
                        setdisableButtons(true)
                        let response = await eliminarEvento(currentEvent.eventId, currentAccount, currentEvent.calendarId, currentProvider)
                        if (response.success) {
                            
                            //para actualizar calendario
                            setRender(prev=>!prev)
                            Alert.alert(
                                "Evento Eliminado",
                                `Será redirigido a la pagina principal`)
                            setTimeout(() => { navigation.reset({
                                index: 0,
                                routes: [{ name: 'Agendas' }]
                            })}, 2000)
                            
                        } else {
                            setdisableButtons(false)
                            Alert.alert(
                                "Error",
                                `Ocurrio un error eliminando el evento , intente nuevamente `)
                        }
                    },
                },
            ],
            { cancelable: true }
        );

    };

    // Hooks
    useEffect(() => {
        const { event } = route.params;
        const { calendarId, id, attendes, startDate, endDate, notes, name, account, provider_id } = event
        setTitle(name);
        setDetails(notes);
        setStartDate(new Date(startDate));
        setEndDate(new Date(endDate));
        setEmails(attendes);
        setCurrentAccount(account)
        setCurrentProvider(provider_id)
        setCurrentEvent({
            ...currentEvent,
            "calendarId": calendarId,
            "eventId": id,
            "summary": name,
            "description": notes,
            "start": startDate,
            "end": endDate,
            "attendees": attendes
        })
        setdisableButtons(false)
        setIsModalVisible(false)
        setisLoadingShedzy(false)
        setTextSchedzy("Schedzy esta para apoyarte, selecciona la fecha o rango de fechas que desees y Schedzy")
    }, [route]);

    // Handle Dates
    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || timeToChange;
        setShowPicker(Platform.OS === 'ios');
        // Actualiza las fechas de inicio o fin según el caso
        if (typeDate === "start") {
            setStartDate(currentDate);
        } else {
            setEndDate(currentDate);
        }
    };

    const handleClick = (typeDate, isTime) => {
        setShowPicker(true);
        setTypeDate(typeDate);
        if (typeDate === "end") {
            setTimeToChange(endDate);
        } else {
            setTimeToChange(startDate);
        }
        setMode(isTime ? "time" : "date"); // Cambiar entre fecha y hora
    };

    return (
        <KeyboardAvoidingView
            
            behavior='height'
        >
            <ScrollView>

                <View style={{ flex: 1, padding: 20, backgroundColor: 'white' }}>
                    {/* TITULO */}
                    <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Título:</Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: 'gray',
                            padding: 10,
                            marginBottom: 20,
                            borderRadius: 5,
                        }}
                        value={title}
                        onChangeText={setTitle}
                    />
                    {/* DETALLES */}
                    <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Detalles:</Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: 'gray',
                            padding: 10,
                            marginBottom: 20,
                            borderRadius: 5,
                            height: 100,
                        }}
                        value={details}
                        onChangeText={setDetails}
                        multiline
                    />
                    {/* INPUTS FECHA */}
                    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Fecha Desde:</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity
                            style={{ padding: 10, width: 150, borderRadius: 5, marginRight: 10 }}
                            onPress={() => handleClick("start", false)} // Selección de fecha
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Ionicons name="calendar" size={20} color="#349ad1" />
                                <Text style={{ marginLeft: 10 }}>{startDate.toDateString()}</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ padding: 10, width: 150, borderRadius: 5 }}
                            onPress={() => handleClick("start", true)} // Selección de hora
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Ionicons name="time" size={20} color="#349ad1" />
                                <Text style={{ marginLeft: 10 }}>{startDate.toTimeString().slice(0, 5)}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <Text style={{ fontWeight: 'bold', marginBottom: 5, marginTop: 20 }}>Fecha Hasta:</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity
                            style={{ padding: 10, width: 150, borderRadius: 5, marginRight: 10 }}
                            onPress={() => handleClick("end", false)} // Selección de fecha
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Ionicons name="calendar" size={20} color="#349ad1" />
                                <Text style={{ marginLeft: 10 }}>{endDate.toDateString()}</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ padding: 10, width: 150, borderRadius: 5 }}
                            onPress={() => handleClick("end", true)} // Selección de hora
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Ionicons name="time" size={20} color="#349ad1" />
                                <Text style={{ marginLeft: 10 }}>{endDate.toTimeString().slice(0, 5)}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* FIN INPUTS FECHA */}
                    {showPicker && (
                        <RNDateTimePicker
                            is24Hour={true}
                            mode={mode}
                            value={timeToChange}
                            onChange={handleDateChange}
                        />
                    )}

                    <Text style={{ fontWeight: 'bold', marginBottom: 5, marginTop: 20 }}>Asistentes:</Text>
                    <MultiEmailInput dataEmails={emails} setNewArrayEmail={setEmails} />

                    <View className="mt-[50] flex-row justify-around">
                        <TouchableOpacity className={disableButtons?'flex-row bg-teal-100 justify-between items-center p-2 rounded':'flex-row bg-teal-600 justify-between items-center p-2 rounded'}
                            onPress={handleEdit} disabled={disableButtons}>
                            <Ionicons name="checkmark-circle" size={20} color="white" />
                            <Text className="text-white font-bold" > Guardar cambios</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className={disableButtons?'flex-row bg-rose-100 justify-between items-center p-2 rounded':'flex-row bg-rose-600 justify-between items-center p-2 rounded'}
                           onPress={handleDelete} disabled={disableButtons}>
                            <Ionicons name="trash" size={20} color="white" />
                            <Text className="text-white font-bold" > Eliminar Evento</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            {/* Modal para la alerta personalizada */}
            <Modal isVisible={isModalVisible}>
                <View className="bg-white p-6 rounded-lg items-center shadow-lg">
                    <LottieView
                        source={searchAnimated}
                        autoPlay
                        loop
                        className="w-[280] h-[180]"
                    />
                    <Text className="text-sm font-semibold mb-4 text-center">
                        <Text className="font-bold">{TextSchedzy}</Text>
                    </Text>
                    <Text className="font-normal text-center"></Text>

                    <TouchableOpacity onPress={() => setIsModalVisible(false)} className="mt-4">
                        <Text className="text-rose-500 font-medium">Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

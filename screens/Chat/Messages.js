import React, { useState, useCallback, useEffect } from 'react'
import { Bubble, GiftedChat } from 'react-native-gifted-chat'
import * as Database from '../../services/database'
import UserKind from '../../Constants/UserKind'
import * as api from '../../services/ApiChat'
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import {
    createDrawerNavigator,
    DrawerContentScrollView,
} from "@react-navigation/drawer";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import Colors from '../../Constants/Colors'
import { Alert } from 'react-native'
import PickerDefault from '../../Constants/Components/Picker'
import AccountPicker from '../../Constants/Components/SelectAccountPicker'
import Modal_Chat from '../../Constants/Components/Modal'
import { useNavigation } from '@react-navigation/native'

const Drawer = createDrawerNavigator();
function createContext(messages) {
    const context = messages.map(msg => ({
        role: msg.UsuarioChat === UserKind.FINAL_USER ? 'user' : 'assistant',
        content: msg.MensajeChat
    }))
    return context;
}

function GenerateObjectMessage(message) {

    var data = [{
        "_id": uuidv4().toString(),
        "createdAt": new Date(),
        "text": message,
        "user": {
            "_id": 2,
            avatar: require('../../assets/images/chatUser.png'),
            name: 'User',
        }
    }]
    return data
}

const adjustToCentralAmericaTime = (dateString) => {
    const date = new Date(dateString);
    const offset = -6 * 60 * 60 * 1000; // UTC-6
    const adjustedDate = new Date(date.getTime() + offset);
    return adjustedDate;
};

function DoEmptyChat({setRender}) {
    const navigation = useNavigation();
    const [DoEmpChat,setDoEmpChat]=useState(false)
    function deleteChat() {
        /*if (selectedAccount === FIREBASE_AUTH.currentUser.email) {
          Alert.alert("Eliminar Cuentas", "No se puede eliminar la cuenta principal");
          return;
        }*/
        Alert.alert(
            "Vaciar Chat",
            `¿Desea eliminar el chat por completo? Esto no se podrá revertir`,
            [
                {
                    text: "Cancelar",
                    style: "cancel", // Estilo de botón 'cancelar'
                },
                {
                    text: "Sí",
                    onPress: async () => {
                        var error = false;
                        try {
                            const isError=await Database.BorrarTabla()
                            error = isError;
                            
                        } catch (error) {
                            error = true;
                        }
                        Alert.alert(
                            error ? "Error" : "Éxito",
                            error ? "Error al eliminar el chat , intente nuevamente" : "Se elimino el chat correctamente",
                        );
                        setRender(!DoEmpChat);
                        setDoEmpChat(!DoEmpChat)
                        navigation.navigate('Asistente'); // Reemplaza la vista actual
                    },
                },
            ],
            { cancelable: true }
        );
    }
     return (
        <TouchableOpacity className="bg-rose-100 mt-5 py-3 px-3 rounded " style={{ width: 120 }}
            onPress={() => deleteChat()}>
            <Text className="font-bold text-rose-700">Eliminar Chat</Text>
        </TouchableOpacity>
    );
}
export function Example({ render,route }) {
    const [messages, setMessages] = useState([])
    const [db, setDb] = useState(null);

    //Hook cuando cargue el chat en pantalla 
    useEffect(() => {
        async function initializeDB() {
            try {
                const database = await Database.CrearDb();
                await Database.CrearTabla(database);
                setDb(database);
                // Cargar mensajes desde la base de datos al inicio
                const storedMessages = await Database.LeerChat(database);
                const formattedMessages = storedMessages.map(msg => ({
                    _id: msg.idChatRow,
                    text: msg.MensajeChat,
                    createdAt: adjustToCentralAmericaTime(msg.FechaHora), // Puedes ajustar esto según tus datos
                    user: {
                        _id: msg.UsuarioChat === UserKind.CHAT_USER ? 2 : 1, // Ajusta según UserKind
                        name: 'User', // Puedes ajustar esto según tus datos
                        avatar: require('../../assets/images/chatUser.png'), // Ajusta según tus datos
                    },
                }));
                formattedMessages.push({
                    _id: 0,
                    text: "Hola , soy Shedzy, ¿Cómo puedo ayudarte?",
                    createdAt: adjustToCentralAmericaTime(Date.now()), // Puedes ajustar esto según tus datos
                    user: {
                        _id: 2, // Ajusta según UserKind
                        name: 'User', // Puedes ajustar esto según tus datos
                        avatar: require('../../assets/images/chatUser.png'), // Ajusta según tus datos
                    },
                })
                setMessages(formattedMessages);
            } catch (error) {
                console.error('Error initializing database:', error);
            }
        }
        initializeDB();
    }, [])

     //Hook cuando cargue el chat en pantalla 
    useEffect(() => {
        async function initializeDB() {
            try {
                
                const database = await Database.CrearDb();
                await Database.CrearTabla(database);
                setDb(database);
                // Cargar mensajes desde la base de datos al inicio
                const storedMessages = await Database.LeerChat(database);
                const formattedMessages = storedMessages.map(msg => ({
                    _id: msg.idChatRow,
                    text: msg.MensajeChat,
                    createdAt: adjustToCentralAmericaTime(msg.FechaHora), // Puedes ajustar esto según tus datos
                    user: {
                        _id: msg.UsuarioChat === UserKind.CHAT_USER ? 2 : 1, // Ajusta según UserKind
                        name: 'User', // Puedes ajustar esto según tus datos
                        avatar: require('../../assets/images/chatUser.png'), // Ajusta según tus datos
                    },
                }));
                formattedMessages.push({
                    _id: 0,
                    text: "Hola , soy Shedzy, ¿Cómo puedo ayudarte?",
                    createdAt: adjustToCentralAmericaTime(Date.now()), // Puedes ajustar esto según tus datos
                    user: {
                        _id: 2, // Ajusta según UserKind
                        name: 'User', // Puedes ajustar esto según tus datos
                        avatar: require('../../assets/images/chatUser.png'), // Ajusta según tus datos
                    },
                })
                setMessages(formattedMessages);
            } catch (error) {
                console.error('Error initializing database:', error);
            }
        }
        initializeDB();
    }, [render])

    const onSend = useCallback(async (newMessages = []) => {
        if (db) {
            try {
                //console.log(newMessages)
                // Insertar mensajes en la base de datos
                var emailUid = await Database.SelectAccountUserByUUID();
                if (!emailUid || emailUid.email == "no account") {
                    Alert.alert("Envio de Chat", "Seleccione una cuenta para el uso del asistente");
                    return;
                }
                for (const message of newMessages) {
                    await Database.InsertarChat(message.text, UserKind.FINAL_USER, db);
                }

                // Actualizar el estado con los nuevos mensajes que envio el usuario
                setMessages(previousMessages =>
                    GiftedChat.append(previousMessages, newMessages),
                );

                const ChatDb = await Database.LeerContexto(db);
                var RespuestaChat = await api.EnviarMensaje(createContext(ChatDb));
                await Database.InsertarChat(RespuestaChat, UserKind.CHAT_USER, db);

                // Actualizar el estado con los nuevos mensajes que respondio el chat
                setMessages(previousMessages =>
                    GiftedChat.append(previousMessages, GenerateObjectMessage(RespuestaChat)),
                );

            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    }, [db]);

    return (

        <
            GiftedChat messages={messages}
            onSend={messages => onSend(messages)}
            user={
                {
                    _id: 1,
                }
            }
            renderBubble={props => {
                return (
                  <Bubble
                    {...props}
                    wrapperStyle={{
                    right: {
                        color: 'white',
                        backgroundColor: '#34707e',
                      }
                    }}
                  />
                );
              }}
        />
    )
}
function CustomDrawerContent({setRender,...props}) {
    const nombre = "Configuracion";


    return (
        <DrawerContentScrollView {...props}>
            <View className="flex flex-column pl-2 pr-4">
                <View className="flex flex-row pb-3 mt-3 items-center">
                    <Text className="text-base ml-2">{nombre}</Text>
                </View>
                <View
                    style={{
                        borderBottomColor: Colors.Gray.light,
                        borderBottomWidth: 1,
                    }}
                />
                <Modal_Chat />
                <DoEmptyChat setRender={setRender}/>
            </View>
        </DrawerContentScrollView>
    );
}
export default function Asistente() {
    const [render,setRender]=useState(false)
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} setRender={setRender}/>}
        >
        <Drawer.Screen name="Shedzy">
                {(props) => <Example {...props} render={render} />}
        </Drawer.Screen>
        </Drawer.Navigator>
    );
}
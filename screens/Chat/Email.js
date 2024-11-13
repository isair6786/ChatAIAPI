import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import axios from 'axios';
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";
import Colors from '../../Constants/Colors';
import Modal_Chat from '../../Constants/Components/Modal';
import { getRecentEmails } from '../../services/ApiProviders';

const Drawer = createDrawerNavigator();

// Función para formatear la fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}


export function Emails() {
    const [emails, setEmails] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    // Función para cargar correos
    const fetchEmails = async () => {
        const emailData = await getRecentEmails();
        const data = [...emailData[0], ...emailData[1]];
    
        // Ordenar por fecha (descendente)
        const sortedData = data.sort((a, b) => new Date(b.receivedDateTime) - new Date(a.receivedDateTime));
    
        setEmails(sortedData);
    };

    // Hook para cargar correos al renderizar
    useEffect(() => {
        fetchEmails();
    }, []);

    // Función para manejar la acción de "tirar para actualizar"
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchEmails(); // Llama la función para cargar correos
        setRefreshing(false); // Detiene el estado de "refrescando"
    };

    // Renderización de cada item en la lista

    const RenderEmailItem = ({ email }) => {
        const subject = email.subject || email._subject;
        const body = email.bodyPreview || email.body;
        const Title = subject.split(";");
        const provider = Title[1].trim();
        const from = email.from.emailAddress.address
        // Extrae la primera letra del proveedor
        const firstLetter = provider.charAt(0).toUpperCase();

        return (
            <View className="flex-row items-center p-3 border-b border-gray-200 bg-white">
                {provider == "google.com" ? (
                    <View className="w-10 h-10 rounded-full bg-amber-500 justify-center items-center mr-3">
                        <Text className="text-white font-bold">{firstLetter}</Text>
                    </View>
                ) : (
                    <View className="w-10 h-10 rounded-full bg-indigo-500 justify-center items-center mr-3">
                        <Text className="text-white font-bold">{firstLetter}</Text>
                    </View>
                )}

                {/* Información del correo */}
                <View className="flex-1">
                    <Text className="font-bold">Proveedor:
                        {provider == "google.com" ? (
                            <Text className="text-amber-500">{Title[1]}</Text>
                        ) : (
                            <Text className="text-indigo-500">{Title[1]}</Text>
                        )}
                    </Text>
                    <Text className="font-bold">Cuerpo: <Text className="font-normal text-gray-500">{body}</Text></Text>
                    <Text className="font-bold">Enviado por: <Text className="font-normal text-gray-500">{from}</Text></Text>
                    <Text className="font-bold">Recibido el : <Text className="font-normal text-gray-500">{formatDate(email.receivedDateTime)}</Text></Text>
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={emails}
                renderItem={({ item }) => <RenderEmailItem email={item} />}
                keyExtractor={item => item.receivedDateTime}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh} // Vincula la función de actualización
                        colors={[Colors.Emerald.light, Colors.Cyan.light, Colors.Indigo.light]} // Color del indicador de carga en Android
                        tintColor={Colors.Primary} // Color del indicador de carga en iOS
                    />
                }
            />
        </View>
    );
}
function CustomDrawerContent({ setRender, ...props }) {
    const nombre = "Configuracion";

    return (
        <DrawerContentScrollView {...props}>
            <View className="flex flex-column pl-2 pr-4">
                <View className="flex flex-row pb-3 mt-3 items-center">
                    <Text className="text-base ml-2">{nombre}</Text>
                </View>
                <View style={{ borderBottomColor: Colors.Gray.light, borderBottomWidth: 1 }} />
                <Modal_Chat />
            </View>
        </DrawerContentScrollView>
    );
}

export default function EmailsView() {
    const [render, setRender] = useState(false);

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} setRender={setRender} />}
        >
            <Drawer.Screen name="Emails">
                {(props) => <Emails {...props} render={render} />}
            </Drawer.Screen>
        </Drawer.Navigator>
    );
}

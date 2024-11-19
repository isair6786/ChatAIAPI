import React, { useState, useEffect } from 'react';
import Ionicons from "react-native-vector-icons/Ionicons";
import { View, Text, FlatList, RefreshControl, ActivityIndicator, Image, TextInput, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../../Constants/Colors';
import { getRecentEmails, MarcarCorreoComoLeido } from '../../services/ApiProviders';
import error from '../../assets/images/error.png';
import alertAnimated from '../../assets/animations/alert3.json';
import searchAnimated from '../../assets/animations/find.json';
import { randomUUID } from 'expo-crypto';
import LottieView from 'lottie-react-native';
import { now } from 'moment-timezone';
import { Alert } from 'react-native';

function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}
const marcarMailLeido = (email, emailId, setreloadMessages) => {
    return (
        Alert.alert(
            "Marcar como leido",
            `¿Desea marcar como leido el correo?`,
            [
                {
                    text: "Cancelar",
                    style: "cancel", // Estilo de botón 'cancelar'
                },
                {
                    text: "Sí",
                    onPress: async () => {
                        try {
                            const result = await MarcarCorreoComoLeido(email, emailId)
                            if (result.success) {
                                Alert.alert(
                                    "Exito",
                                    "Correo Marcado como leido"
                                );
                            } else {
                                Alert.alert(
                                    "Error",
                                    "Ocurrio un error al marcar el correo como leido , intente mas tarde"
                                );
                            }
                            setreloadMessages(true)
                        } catch (error) {

                            Alert.alert(
                                "Error",
                                "Ocurrio un error al marcar el correo como leido , intente mas tarde"
                            );
                        }
                    },
                },
            ],
            { cancelable: true }
        )
    );
}

export default function EmailsView() {
    const [emails, setEmails] = useState([]);
    const [message, setMessage] = useState("Cargando Correos recientes...");
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setisLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [meetingCount, setMeetingCount] = useState(0);
    const [reloadMessages, setreloadMessages] = useState(false);

    // Función para cargar correos
    const fetchEmails = async () => {
        const emailData = await getRecentEmails();
        if (emailData.length > 0) {
            const data = [...emailData[0], ...emailData[1] || []];

            // Ordenar primero por isMeeting y luego por fecha (descendente)
            const sortedData = data.sort((a, b) => {
                if (a.isMeeting === b.isMeeting) {
                    return new Date(b.receivedDateTime) - new Date(a.receivedDateTime);
                }
                return a.isMeeting ? -1 : 1;
            });

            setEmails(sortedData);

            // Contar correos con isMeeting: true y mostrar modal
            const meetingEmailsCount = sortedData.filter(email => email.isMeeting).length;

            if (meetingEmailsCount > 0) {
                setMeetingCount(meetingEmailsCount);
                setIsModalVisible(true);
            }
        } else {
            setEmails([]);
            setMessage("Ocurrió un error con tus cuentas, intenta eliminar tus cuentas e ingresa nuevamente.");
        }
        setisLoading(false);
        //Para recargar los correos cada 3 minutos
        setTimeout(() => {
            setreloadMessages(!reloadMessages)
        }, 180000); //3 minutos 

    };

    useEffect(() => {
        fetchEmails();
    }, []);

    useEffect(() => {
        fetchEmails();
    }, [reloadMessages]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchEmails();
        setRefreshing(false);
    };

    const filteredEmails = emails.filter(email => {
        const filterLower = filter.toLowerCase();
        const subject = email.subject ? email.subject.toLowerCase() : '';
        const body = email.bodyPreview ? email.bodyPreview.toLowerCase() : '';
        const from = email.from?.emailAddress?.address.toLowerCase() || '';
        const provider = email.from?.emailAddress?.address.toLowerCase() || '';

        return subject.includes(filterLower) || body.includes(filterLower) || from.includes(filterLower) || provider.includes(filterLower);
    });

    const RenderEmailItem = ({ email }) => {
        const subject = email.subject || email._subject;
        const body = email.bodyPreview || email.body;
        const Title = subject.split(";");
        const provider = Title[1]?.trim();
        const from = email.from.emailAddress.address;
        const account = email.account;
        const _isMeeting = email.isMeeting;

        const firstLetter = provider ? provider.charAt(0).toUpperCase() : '';
        const handleMarkAsRead = async () => {
           await marcarMailLeido(account, email.id, setreloadMessages);
        };

        return (
            <View style={{ flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                {!_isMeeting ? (
                    <>{provider === "google.com" ? (
                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#f59e0b', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{firstLetter}</Text>
                        </View>
                    ) : (
                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#6366f1', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{firstLetter}</Text>
                        </View>
                    )}</>
                )
                    :
                    <>
                        <View style={{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                            <LottieView
                                source={alertAnimated}
                                autoPlay
                                loop
                                className="w-[80] h-[80]"
                            />
                        </View>
                    </>
                }

                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold' }}>Proveedor: {provider}</Text>
                    <Text style={{ fontWeight: 'bold' }}>Cuenta: <Text style={{ fontWeight: 'normal', color: '#777' }}>{account}</Text></Text>
                    <Text style={{ fontWeight: 'bold' }}>Cuerpo: <Text style={{ fontWeight: 'normal', color: '#777' }}>{body}</Text></Text>
                    <Text style={{ fontWeight: 'bold' }}>Enviado por: <Text style={{ fontWeight: 'normal', color: '#777' }}>{from}</Text></Text>
                    <Text style={{ fontWeight: 'bold' }}>Recibido el: <Text style={{ fontWeight: 'normal', color: '#777' }}>{formatDate(email.receivedDateTime)}</Text></Text>
                    {_isMeeting ?
                        <View style={{ backgroundColor: 'white', elevation: 5 ,borderRadius:15, padding:15,width:200,marginTop:20,height:70 }}>
                            <TouchableOpacity
                                onPress={handleMarkAsRead}
                                className="text-white font-bold  rounded-full"
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name="checkmark-circle" size={30} color={"rgb(67 56 202)"} />
                                    <Text className="text-center font-bold text-indigo-700"> Marcar como Leído</Text>
                                </View>
                            </TouchableOpacity>
                        </View> : null}
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            {/* Filtros */}
            <View style={{ padding: 10 }}>
                <TextInput
                    placeholder="Filtrar por proveedor, asunto o cuerpo..."
                    value={filter}
                    onChangeText={setFilter}
                    style={{
                        height: 40,
                        borderColor: 'gray',
                        borderWidth: 1,
                        marginBottom: 10,
                        paddingLeft: 10,
                        borderRadius: 5,
                    }}
                />
            </View>

            {/* Lista de correos */}
            {!isLoading && emails.length > 0 ? (
                <FlatList
                    data={filteredEmails}
                    renderItem={({ item }) => <RenderEmailItem email={item} />}
                    keyExtractor={item => randomUUID()}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[Colors.Emerald.light, Colors.Cyan.light, Colors.Indigo.light]}
                            tintColor={Colors.Primary}
                        />
                    }
                />
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {isLoading ? (
                        <ActivityIndicator size="large" color={[Colors.Emerald.light, Colors.Cyan.light, Colors.Indigo.light]} />
                    ) : (
                        <Image style={{ width: 250, height: 250 }} source={error} />
                    )}
                    <Text style={{ marginTop: 20, textAlign: 'center' }}>{message}</Text>
                </View>
            )}

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
                        <Text className="font-bold">Schedzy</Text> analizó tus correos!
                    </Text>
                    <Text className="font-normal text-center">Encontró {meetingCount} {meetingCount > 1 ? "correos que contienen" : "correo que contiene"} datos sobre invitaciones a reuniones. Puedes marcarlos como leídos si ya verificaste su contenido.</Text>

                    <TouchableOpacity onPress={() => setIsModalVisible(false)} className="mt-4">
                        <Text className="text-rose-500 font-medium">Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

        </View>
    );
}

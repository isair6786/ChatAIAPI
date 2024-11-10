import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import * as Calendario from "expo-calendar";
import { Agenda } from "react-native-calendars";
import moment from "moment-timezone";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import Colors from "../../Constants/Colors";
import { DefaultToggle } from "../../Constants/Components/Toogle";
import PickerDefault from "../../Constants/Components/Picker";
import { FIREBASE_AUTH } from "../../services/Firebase/FirebaseConfig";
import { getRandomLightColor, NameSplit, obtenerSoloFechaActual } from "../../Functions/Functions";
import { ConsultarEventos } from "../../services/ApiProviders";

const Drawer = createDrawerNavigator();

function CalendarioEventos({render}) {
  const [events, setEvents] = useState({});

  useEffect(() => {
    (async () => {
      const startDate = obtenerSoloFechaActual()
      const eventos = await ConsultarEventos(startDate)

      setEvents(CreateListEvents(eventos));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const startDate = obtenerSoloFechaActual()
      const eventos = await ConsultarEventos(startDate)

      setEvents(CreateListEvents(eventos));
    })();
  }, [render]);

  return (
    <View className="flex h-full w-full">
      <Agenda
        items={events}
        onDayPress={async day => {
          const eventos = await ConsultarEventos(day.dateString)
          setEvents(CreateListEvents(eventos));
        }}
        renderItem={(item) => (
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              flex: 1,
              borderRadius: 5,
              padding: 10,
              marginRight: 10,
              marginTop: 17,
              flexDirection: "row", // Para alinear el círculo y los textos horizontalmente
              alignItems: "center",  // Centrar verticalmente los elementos
            }}
          >
            {/* Círculo con inicial */}
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15, // Para hacer un círculo
                backgroundColor: item.provider_id === "microsoft.com" ? "#00bbff" : "#ffb000", // Color según el proveedor
                justifyContent: "center",
                alignItems: "center",
                marginRight: 15, // Espaciado entre el círculo y el texto
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {item.provider_id === "microsoft.com" ? "M" : "G"} {/* Inicial del proveedor */}
              </Text>
            </View>

            {/* Texto del evento */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: "gray" }}>
                {item.provider_id} - Calendario: {item.calendar_name} 
              </Text>
              <Text style={{ fontSize: 12, color: "gray" }}>
                <Text style={{ fontSize: 13, color: "gray", fontWeight: 900 }}>Cuenta </Text> {item.account}
              </Text>
              <Text className="font-bold">{item.name}</Text>
              <Text>{item.data}</Text>
              <Text style={{ fontSize: 12, color: "gray" }}>
                {item.calendarName} {/* Nombre del calendario */}
              </Text>
            </View>
          </TouchableOpacity>

        )}
        renderEmptyDate={() => (
          <View style={{ margin: 10 }}>
            <Text>Sin eventos</Text>
          </View>
        )}
      />
    </View>
  );
}

function CreateListEvents(events) {
  const formattedItems = events.reduce(
    (acc, { startDate, title, notes, endDate, timeZone, calendarName, email, provider }) => {

      // Extraemos solo la parte de la fecha de startDate (ignorando la hora)
      const eventDate = moment.tz(startDate, timeZone).format("YYYY-MM-DD");
      const startTime = moment.tz(startDate, timeZone).format("HH:mm");
      const EventEndDate = moment.tz(endDate, timeZone).format("YYYY-MM-DD");
      const endTime = moment.tz(endDate, timeZone).format("HH:mm");

      var Detalles = `Inicia el ${eventDate} a las ${startTime} \nFinaliza el ${EventEndDate} a las ${endTime}`;
      // Si aún no hay un array para esta fecha en el acumulador, creamos uno vacío
      if (!acc[eventDate]) acc[eventDate] = [];

      // Añadimos el evento al array correspondiente a la fecha
      acc[eventDate].push({
        account: email,
        provider_id: provider,
        calendar_name: calendarName,
        name: title,
        data: Detalles || "Sin detalles adicionales",
      });

      // Devolvemos el acumulador para la siguiente iteración
      return acc;
    },
    {}
  );
  //console.log(formattedItems)
  return formattedItems;
}
/*Drawer*/
function CustomDrawerContent({setRender,...props}) {
  const nombre = NameSplit(FIREBASE_AUTH.currentUser.displayName);

  return (
    <DrawerContentScrollView {...props}>
      <View className="flex flex-column pl-2 pr-4">
        <View className="flex flex-row pb-3 mt-3 items-center">
          <Text
            className="text-base ml-1 rounded-full h-10 w-10 text-center p-2"
            style={{ backgroundColor: 'rgb(199 210 254)' }}
          >
            {FIREBASE_AUTH.currentUser.displayName.charAt(0).toUpperCase()}
          </Text>
          <Text className="text-base ml-2">{nombre}</Text>
        </View>
        <View
          style={{
            borderBottomColor: Colors.Gray.light,
            borderBottomWidth: 1,
          }}
        />
        <PickerDefault name="Cuentas" setRender={setRender} />
        <DefaultToggle color={Colors.Emerald} />
      </View>
    </DrawerContentScrollView>
  );
}
export default function Calendarios() {
  const [render,setRender]=useState(false)

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} setRender={setRender} />}
    >
      <Drawer.Screen name="Agendas">
                {(props) => <CalendarioEventos {...props} render={render} />}
        </Drawer.Screen>

    </Drawer.Navigator>
  );
}

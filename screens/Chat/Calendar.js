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
import { getRandomLightColor, NameSplit } from "../../Functions/Functions";

const Drawer = createDrawerNavigator();

function CalendarioEventos() {
  const [events, setEvents] = useState({});

  useEffect(() => {
    (async () => {
      const { status } = await Calendario.requestCalendarPermissionsAsync();
      console.log(status);
      if (status === "granted") {
        const calendars = await Calendario.getCalendarsAsync(
          Calendario.EntityTypes.EVENT
        );
        const calendarIds = calendars.map((calendar) => calendar.id);
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7); // Una semana después
        startDate.setDate(startDate.getDate() + -3); // Tres dias antes
        const eventos = await Calendario.getEventsAsync(
          calendarIds,
          startDate,
          endDate
        );
        setEvents(CreateListEvents(eventos));
        console.log({ eventos });
      }
    })();
  }, []);

  return (
    <View className="flex h-full w-full">
      <Agenda
        items={events}
        renderItem={(item, isFirst) => (
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              flex: 1,
              borderRadius: 5,
              padding: 10,
              marginRight: 10,
              marginTop: 17,
            }}
          >
            <Text className="font-bold">{item.name}</Text>
            <Text>{item.data}</Text>
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
    (acc, { startDate, title, notes, endDate, timeZone }) => {
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
        name: title,
        data: Detalles || "No additional details",
      });

      // Devolvemos el acumulador para la siguiente iteración
      return acc;
    },
    {}
  );
  return formattedItems;
}
/*Drawer*/
function CustomDrawerContent(props) {
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
        <PickerDefault
          items={[
            { label: "Nombre del ítem", value: "valor" },
            { label: "Nombre del ítem 2 ", value: "valor 2" },
          ]}
        />
        <DefaultToggle color={Colors.Emerald} />
      </View>
    </DrawerContentScrollView>
  );
}
function MyToggle({ color }) {
  const [isOn, setIsOn] = useState(false);

  return (
    <View className="flex-row items-center m-1.5">
      <Pressable
        onPress={() => setIsOn(!isOn)}
        className={`w-10 h-5 flex items-left rounded-full`}
        style={
          isOn
            ? { backgroundColor: color.light }
            : { backgroundColor: "#dadada" }
        }
      >
        <View
          className={`w-5 h-5 rounded-full shadow-md transform ${
            isOn ? "translate-x-5" : "translate-x-0"
          } `}
          style={
            isOn
              ? { backgroundColor: color.dark }
              : { backgroundColor: "#ffffff" }
          }
        />
      </Pressable>
      <Text className="ml-4 text-lg">{isOn ? "Encendido" : "Apagado"}</Text>
    </View>
  );
}
export default function Calendarios() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Agendas" component={CalendarioEventos} />
    </Drawer.Navigator>
  );
}

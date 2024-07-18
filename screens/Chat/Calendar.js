import { View,Text, TouchableOpacity} from 'react-native'
import React,{useState, useEffect}  from 'react';
import * as Calendario from 'expo-calendar';
import {Agenda } from 'react-native-calendars';
import moment from 'moment-timezone';



export default function Calendarios() {
  const [events, setEvents] = useState({});

  useEffect(() => {
    (async () => {
      const { status } = await Calendario.requestCalendarPermissionsAsync();
      console.log(status)
      if (status === 'granted') {
        const calendars = await Calendario.getCalendarsAsync(Calendario.EntityTypes.EVENT);
        const calendarIds = calendars.map(calendar => calendar.id);
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7); // Una semana después
        startDate.setDate(startDate.getDate() + -3); // Tres dias antes
        const eventos = await Calendario.getEventsAsync(calendarIds, startDate, endDate);
        setEvents(CreateListEvents(eventos))
        console.log({eventos})
      }
    })();
  }, []);

  return (
    <View className='flex h-full w-full'>
      <Agenda items={events}
      renderItem={(item,isFirst) => (
        <TouchableOpacity 
          style={{ backgroundColor: 'white',
            flex: 1,
            borderRadius: 5,
            padding: 10,
            marginRight: 10,
            marginTop: 17}}
        >
          <Text className='font-bold'>{item.name}</Text>
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
  const formattedItems = events.reduce((acc, { startDate, title, notes,endDate,timeZone }) => {
    // Extraemos solo la parte de la fecha de startDate (ignorando la hora)
    const eventDate = moment.tz(startDate, timeZone).format('YYYY-MM-DD');
    const startTime = moment.tz(startDate, timeZone).format('HH:mm');
    const EventEndDate = moment.tz(endDate, timeZone).format('YYYY-MM-DD');
    const endTime = moment.tz(endDate, timeZone).format('HH:mm');
  
    var Detalles=`Inicia el ${eventDate} a las ${startTime} \nFinaliza el ${EventEndDate} a las ${endTime}`
    // Si aún no hay un array para esta fecha en el acumulador, creamos uno vacío
    if (!acc[eventDate]) acc[eventDate] = [];
    
    // Añadimos el evento al array correspondiente a la fecha
    acc[eventDate].push({ name: title, data: Detalles  || 'No additional details' });
    
    // Devolvemos el acumulador para la siguiente iteración
    return acc;
  }, {});
  return formattedItems
}
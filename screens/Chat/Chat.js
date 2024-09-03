  import { View, Text,TouchableOpacity  } from 'react-native'
  import {React,useEffect,useState} from 'react'
  import {useNavigation } from '@react-navigation/native';
  import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import Messages from './Messages'
  import Calendar from './Calendar'
  import { FIREBASE_AUTH } from '../../services/Firebase/FirebaseConfig';
  import { onAuthStateChanged } from 'firebase/auth';
  import { logOutUser } from '../../services/Firebase/FirebaseFunctions';
  
  const Tab = createBottomTabNavigator();
  function Chat() {

    const [userEmail, setUserEmail] = useState('');
    const navigation = useNavigation(); // Obtener el objeto de navegación
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
          console.log(currentUser)
          if (!currentUser) {
              // El usuario no está autenticado, redirigir a la pantalla de inicio de sesión
              //console.log('aca vamos')
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
          }
          else{
            setUserEmail(currentUser.email)
          }
      });

      return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        logOutUser();
        navigation.navigate('Login');
    };
    return (
      <View style={{ flex: 1 }}>
      <Tab.Navigator
          screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  if (route.name === 'Chats') {
                      iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
                  } else if (route.name === 'Calendario') {
                      iconName = focused ? 'calendar' : 'calendar-outline';
                  }

                  return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: 'indigo',
              tabBarInactiveTintColor: 'gray',
          })}
      >
          <Tab.Screen name="Chats" component={Messages} />
          <Tab.Screen name="Calendario" component={Calendar} />
      </Tab.Navigator>

      {/* Botón de cerrar sesión */}
      <TouchableOpacity
          style={{
              position: 'absolute',
              top: 10,
              right: 10,
              padding: 10,
              backgroundColor: '#000000',
              borderRadius: 50,
          }}
          onPress={handleSignOut}
      >
          <Ionicons name="log-out-outline" size={20} color="white" />
      </TouchableOpacity>
  </View>
    );
  }

  export default Chat;
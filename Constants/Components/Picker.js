import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { View, TouchableOpacity, Text, Alert, ActivityIndicator } from "react-native";
import Colors from "../Colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { DeleteAccountCalendar, SelectTableCalendar } from "../../services/database";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../services/Firebase/FirebaseConfig";

export default function PickerDefault() {
  const [selectedAccount, setSelectedAccount] = useState();
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Estado para la carga
  const navigation = useNavigation(); // Obtén el objeto de navegación

  async function eliminarCuenta() {
    if (selectedAccount === FIREBASE_AUTH.currentUser.email) {
      Alert.alert("Eliminar Cuentas", "No se puede eliminar la cuenta principal");
      return;
    }
    
    Alert.alert(
      "Eliminar Cuentas",
      `¿Desea eliminar la cuenta ${selectedAccount}?`,
      [
        {
          text: "Cancelar",
          style: "cancel", // Estilo de botón 'cancelar'
        },
        {
          text: "Sí",
          onPress: async () => {
            setIsLoading(true); // Inicia el indicador de carga
            try {
              await DeleteAccountCalendar(selectedAccount);
              await actualizarData();
              setIsLoading(false); // Finaliza la carga
              Alert.alert("Éxito", "Cuenta eliminada exitosamente");
            } catch (error) {
              setIsLoading(false); // Finaliza la carga en caso de error
              Alert.alert(
                "Error",
                "Ocurrió un error al eliminar la cuenta, por favor intente nuevamente"
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  }

  async function actualizarData() {
    const data = await SelectTableCalendar("CalendarsUsers", "desc", "uuid");
    setAccounts(data);
    setSelectedAccount(data[0]?.email); // Actualiza la cuenta seleccionada
  }

  async function cantidadCuentas() {
    const countAccounts = await SelectTableCalendar("CalendarsUsers", "desc", "uuid");
    return countAccounts.length;
  }

  useEffect(() => {
    async function getData() {
      const data = await SelectTableCalendar("CalendarsUsers", "desc", "uuid");
      setAccounts(data);
      setSelectedAccount(data[0]?.email);
    }
    getData();
  }, []);

  return (
    <View className="flex flex-col items-start mt-5 p-2">
      <Text className="text-base text-left pl-1">Cuentas</Text>
      <View className="flex flex-row items-center pl-1">
        <Picker
          style={{
            width: 180,
            backgroundColor: "white",
            shadowColor: "black",
            shadowOffset: { width: 1, height: 5 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 2,
          }}
          selectedValue={selectedAccount}
          onValueChange={(itemValue) => setSelectedAccount(itemValue)}
        >
          {accounts.map((item) => (
            <Picker.Item
              style={{ fontSize: 15, color: Colors.Gray.dark }}
              key={item.email + "/" + item.uuid}
              label={item.email}
              value={item.email}
            />
          ))}
        </Picker>

        <TouchableOpacity
          onPress={async () => {
            const count = await cantidadCuentas();
            
            count <= 1
              ? navigation.navigate("AddAccountWeb")
              : Alert.alert("Límite de Cuentas", "Solo puedes asociar dos cuentas");
          }} // Navega a la pantalla AddAccountWeb
          className="ml-3"
        >
          <Ionicons name="add-circle-sharp" size={30} color={"rgb(67 56 202)"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => eliminarCuenta()} className="">
          <Ionicons name="trash" size={30} color={"rgb(225 29 72)"} />
        </TouchableOpacity>
      </View>
      {/* Muestra el indicador de carga mientras se está eliminando una cuenta */}
      {isLoading && (
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator size="large" color="blue" />
          <Text>Eliminando cuenta...</Text>
        </View>
      )}
    </View>
  );
}

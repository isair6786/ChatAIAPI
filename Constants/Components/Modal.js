import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { View, Text, Modal, TouchableOpacity, Alert } from "react-native";
import Colors from "../Colors";
import { SelectTableCalendar, SetAccountChat } from "../../services/database";
import AccountPicker from "./SelectAccountPicker";

export default function Modal_Chat() {
  const [selectedAccount, setSelectedAccount] = useState();
  const [accounts, setAccounts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function getData() {
      const data = await SelectTableCalendar("CalendarsUsers", "desc", "uuid");
      setAccounts(data);
      setSelectedAccount(data[0]?.email);
      await SetAccountChat(data[0]?.email);
    }
    getData();
  }, []);

  const handleAccountChange = async (itemValue) => {
    setSelectedAccount(itemValue);
    await SetAccountChat(itemValue);
    if (onAccountChange) {
      onAccountChange(); // Llama al callback para actualizar otros componentes
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Text className="text-black mt-5 mb-5 ">Selecciona una cuenta para ser usada en el chat</Text>
      <TouchableOpacity className="bg-teal-800  py-5 px-4 rounded focus:outline-none"
        onPress={() => openModal()}>
        <Text className="font-bold text-white ">Seleccionar cuenta</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: "white",
              borderRadius: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 2,
              elevation: 5,
            }}
          >
            <Text className="text-black mb-5 " style={{ fontSize: 18 }}>Cuentas</Text>
            <AccountPicker/>
            <TouchableOpacity className=" py-3 px-3 rounded " style={{ width: 85 }}
              onPress={() => closeModal()}>
              <Text className="font-bold text-rose-700">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity className=" py-3 px-3 rounded " style={{ width: 85 }}
              onPress={() => closeModal()}>
              <Text className="font-bold text-teal-700">Aceptar</Text>
            </TouchableOpacity>
        </View>
      </View>
    </Modal >
    </>
  );
}

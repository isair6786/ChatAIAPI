import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { View, Text} from "react-native";
import Colors from "../Colors";
import {  SelectAccountUserByUUID, SelectTableCalendar, SetAccountChat } from "../../services/database";

export default function AccountPicker() {
  const [selectedAccount, setSelectedAccount] = useState();
  const [accounts, setAccounts] = useState([]);


  useEffect(() => {
    async function getData() {
      const data = await SelectTableCalendar("CalendarsUsers", "desc", "uuid");
      setAccounts(data);
      setSelectedAccount(data[0]?.email);
      await SetAccountChat(data[0]?.email);
    }
    getData();
  }, []);

  return (
    <View className="flex flex-col items-start mt-5 p-2">
      <Text className="text-base text-left pl-1 mb-2">Elige la cuenta a usar en el Asistente:</Text>
      <View className="flex flex-row items-center pl-1">
        <Picker
          style={{
            width: 250,
            backgroundColor: "white",
            shadowColor: "black",
            shadowOffset: { width: 1, height: 5 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 2,
          }}
          selectedValue={selectedAccount}
          onValueChange={async (itemValue) => {
            setSelectedAccount(itemValue)
            await SetAccountChat(itemValue);
           console.log(await SelectAccountUserByUUID())
          }
          }
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
      </View>
    </View>
  );
}
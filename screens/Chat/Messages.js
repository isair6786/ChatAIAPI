import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import * as Database from '../../services/database'
import UserKind from '../../Constants/UserKind'
import * as api from '../../services/ApiChat'

function createContext(messages) {
  const context = messages.map(msg => ({
    role: msg.UsuarioChat === UserKind.FINAL_USER ? 'user' : 'assistant',
    content: msg.MensajeChat
  }))
  return context;
}
const adjustToCentralAmericaTime = (dateString) => {
  const date = new Date(dateString);
  const offset = -6 * 60 * 60 * 1000; // UTC-6
  const adjustedDate = new Date(date.getTime() + offset);
  return adjustedDate;
};

export default function Example() {
  const [messages, setMessages] = useState([])
  const [db, setDb] = useState(null);
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
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    }
    initializeDB();
  }, [])

  const onSend = useCallback(async (newMessages = []) => {
    if (db) {
      try {
        // Insertar mensajes en la base de datos
        for (const message of newMessages) {
          await Database.InsertarChat(message.text, UserKind.FINAL_USER, db);
        }

        // Actualizar el estado con los nuevos mensajes
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, newMessages),
        );

        const ChatDb = await Database.LeerContexto(db);
        api.EnviarMensaje(createContext(ChatDb))
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }, [db]);

  return (
    
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  )
}


import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { MotiView, AnimatePresence } from "moti";
import AsyncStorage from "@react-native-async-storage/async-storage";

import walletService from "../services/walletService";
import userService from "../services/userService";

const { height } = Dimensions.get('window');

export default function ChatFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: "Olá! 👋 Sou seu assistente financeiro. Como posso ajudar hoje?", sender: 'bot' }
  ]);
  const [suggestions, setSuggestions] = useState([
    "Como funciona?", "Quais moedas tem?", "Ver meu saldo"
  ]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  // Rola para o fim ao abrir ou receber mensagem
  useEffect(() => {
    if (isOpen) {
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 300);
    }
  }, [isOpen, messages]);

  const handleSend = async (text) => {
    const msgText = text || inputText;
    if (!msgText.trim()) return;

    // 1. Adiciona mensagem do usuário
    const userMsg = { id: Date.now(), text: msgText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setSuggestions([]);
    setLoading(true);

    try {
        // 2. Busca ID do usuário
        const userProfile = await userService.getProfile();
        const userId = userProfile.id || 0;

        // 3. Chama API
        const data = await walletService.sendMessage(userId, msgText);

        // 4. Adiciona resposta do Bot
        const botMsg = { 
            id: Date.now() + 1, 
            text: data.reply || "Não entendi.", 
            sender: 'bot' 
        };
        setMessages(prev => [...prev, botMsg]);
        
        if (data.suggestions && data.suggestions.length > 0) {
            setSuggestions(data.suggestions);
        } else {
            setSuggestions(["Ajuda", "Voltar ao início"]);
        }

    } catch (error) {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: "Erro de conexão com o assistente.", sender: 'bot' }]);
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      {/* BOTÃO FLUTUANTE (FAB) */}
      <MotiView 
        from={{ scale: 0 }} 
        animate={{ scale: 1 }} 
        style={styles.fabContainer}
      >
        <TouchableOpacity 
            style={styles.fab} 
            onPress={() => setIsOpen(true)}
            activeOpacity={0.8}
        >
            <Feather name="message-square" size={24} color="#fff" />
        </TouchableOpacity>
      </MotiView>

      {/* MODAL DE CHAT */}
      <Modal visible={isOpen} animationType="slide" transparent onRequestClose={() => setIsOpen(false)}>
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.modalOverlay}
        >
            <View style={styles.chatContainer}>
                
                {/* Header do Chat */}
                <View style={styles.header}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                        <View style={styles.botIcon}>
                            <FontAwesome5 name="robot" size={16} color="#fff" />
                        </View>
                        <View>
                            <Text style={styles.headerTitle}>Assistente Virtual</Text>
                            <Text style={styles.headerStatus}>● Online</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.closeBtn}>
                        <Feather name="x" size={24} color="#848E9C" />
                    </TouchableOpacity>
                </View>

                {/* Lista de Mensagens */}
                <ScrollView 
                    ref={scrollViewRef}
                    style={styles.messagesArea} 
                    contentContainerStyle={{padding: 16, paddingBottom: 20}}
                >
                    {messages.map((msg) => (
                        <View key={msg.id} style={[
                            styles.messageBubble, 
                            msg.sender === 'user' ? styles.userBubble : styles.botBubble
                        ]}>
                            <Text style={msg.sender === 'user' ? styles.userText : styles.botText}>
                                {msg.text}
                            </Text>
                        </View>
                    ))}
                    {loading && (
                        <View style={styles.botBubble}>
                             <ActivityIndicator size="small" color="#8B5CF6" />
                        </View>
                    )}
                </ScrollView>

                {/* Sugestões (Chips) */}
                {suggestions.length > 0 && !loading && (
                    <View style={styles.suggestionsContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {suggestions.map((sug, i) => (
                                <TouchableOpacity key={i} style={styles.suggestionChip} onPress={() => handleSend(sug)}>
                                    <Text style={styles.suggestionText}>{sug}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Input Area */}
                <View style={styles.inputArea}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Digite sua dúvida..." 
                        placeholderTextColor="#666"
                        value={inputText}
                        onChangeText={setInputText}
                        onSubmitEditing={() => handleSend()}
                    />
                    <TouchableOpacity 
                        style={[styles.sendBtn, (!inputText.trim() || loading) && {opacity: 0.5}]} 
                        disabled={!inputText.trim() || loading}
                        onPress={() => handleSend()}
                    >
                        <Feather name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

            </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // FAB
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 9999, // Fica acima de tudo
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#1E2329'
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  chatContainer: {
    height: height * 0.85, // Ocupa 85% da tela
    backgroundColor: '#1E2329',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#2B3139',
    overflow: 'hidden',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2B3139',
    borderBottomWidth: 1,
    borderBottomColor: '#474D57',
  },
  botIcon: {
      width: 36, height: 36, borderRadius: 18, backgroundColor: '#8B5CF6',
      justifyContent: 'center', alignItems: 'center',
      shadowColor: "#8B5CF6", shadowOpacity: 0.5, shadowRadius: 5
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  headerStatus: { fontSize: 12, color: '#0ECB81' },
  closeBtn: { padding: 4 },

  // Messages
  messagesArea: { flex: 1, backgroundColor: '#0B0E11' },
  messageBubble: {
      maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 12,
  },
  botBubble: {
      alignSelf: 'flex-start', backgroundColor: '#2B3139', borderBottomLeftRadius: 0,
      borderWidth: 1, borderColor: '#474D57'
  },
  userBubble: {
      alignSelf: 'flex-end', backgroundColor: '#8B5CF6', borderBottomRightRadius: 0,
  },
  botText: { color: '#EAECEF', fontSize: 14, lineHeight: 20 },
  userText: { color: '#fff', fontSize: 14, lineHeight: 20 },

  // Suggestions
  suggestionsContainer: {
      paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#1E2329',
      borderTopWidth: 1, borderTopColor: '#2B3139'
  },
  suggestionChip: {
      paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#2B3139',
      borderRadius: 20, borderWidth: 1, borderColor: '#8B5CF6', marginRight: 8
  },
  suggestionText: { color: '#EAECEF', fontSize: 12 },

  // Input
  inputArea: {
      flexDirection: 'row', alignItems: 'center', padding: 12,
      backgroundColor: '#1E2329', borderTopWidth: 1, borderTopColor: '#2B3139', gap: 10
  },
  input: {
      flex: 1, backgroundColor: '#0B0E11', color: '#fff',
      paddingHorizontal: 16, paddingVertical: 12, borderRadius: 24,
      borderWidth: 1, borderColor: '#474D57', fontSize: 14
  },
  sendBtn: {
      width: 44, height: 44, borderRadius: 22, backgroundColor: '#8B5CF6',
      justifyContent: 'center', alignItems: 'center',
      shadowColor: "#8B5CF6", shadowOpacity: 0.3, shadowRadius: 5
  }
});
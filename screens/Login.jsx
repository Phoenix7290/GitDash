import React, { useState } from "react";
import { TextInput, Button, Image, StyleSheet, View, Text, Alert } from "react-native";
import { useAuth } from "../context/index.jsx";
import { getRepositories } from "../services/index.js";
import UserImage from "../assets/png/user.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !token) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      await getRepositories(username, token);
      login(username, token);
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={UserImage}
        style={styles.icon}
      />
      <Text style={styles.title}>Para usar o app gestor do GitHub, use sua chave de API do GitHub</Text>
      <TextInput
        placeholder="Usuário"
        placeholderTextColor="#888"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Token"
        placeholderTextColor="#888"
        style={styles.input}
        value={token}
        onChangeText={setToken}
        secureTextEntry
      />
      <Button title="Acessar" onPress={handleLogin} color="#6200ee" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
});

export default Login;

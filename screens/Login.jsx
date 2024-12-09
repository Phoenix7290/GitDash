import React, { useState } from "react";
import { TextInput, Button, Image, StyleSheet, View, Alert } from "react-native";
import { useAuth } from "../context/index.jsx";
import { getRepositories } from "../services/index.js";

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
        source={{ uri: "https://example.com/person-icon.png" }}
        style={styles.icon}
      />
      <TextInput
        placeholder="User"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Token"
        style={styles.input}
        value={token}
        onChangeText={setToken}
      />
      <Button title="Acessar" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
});

export default Login;

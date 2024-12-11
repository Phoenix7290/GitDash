import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Alert 
} from "react-native";
import { useAuth } from "../context/index.jsx";

export const createIssue = async (username, token, repoName, issueData) => {
  const url = `https://api.github.com/repos/${username}/${repoName}/issues`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: issueData.title,
        body: issueData.description || '',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Failed to create issue: ${response.status} ${response.statusText} - ${errorText}`
      );
      throw new Error("Failed to create issue");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating issue:", error);
    throw error;
  }
};

const RepositoryDetailsScreen = ({ route, navigation }) => {
  const { repository } = route.params;
  const { authData } = useAuth();
  
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: ''
  });

  const handleCreateIssue = async () => {
    if (!newIssue.title.trim()) {
      Alert.alert("Erro", "O título da issue é obrigatório");
      return;
    }

    try {
      await createIssue(
        authData.username, 
        authData.token, 
        repository.name, 
        newIssue
      );
      
      Alert.alert("Sucesso", "Issue criada com sucesso");
      
      // Limpar o formulário
      setNewIssue({ title: '', description: '' });
    } catch (error) {
      Alert.alert("Erro", "Falha ao criar issue");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.repoName}>{repository.name}</Text>
        <Text style={styles.repoDescription}>
          {repository.description || 'Sem descrição'}
        </Text>
      </View>

      <View style={styles.issueForm}>
        <Text style={styles.formTitle}>Criar Nova Issue</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Título da Issue"
          value={newIssue.title}
          onChangeText={(text) => setNewIssue(prev => ({ ...prev, title: text }))}
        />
        
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Descrição (Opcional)"
          value={newIssue.description}
          onChangeText={(text) => setNewIssue(prev => ({ ...prev, description: text }))}
          multiline
          numberOfLines={4}
        />
        
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreateIssue}
        >
          <Text style={styles.createButtonText}>Criar Issue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    padding: 20,
    backgroundColor: '#007bff',
    alignItems: 'center',
  },
  repoName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  repoDescription: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  issueForm: {
    padding: 20,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RepositoryDetailsScreen;
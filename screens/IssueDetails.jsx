import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from "../context/index.jsx";
import { closeIssue } from "../services/index.js";

const IssueDetailsScreen = ({ route, navigation }) => {
  const { issue } = route.params;
  const { authData } = useAuth();

  const handleCloseIssue = async () => {
    try {
      const repoName = issue.repository_url.split('/').pop();
      
      Alert.alert(
        'Fechar Issue',
        'Tem certeza que deseja fechar esta issue?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Fechar',
            onPress: async () => {
              await closeIssue(authData.username, authData.token, repoName, issue.number);
              Alert.alert('Sucesso', 'Issue fechada com sucesso');
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fechar a issue');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{issue.title}</Text>
      <Text style={styles.body}>{issue.body}</Text>
      
      {issue.state === 'open' && (
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={handleCloseIssue}
        >
          <Text style={styles.closeButtonText}>Fechar Issue</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default IssueDetailsScreen;
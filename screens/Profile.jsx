import React, { useEffect, useState } from 'react';
import { TextInput, Button, Image, StyleSheet, View, Text, useWindowDimensions, SafeAreaView } from 'react-native';
import { useAuth } from '../context/index.jsx';
import { getUserProfile } from '../services/index.js';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const { authData } = useAuth();
  const { width, height } = useWindowDimensions();
  const isHorizontal = width > height;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile(authData.username, authData.token);
        setProfile(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, [authData]);

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isHorizontal ? styles.horizontalLayout : styles.verticalLayout]}>
      <Image source={{ uri: profile.avatar_url }} style={styles.icon} />
      <View style={styles.infoContainer}>
        <Text style={styles.userText}>{profile.name}</Text>
        <Text style={styles.reposText}>Repositórios: {profile.public_repos}</Text>
      </View>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Seguidores: {profile.followers}</Text>
        <Text style={styles.statsText}>Seguindo: {profile.following}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5', 
  },
  verticalLayout: {
    justifyContent: 'space-between', 
    paddingVertical: 40, 
  },
  horizontalLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  icon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  infoContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  userText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5, 
  },
  reposText: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 20, 
  },
  statsText: {
    fontSize: 16,
    color: '#555',
  },
  loadingText: {
    fontSize: 18,
    color: '#999',
  },
});

export default Profile;

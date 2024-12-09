import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useAuth } from "../context/index.jsx";
import { getRepositories } from "../services/index.js";
import { ProgressBar } from "../components/index.jsx";

const Repositories = () => {
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentScroll, setCurrentScroll] = useState(0);
  const [totalScroll, setTotalScroll] = useState(1);
  const { authData } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getRepositories(authData.username, authData.token, page);
        setRepos((prevRepos) => [...prevRepos, ...data]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authData, page]);

  const handleLoadMore = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const totalHeight = contentSize.height - layoutMeasurement.height;
    const currentOffset = contentOffset.y;
    setCurrentScroll(currentOffset);
    setTotalScroll(totalHeight);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={repos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.repo}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        onScroll={handleScroll}
      />
      <ProgressBar current={currentScroll} total={totalScroll} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f4f8",
  },
  repo: {
    padding: 20,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: "#007bff",
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#007bff",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
});

export default Repositories;
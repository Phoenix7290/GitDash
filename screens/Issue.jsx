import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useAuth } from "../context/index.jsx";
import { getIssues } from "../services/index.js";
import { ProgressBar } from "../components/index.jsx";

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentScroll, setCurrentScroll] = useState(0);
  const [totalScroll, setTotalScroll] = useState(1);
  const { authData } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getIssues(authData.username, authData.token, page);
        setIssues((prevIssues) => [...prevIssues, ...data]);
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
        data={issues}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.issue}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
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
    backgroundColor: "#f9f9f9",
  },
  issue: {
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  body: {
    fontSize: 14,
    color: "#555",
  },
});

export default Issues;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ModalSelector from "react-native-modal-selector";
import { useAuth } from "../context/index.jsx";
import { getIssues } from "../services/index.js";
import { ProgressBar } from "../components/index.jsx";
import { useSortAndFilterIssues } from "../hooks/useSortAndFilterIssues.jsx";
import { useNavigation } from "@react-navigation/native"; 

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentScroll, setCurrentScroll] = useState(0);
  const [totalScroll, setTotalScroll] = useState(1);
  const { authData } = useAuth();
  const navigation = useNavigation();

  const { sort, setSort, sortOptions, filter, setFilter, filterOptions } =
    useSortAndFilterIssues();

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

  const filteredAndSortedIssues = issues
    .filter((issue) => {
      if (filter === "open") return issue.state === "open";
      if (filter === "closed") return issue.state === "closed";
      return true;
    })
    .sort((a, b) => {
      if (sort === "created")
        return new Date(b.created_at) - new Date(a.created_at);
      if (sort === "updated")
        return new Date(b.updated_at) - new Date(a.updated_at);
      if (sort === "comments") return b.comments - a.comments;
      return 0;
    });

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Text style={styles.label}>Ordenar por:</Text>
        <ModalSelector
          data={sortOptions.map(({ key, label }) => ({ key, label }))}
          onChange={(option) => setSort(option.key)}
          initValue="Escolha uma opção"
          cancelText="Cancelar"
          style={styles.modalSelector}
          initValueTextStyle={styles.modalText}
          selectTextStyle={styles.modalText}
        />

        <Text style={styles.label}>Filtrar por:</Text>
        <ModalSelector
          data={filterOptions.map(({ key, label }) => ({ key, label }))}
          onChange={(option) => setFilter(option.key)}
          initValue="Escolha um filtro"
          cancelText="Cancelar"
          style={styles.modalSelector}
          initValueTextStyle={styles.modalText}
          selectTextStyle={styles.modalText}
        />
      </View>

      {filteredAndSortedIssues.length === 0 && !loading ? (
        <Text style={styles.noIssuesText}>Não há nenhuma issue</Text>
      ) : (
        <FlatList
          data={filteredAndSortedIssues}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.issue}
              onPress={() =>
                navigation.navigate("IssueDetails", { issue: item })
              }
            >
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
            </TouchableOpacity>
          )}
        />
      )}
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
  filterContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  modalSelector: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  modalText: {
    fontSize: 16,
    padding: 10,
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
  noIssuesText: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Issues;

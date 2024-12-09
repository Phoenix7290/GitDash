import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ModalSelector from "react-native-modal-selector";
import { useAuth } from "../context/index.jsx";
import { getRepositories } from "../services/index.js";
import { ProgressBar } from "../components/index.jsx";
import { useFilterAndSortRepositories } from "../hooks/useSortAndFilterRepositories.jsx";

const Repositories = () => {
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentScroll, setCurrentScroll] = useState(0);
  const [totalScroll, setTotalScroll] = useState(1);
  const { authData } = useAuth();
  const {
    sort,
    setSort,
    sortOptions,
    filter,
    setFilter,
    filterOptions,
    applyFilterAndSort,
  } = useFilterAndSortRepositories();

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

  const displayedRepos = applyFilterAndSort(repos);

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

      <FlatList
        data={displayedRepos}
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

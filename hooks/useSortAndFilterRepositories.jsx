import { useState } from "react";

const SORT_OPTIONS = [
  { key: "none", label: "Nenhum" },
  { key: "created", label: "Criação" },
  { key: "updated", label: "Atualização" },
  { key: "full_name", label: "Nome" },
];

const FILTER_OPTIONS = [
  { key: "none", label: "Nenhum" },
  { key: "public", label: "Público" },
];

export function useFilterAndSortRepositories() {
  const [sort, setSort] = useState("none");
  const [filter, setFilter] = useState("none");

  const applyFilterAndSort = (repositories) => {
    let filteredRepos = repositories;

    if (filter !== "none") {
      filteredRepos = repositories.filter((repo) =>
        filter === "public" ? !repo.private : true
      );
    }

    if (sort !== "none") {
      filteredRepos = [...filteredRepos].sort((a, b) => {
        if (sort === "created") {
          return new Date(a.created_at) - new Date(b.created_at);
        }
        if (sort === "updated") {
          return new Date(a.updated_at) - new Date(b.updated_at);
        }
        if (sort === "full_name") {
          return a.full_name.localeCompare(b.full_name);
        }
        return 0;
      });
    }

    return filteredRepos;
  };

  return {
    sort,
    setSort,
    sortOptions: SORT_OPTIONS,
    filter,
    setFilter,
    filterOptions: FILTER_OPTIONS,
    applyFilterAndSort,
  };
}

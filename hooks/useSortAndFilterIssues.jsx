import { useState } from "react";

const SORT_OPTIONS = [
  { key: "none", label: "Nenhum" },
  { key: "created", label: "Criação" },
  { key: "updated", label: "Atualização" },
  { key: "comments", label: "Comentários" },
];

const FILTER_OPTIONS = [
  { key: "none", label: "Nenhum" },
  { key: "open", label: "Aberto" },
  { key: "closed", label: "Fechado" },
];

export function useSortAndFilterIssues() {
  const [sort, setSort] = useState();
  const [filter, setFilter] = useState();

  return {
    sort,
    setSort,
    sortOptions: SORT_OPTIONS,
    filter,
    setFilter,
    filterOptions: FILTER_OPTIONS,
  };
}

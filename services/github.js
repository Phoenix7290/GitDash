import axios from "axios";

const api = axios.create({
  baseURL: "https://api.github.com/",
});

export const getRepositories = async (username, token, page = 1) => {
  const url = `https://api.github.com/users/${username}/repos?page=${page}&per_page=10`;

  const response = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `Failed to fetch repositories: ${response.status} ${response.statusText} - ${errorText}`
    );
    throw new Error("Failed to fetch repositories");
  }

  const data = await response.json();
  return data;
};

export const getIssues = async (username, token, page = 1) => {
  const repoName = "ReelCine";
  const url = `https://api.github.com/repos/${username}/${repoName}/issues?page=${page}&per_page=10`;

  const response = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `Failed to fetch issues: ${response.status} ${response.statusText} - ${errorText}`
    );
    throw new Error("Failed to fetch issues");
  }

  const data = await response.json();
  return data;
};

export const getUserProfile = async (username, token) => {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  const data = await response.json();
  return data;
};

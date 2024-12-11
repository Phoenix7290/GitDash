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
  try {
    const repositories = await getRepositories(username, token, page);
    
    const allIssues = await Promise.all(
      repositories.map(async (repo) => {
        const url = `https://api.github.com/repos/${username}/${repo.name}/issues?page=${page}&per_page=10`;
        const response = await fetch(url, {
          headers: {
            Authorization: `token ${token}`,
          },
        });
        
        if (!response.ok) {
          console.error(`Failed to fetch issues for ${repo.name}`);
          return [];
        }
        
        return await response.json();
      })
    );
    
    return allIssues.flat();
  } catch (error) {
    console.error("Error fetching issues:", error);
    throw error;
  }
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

export const closeIssue = async (username, token, repoName, issueNumber) => {
  const url = `https://api.github.com/repos/${username}/${repoName}/issues/${issueNumber}`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      state: 'closed'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `Failed to close issue: ${response.status} ${response.statusText} - ${errorText}`
    );
    throw new Error('Failed to close issue');
  }

  const data = await response.json();
  return data;
};
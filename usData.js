
// ===============================
// File: us/usData.js
// ===============================

export const tool = {
  type: "function",
  function: {
    name: "get_github_user_info",
    description: "Get GitHub user info by username",
    parameters: {
      type: "object",
      properties: {
        userName: { type: "string", description: "GitHub username" },
      },
      required: ["userName"],
    },
  },
};

export default async function getUsersInfo({ userName }) {
  try {
    const url = `https://api.github.com/users/${userName}`;
    const response = await fetch(url);
    const data = await response.json();
    return JSON.stringify({
      login: data.login,
      id: data.id,
      avatar_url: data.avatar_url,
      html_url: data.html_url,
      name: data.name,
      company: data.company,
      blog: data.blog,
      location: data.location,
      email: data.email,
      bio: data.bio,
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
      created_at: data.created_at,
      updated_at: data.updated_at,
    });
  } catch (err) {
    console.error("Error fetching GitHub user info:", err);
    return JSON.stringify({ error: "Failed to fetch user info" });
  }
}
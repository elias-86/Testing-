const searchBtn = document.getElementById("searchBtn");
const gitAccountName = document.getElementById("gitAccountName");

const profile = document.getElementById("profile");
const repoContainer = document.getElementById("repoContainer");

async function getGitHubData() {
  const username = gitAccountName.value.trim();

  if (!username) {
    alert("Nigga Enter A Godamn Name");
    return;
  }

  profile.innerHTML = "";
  repoContainer.innerHTML =
    '<div class="loading">Hold up, Wait a minute...</div>';

  try {
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`
    );

    if (!userResponse.ok) {
      throw new Error("Who tf is this nigga");
    }

    const user = await userResponse.json();

    const repoResponse = await fetch(
      `https://api.github.com/users/${username}/repos`
    );

    const repos = await repoResponse.json();

    displayUser(user);

    displayRepos(repos);

  } catch (error) {
    profile.style.display = "none";

    repoContainer.innerHTML = `
      <div class="error">
        ${error.message}
      </div>
    `;
  }
}

function displayUser(user) {
  profile.style.display = "block";

  profile.innerHTML = `
    <div class="profile-card">

      <img
        src="${user.avatar_url}"
        alt="${user.login}"
      >

      <div class="profile-info">

        <h2>${user.name || user.login}</h2>

        <p>${user.bio || "No bio available"}</p>

        <div class="stats">
          <span>Followers: ${user.followers}</span>
          <span>Following: ${user.following}</span>
          <span>Repos: ${user.public_repos}</span>
        </div>

      </div>

    </div>
  `;
}

function displayRepos(repos) {
  repoContainer.innerHTML = "";

  const sortedRepos = repos.sort(
    (a, b) => b.stargazers_count - a.stargazers_count
  );

  sortedRepos.forEach(repo => {
    repoContainer.innerHTML += `
      <div class="cards">

        <h3>${repo.name}</h3>

        <p>
          ${repo.description || "No description"}
        </p>

        <br>

        <p>
          ⭐ ${repo.stargazers_count}
        </p>

        <br>

        <a
          href="${repo.html_url}"
          target="_blank"
        >
          View Repository
        </a>

      </div>
    `;
  });
}

searchBtn.addEventListener(
  "click",
  getGitHubData
);

gitAccountName.addEventListener(
  "keypress",
  event => {
    if (event.key === "Enter") {
      getGitHubData();
    }
  }
);
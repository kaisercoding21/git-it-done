var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var getUserRepos = function (user) {
  // format the github api url
  var apiUrl = "https://api.github.com/users/" + user + "/repos";

  //   clear old content
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = "";

  // make a get request to url
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayRepos(data, user);
        });
      } else {
        alert("Error: GitHub User Not Found");
      }
      console.log(response);
    })
    .catch(function (error) {
      alert("Unable to connect to GitHub");
    });
};

var formSubmetHandler = function (event) {
  event.preventDefault();
  var username = nameInputEl.value.trim();

  if (username) {
    getUserRepos(username);
    nameInputEl.value = "";
  } else {
    alert("Please enter a valid GitHub username");
  }
};

var displayRepos = function (repos, searchTerm) {
  // check if api returned any repos
  if (repos.length === 0) {
    repoContainerEl.textContent = "No Repositories found.";
    return;
  }

  //   loop over repos
  for (i = 0; i < repos.length; i++) {
    // thiswill format the repo name
    var repoName = repos[i].owner.login + "/" + repos[i].name;

    // create a container for each repo
    var repoEl = document.createElement("div");
    repoEl.classList = "list-item flex-row justify-space-between align-center";

    // create span to hold the repo name
    var titleEL = document.createElement("span");
    titleEL.textContent = repoName;

    // append to container
    repoEl.appendChild(titleEL);

    // create a status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    // check if current repo has isues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" +
        repos[i].open_issues_count +
        " issue(s)";
    } else {
      statusEl.innerHTML =
        "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // append to container
    repoEl.appendChild(statusEl);

    // append element to the DOM
    repoContainerEl.appendChild(repoEl);
  }
};

userFormEl.addEventListener("submit", formSubmetHandler);

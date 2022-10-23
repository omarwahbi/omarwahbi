let popularMoviesUrl =
  "https://yts.mx/api/v2/movie_suggestions.json?movie_id=10";
let upcomingMoviesUrl =
  "https://yts.mx/api/v2/movie_suggestions.json?movie_id=1";
let latestMoviesUrl = "https://yts.mx/api/v2/list_movies.json?quality=3D";

const fetchPopularMovies = async (url) => {
  let popularMovies = await fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      return response.data;
    });
  return popularMovies;
};

const renderMovies = (movies, location) => {
  const markup = `
    <div class="movies mov${movies.slug}movies">
      <div class="movie-continer">
        <a href="./movieView.html">
          <img src="${movies.medium_cover_image}"/>
          <div class="hidden-details">
            <img src="./assets/star.png"/>
            <span class="rating">${movies.rating} / 10</span>
            <span>${movies.genres[0]}</span>
            <span>${movies.genres[1]}</span>
            <button class="view-details">View Details</button>
          </div>
        </a>
      </div>
      <div class="movie-details">
        <a href="./movieView.html">
          <span>${textTruncate(movies.title, 30)}</span>
        </a>
        <div class="release-date">
          <span>${movies.year}</span>
        </div>
      </div>
    </div>
      `;
  document.querySelector(location).insertAdjacentHTML("afterbegin", markup);

  const container = document.querySelector(`.mov${movies.slug}movies`);
  const button = document.querySelector(
    `.mov${movies.slug}movies .view-details`
  );
  container.addEventListener("mouseenter", () => {
    button.className = button.className + " visible";
  });
  container.addEventListener("mouseleave", () => {
    button.className = button.className.replace("visible", " ");
  });
};

textTruncate = function (str, length, ending) {
  if (length == null) {
    length = 100;
  }
  if (ending == null) {
    ending = "...";
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
};
preparePopularMovies = async () => {
  let { movies } = await fetchPopularMovies(popularMoviesUrl);
  return movies.forEach((element) => {
    renderMovies(element, ".movies-wrapper");
  });
};
prepareLatestMovies = async () => {
  let { movies } = await fetchPopularMovies(latestMoviesUrl);
  return movies.forEach((element) => {
    renderMovies(element, ".latest-movies-wrapper");
  });
};
prepareUpcomingMovies = async () => {
  let { movies } = await fetchPopularMovies(upcomingMoviesUrl);
  return movies.forEach((element) => {
    renderMovies(element, ".upcoming-movies-wrapper");
  });
};

window.addEventListener("load", () => {
  preparePopularMovies();
  prepareLatestMovies();
  prepareUpcomingMovies();
});

function search(query) {
  return fetch(`https://yts.mx/ajax/search?query=${query}`)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      //console.log(response);
      return response.data;
    });
}

function getInputData() {
  return document.getElementById("search").value;
}
async function loadData() {
  let inputData = getInputData();
  if (inputData.length >= 3) {
    let result = await search(inputData);
    document.querySelector(".search-list").textContent = "";
    console.log(result);
    result.forEach((el) => {
      renderSearchList(el);
    });
  }
}
document.getElementById("search").addEventListener("input", loadData);
function renderSearchList(result) {
  let searchListMarkup = `
  <li class="search-item-wrapper">
    <a class="search-item" href="#">
      <img class="search-item-img" src='${result.img}'>
      <div class="search-item-details">
        <span class="search-item-name">${result.title}</span>
        <span class="search-item-year">${result.year}</span>
      </div>
    </a>
  </li>
`;

  document
    .querySelector(".search-list")
    .insertAdjacentHTML("afterbegin", searchListMarkup);
}
document.addEventListener("click", () => {
  document.querySelector(".search-list").textContent = "";
});
document.getElementById("search").addEventListener("focus", loadData);

//Movie view js code

let modalElm = document.querySelector(".modal");
let modalImg = document.querySelector(".modal-img");
let closeBtn = document.querySelector(".close-modal");
let videoTrailer = document.querySelector(".modal-movie-trailer");
let screenshotArray = Array.from(document.querySelectorAll(".screenshot"));
let screenshotIndex;
screenshotArray.forEach((item) => {
  item.addEventListener("click", (event) => {
    if (event.target.id == "trailer-screenshot") {
      modalElm.style.display = "flex";
      videoTrailer.style.display = "flex";
      videoTrailer.insertAdjacentHTML(
        "afterbegin",
        `<iframe width="1171" height="624" src="https://www.youtube.com/embed/t433PEQGErc" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
        );
        console.log(screenshotArray.indexOf(item));
        return screenshotIndex = screenshotArray.indexOf(item);
    } else {
      modalElm.style.display = "flex";
      modalImg.src = event.target.src;
      modalImg.style.display = "flex";
      console.log(screenshotArray.indexOf(item));
      return screenshotIndex = screenshotArray.indexOf(item);
    }
  });
});
closeBtn.addEventListener("click", () => {
  modalElm.style.display = "none";
  modalImg.style.display = "none";
  videoTrailer.textContent = "";
  videoTrailer.style.display = "none";
});

document.querySelector(".right-button").addEventListener("click", ()=>{
  if(screenshotIndex < (screenshotArray.length -1) ){
    if (screenshotArray[screenshotIndex].id == "trailer-screenshot") {
      videoTrailer.style.display = "none";
      videoTrailer.textContent = "";
      modalImg.src = screenshotArray[screenshotIndex+1].src;
      modalImg.style.display = "flex";
      //return screenshotIndex = screenshotArray.indexOf(item);
      return screenshotIndex++
    } else {
      modalImg.src = screenshotArray[screenshotIndex+1].src;
      return screenshotIndex++
    }
  }
});
document.querySelector(".left-button").addEventListener("click", ()=>{

  if(screenshotIndex >= 0 ){
    if (screenshotArray[screenshotIndex].id == "trailer-screenshot") {
      videoTrailer.style.display = "none";
      videoTrailer.textContent = "";
      modalImg.src = screenshotArray[screenshotIndex-1].src;
      modalImg.style.display = "flex";
      //return screenshotIndex = screenshotArray.indexOf(item);
      return screenshotIndex--
    } else {
      modalImg.src = screenshotArray[screenshotIndex-1].src;
      return screenshotIndex--
    }
  }
})
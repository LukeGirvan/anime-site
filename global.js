"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Global {
    constructor() {
        this.resultClicked = false;
        this.resultsDisplayed = false;
        this.carousels = document.querySelectorAll('.carousel');
        this.initializeCarousels();
        this.images = [];
        this.queryTimer = null;
        this.queryData = [];
        this.lastQuery = '';
        this.releases = {
            latest: []
        };
        this.banners = [];
        this.timer = null;
        this.animeData = {};
    }
    // script.ts
    initializeCarousels() {
        console.log(this.carousels);
        this.carousels.forEach((carousel) => {
            var _a, _b, _c, _d;
            const nextButton = (_a = carousel.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('.carousel-next');
            const prevButton = (_b = carousel.parentElement) === null || _b === void 0 ? void 0 : _b.querySelector('.carousel-prev');
            const nextSpan = (_c = carousel.parentElement) === null || _c === void 0 ? void 0 : _c.querySelector('.carousel-next-span');
            const prevSpan = (_d = carousel.parentElement) === null || _d === void 0 ? void 0 : _d.querySelector('.carousel-prev-span');
            let latestIsScrolling = false;
            let latestScrollBy = 0;
            let limit = 0;
            let isDown = false;
            let startX, scrollLeft;
            const isOffScreen = (element, containerWidth) => {
                return element.getBoundingClientRect().left <= 0 ||
                    element.getBoundingClientRect().right >= containerWidth ||
                    element.getBoundingClientRect().left >= containerWidth;
            };
            const scrollCarousel = (e) => {
                if (latestIsScrolling)
                    return;
                latestIsScrolling = true;
                const target = e.target;
                const nextArr = [nextButton, nextSpan];
                const prevArr = [prevButton, prevSpan];
                const prevButtonDisplay = getComputedStyle(prevButton).display;
                const nextButtonDisplay = getComputedStyle(nextButton).display;
                if (nextArr.includes(target) && prevButtonDisplay === 'none') {
                    prevButton.style.display = 'inline';
                    prevSpan.style.display = 'inline';
                }
                if (prevArr.includes(target) && nextButtonDisplay === 'none') {
                    nextButton.style.display = 'inline';
                    nextSpan.style.display = 'inline';
                }
                const isPrev = prevArr.includes(target);
                const imageWidth = carousel.querySelector('.image-holder').clientWidth;
                const allImages = carousel.querySelectorAll('.image-holder');
                const imagesOnScreen = carousel.querySelectorAll('.image-holder:not(.off-screen-blur)').length;
                const gap = 32 * imagesOnScreen;
                const calc = (imageWidth * imagesOnScreen) + gap;
                const transformValue = isPrev ? -calc : calc;
                if (limit === 0) {
                    limit = (allImages[allImages.length - 1].getBoundingClientRect().right + 32) - carousel.clientWidth;
                }
                latestScrollBy = isPrev
                    ? Math.max(0, latestScrollBy + transformValue)
                    : Math.min(latestScrollBy + transformValue, limit);
                carousel.style.transform = `translateX(-${latestScrollBy}px)`;
                setTimeout(() => {
                    allImages.forEach(image => {
                        if (isOffScreen(image, carousel.clientWidth)) {
                            image.classList.add('off-screen-blur');
                        }
                        else if (image.classList.contains('off-screen-blur')) {
                            image.classList.remove('off-screen-blur');
                        }
                    });
                    if (!isOffScreen(allImages[0], carousel.clientWidth)) {
                        prevButton.style.display = 'none';
                        prevSpan.style.display = 'none';
                    }
                    if (!isOffScreen(allImages[allImages.length - 1], carousel.clientWidth)) {
                        nextButton.style.display = 'none';
                        nextSpan.style.display = 'none';
                    }
                    latestIsScrolling = false;
                }, 500);
            };
            const touchStart = (e) => {
                isDown = true;
                startX = e.touches[0].pageX - carousel.offsetLeft;
                scrollLeft = carousel.scrollLeft;
            };
            const touchMove = (e) => {
                if (!isDown)
                    return;
                e.preventDefault();
                const x = e.touches[0].pageX - carousel.offsetLeft;
                const walk = (x - startX) * 1; // Adjust the multiplier for faster/slower scroll
                carousel.scrollLeft = scrollLeft - walk;
            };
            const touchEnd = () => {
                isDown = false;
            };
            nextButton.addEventListener('click', scrollCarousel);
            prevButton.addEventListener('click', scrollCarousel);
            nextSpan.addEventListener('click', scrollCarousel);
            prevSpan.addEventListener('click', scrollCarousel);
            carousel.addEventListener('touchstart', touchStart);
            carousel.addEventListener('touchmove', touchMove);
            carousel.addEventListener('touchend', touchEnd);
            carousel.addEventListener('touchcancel', touchEnd);
        });
    }
    getGenres() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
    query{
      GenreCollection
    }
    `;
            const url = 'https://graphql.anilist.co';
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query
                })
            };
            const response = yield fetch(url, options);
            const data = yield response.json();
            console.log(data.data);
            // window.sessionStorage.setItem('genres', JSON.stringify(data.data.GenreCollection))
            return data.data.GenreCollection;
            // return data.data.Page.media
        });
    }
    genreClick(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const genre = JSON.stringify(e.target.textContent);
            globalScript.clearGridStorage();
            window.sessionStorage.setItem('grid-genre', genre);
            window.location.href = 'grid.html';
        });
    }
    resultClick(e) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (e.target && e.target.classList[0] !== 'result' && ((_a = e.target.parentElement) === null || _a === void 0 ? void 0 : _a.classList[0]) !== 'result')
                return;
            globalScript.resultClicked = true;
            console.log(globalScript.resultClicked);
            const target = e.target;
            let index;
            if (target && target.classList[0] === 'result') {
                index = target.dataset.index;
            }
            if (target && ((_b = target.parentElement) === null || _b === void 0 ? void 0 : _b.classList[0]) === 'result') {
                index = (_c = target.parentElement) === null || _c === void 0 ? void 0 : _c.dataset.index;
            }
            yield globalScript.fetchById(Number(index));
        });
    }
    makeSearchBarBig(e) {
        const searchButton = e.target;
        console.log(searchButton);
        const input = document.querySelector('.search-input');
        searchButton.classList.remove('visible');
        searchButton.classList.add('hidden');
        input.classList.remove('hidden');
        input.classList.add('visible');
        input.style.marginLeft = '0rem';
        input.style.width = '400px';
    }
    makeSearchBarSmall(e) {
        const target = e.target;
        console.log(target.classList[0] !== 'search-input' && target.classList[0] !== 'result' && !globalScript.resultsDisplayed && input.classList.contains('visible'));
        console.log(target.classList[0] !== 'search-input' && target.classList[0] !== 'result' && globalScript.resultsDisplayed);
        const searchButton = document.querySelector('.fas.fa-search');
        if (target.classList[0] !== 'search-input' && target.classList[0] !== 'fas'
            && target.classList[0] !== 'result' && !globalScript.resultsDisplayed && input.classList.contains('visible')) {
            const searchResultDiv = document.querySelector('.search-results');
            const input = document.querySelector('.search-input');
            searchResultDiv.classList.remove('active');
            while (searchResultDiv.firstChild) {
                searchResultDiv.removeChild(searchResultDiv.firstChild);
            }
            console.log(e);
            input.classList.remove('visible');
            input.classList.add('hidden');
            searchButton.classList.remove('hidden');
            searchButton.classList.add('visible');
            globalScript.resultsDisplayed = false;
            // globalScript.resultClicked =false
        }
        if (target.classList[0] !== 'search-input' && target.classList[0] !== 'result' && globalScript.resultsDisplayed) {
            const searchResultDiv = document.querySelector('.search-results');
            const input = document.querySelector('.search-input');
            searchResultDiv.classList.remove('active');
            while (searchResultDiv.firstChild) {
                searchResultDiv.removeChild(searchResultDiv.firstChild);
            }
            console.log(e);
            input.classList.remove('visible');
            input.classList.add('hidden');
            searchButton.classList.remove('hidden');
            searchButton.classList.add('visible');
            globalScript.resultsDisplayed = false;
            // globalScript.resultClicked =false
        }
        if (target.classList[0] === 'search-input' || target.classList[0] === 'result' && globalScript.resultsDisplayed) {
            return;
        }
    }
    getSearchResults(e) {
        const query = e.target.value;
        const searchResultDiv = document.querySelector('.search-results');
        if (query === this.lastQuery)
            return;
        if (searchResultDiv.childElementCount !== 0) {
            searchResultDiv.classList.remove('active');
            while (searchResultDiv.firstChild) {
                searchResultDiv.removeChild(searchResultDiv.firstChild);
            }
        }
        clearTimeout(globalScript.queryTimer); // Clear the previous timer
        // Start a new timer to detect when typing stops
        globalScript.queryTimer = setTimeout(() => {
            // Code to execute when typing stops
            globalScript.queryAfterStopTyping(query);
        }, 1000);
        console.log(globalScript.queryTimer);
        this.lastQuery = query;
    }
    cleanString(inputString) {
        // Replace all spaces with hyphens
        let cleanedString = inputString.replace(/\s+/g, '-');
        // Remove all special characters except hyphens
        cleanedString = cleanedString.replace(/[^\w-]/g, '-');
        return cleanedString.toLowerCase();
    }
    queryAnilist(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const x = `
      query ($searchTerm: String) {
        Page(page: 1, perPage: 10) {
          media(search: $searchTerm, type: ANIME) {
            id
            idMal
            title {
              romaji
              english
            }
            coverImage {
              extraLarge
            }
            bannerImage
            averageScore
            description
            episodes
            type
            status
            recommendations {
              edges {
                node {
                  id
                  mediaRecommendation {
                    id
                    title {
                      romaji
                      english
                    }
                    coverImage {
                      extraLarge
                      large
                    }
                    averageScore
                    description
                    type
                    status
                    studios {
                      edges {
                        node {
                          id
                          name
                        }
                      }
                    }
                    genres
                  }
                }
              }
            }
          }
        }
      }      
      `;
            const url = 'https://graphql.anilist.co';
            const variables = {
                searchTerm: query
            };
            console.log(variables);
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: x,
                    variables: variables
                })
            };
            const response = yield fetch(url, options);
            const data = yield response.json();
            console.log(data.data.Page.media);
            return data.data.Page.media;
        });
    }
    queryAfterStopTyping(query) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(query);
            const data = yield globalScript.queryAnilist(query);
            globalScript.queryData = data;
            globalScript.displaySearchResults();
        });
    }
    clearSearchResults() {
        const searchResultDiv = document.querySelector('.search-results');
        if (searchResultDiv.childElementCount !== 0) {
            searchResultDiv.classList.remove('active');
            while (searchResultDiv.firstChild) {
                searchResultDiv.removeChild(searchResultDiv.firstChild);
            }
        }
    }
    displaySearchResults() {
        const searchResultDiv = document.querySelector('.search-results');
        globalScript.resultsDisplayed = true;
        for (let i = 0; i < globalScript.queryData.length; ++i) {
            const resultDiv = document.createElement('div');
            const data = this.queryData[i];
            const image = document.createElement('img');
            const imageSrc = data.coverImage.extraLarge ? data.coverImage.extraLarge : data.coverImage.large;
            const title = data.title.english ? data.title.english : data.title.romaji;
            const titleToadd = document.createElement('div');
            const detailsDiv = document.createElement('div');
            image.src = imageSrc;
            titleToadd.textContent = title;
            resultDiv.classList.add('result');
            resultDiv.appendChild(image);
            resultDiv.appendChild(titleToadd);
            resultDiv.dataset.index = `${i}`;
            searchResultDiv.appendChild(resultDiv);
            console.log(imageSrc);
            console.log(title);
        }
        searchResultDiv.classList.add('active');
    }
    toggleMobileMenu(e) {
        const target = e.target;
        const navHolder = document.querySelector('.nav-button-holder');
        if (target.classList.contains('mobile-nav-toggle') && !target.classList.contains('toggled')) {
            target.classList.add('toggled');
            navHolder.classList.add('toggled');
        }
        else {
            target.classList.remove('toggled');
            navHolder.classList.remove('toggled');
        }
    }
    fetchById(index) {
        return __awaiter(this, void 0, void 0, function* () {
            const animeData = JSON.stringify(globalScript.queryData[index]);
            if (window.sessionStorage.getItem('anime-episode')) {
                window.sessionStorage.removeItem('anime-episode');
            }
            if (window.sessionStorage.getItem('anime-data')) {
                window.sessionStorage.removeItem('anime-data');
            }
            if (window.sessionStorage.getItem('fetch-this')) {
                window.sessionStorage.removeItem('fetch-this');
            }
            if (window.sessionStorage.getItem('episode-data')) {
                window.sessionStorage.removeItem('episode-data');
            }
            window.sessionStorage.setItem('anime-data', animeData);
            const url = 'anime-details.html';
            window.location.href = url;
            // try {
            //     const response = await fetch(`http://localhost:3000/meta/anilist/info/${id}?provider=gogoanime`, {
            //         headers: {
            //             Accept: 'application/json',
            //             'Content-Type': 'application/json'
            //         }
            //     });
            //     const data = await response.json();
            //     const episodeData = {totalEpisodes:data.episodes.length ,episodes:data.episodes}
            //     window.sessionStorage.setItem(`episode-data`, JSON.stringify(episodeData))
            //     const episode = data.episodes[0].id;
            //     const stringified = JSON.stringify(episode)
            //     const name = episode.substring(0,  episode.length-10)
            //     const x = JSON.stringify(globalScript.queryData[index]);
            //     console.log(episode);
            //     window.sessionStorage.setItem('name', name)
            //     window.sessionStorage.setItem('fetch-this',stringified)
            //     const lastWatched = JSON.parse(window.sessionStorage.getItem('last-watched') as string);
            //     window.sessionStorage.setItem('anime-data', x);
            //     const url = 'anime-details.html';
            //     window.location.href = url;
            // } catch (error) {
            //     console.error('Error:', error);
            //     // Handle errors here
            // }
        });
    }
    navBarListener(e) {
        const target = e.target;
        const actionKey = target.classList[0];
        const actions = {
            'home-button': () => {
                globalScript.clearGridStorage();
                globalScript.goHome();
            },
            'popular-button': () => {
                const sortOption = JSON.stringify('popular');
                globalScript.clearGridStorage();
                window.sessionStorage.setItem('sort-by', sortOption);
                window.location.href = 'grid.html';
            },
            'genre-button': () => {
                const genreDropdown = document.querySelector('.genres-holder');
                genreDropdown.classList.toggle('show');
                // lobalScript.displayGenres()g
            },
            'latest-button': () => {
                const sortOption = JSON.stringify('trending');
                globalScript.clearGridStorage();
                window.sessionStorage.setItem('sort-by', sortOption);
                window.location.href = 'grid.html';
            }
        };
        const executeAction = (actionKey) => {
            if (actions[actionKey]) {
                actions[actionKey]();
            }
            else {
                // console.log(`No action found for key: ${actionKey}`);
            }
        };
        executeAction(actionKey);
    }
    addGenres() {
        return __awaiter(this, void 0, void 0, function* () {
            let genres = JSON.parse(window.sessionStorage.getItem('genres'));
            if (!genres) {
                genres = yield globalScript.getGenres();
            }
            console.log(genres);
            const genreDropdown = document.querySelector('.genres-holder > .genres');
            const nsfwGenre = ['Hentai'];
            const filteredGenres = genres.filter((genre) => genre !== 'hentai');
            for (let i = 0; i < 15; i++) {
                const genre = filteredGenres[i];
                const genreAnchor = document.createElement('a');
                genreAnchor.textContent = genre;
                genreDropdown.appendChild(genreAnchor);
            }
        });
    }
    clearGridStorage() {
        const genre = JSON.parse(window.sessionStorage.getItem('grid-genre'));
        const sortBy = JSON.parse(window.sessionStorage.getItem('sort-by'));
        for (let i = 1; i < 11; i++) {
            if (window.sessionStorage.getItem(`page-${i}-data-${genre}`)) {
                window.sessionStorage.removeItem(`page-${i}-data-${genre}`);
            }
            if (window.sessionStorage.getItem(`page-${i}-data-${sortBy}`)) {
                window.sessionStorage.removeItem(`page-${i}-data-${sortBy}`);
            }
        }
        if (window.sessionStorage.getItem('grid-genre')) {
            window.sessionStorage.removeItem('grid-genre');
        }
        if (window.sessionStorage.getItem('grid-query')) {
            window.sessionStorage.removeItem('grid-query');
        }
        if (window.sessionStorage.getItem('page-num')) {
            window.sessionStorage.removeItem('page-num');
        }
    }
    goHome() {
        globalScript.clearGridStorage();
        window.location.href = 'http://127.0.0.1:5500/index.html';
    }
}
const globalScript = new Global();
const mobileNavbutton = document.querySelector('.mobile-nav-toggle');
const searchButton = document.querySelector(".fas.fa-search");
const input = document.querySelector('.search-input');
const h1 = document.querySelector('.zanime');
const navBar = document.querySelector('.nav-bar');
const searchResultDiv = document.querySelector('.search-results');
const genreDropdown = document.querySelector('.genres-holder > .genres');
genreDropdown.addEventListener('click', globalScript.genreClick);
// const genreButton = document.querySelector('.genre-button') as HTMLSpanElement
// genreButton.addEventListener('mouse')
globalScript.getGenres();
h1.addEventListener('click', globalScript.goHome);
searchButton.addEventListener('click', globalScript.makeSearchBarBig);
document.addEventListener('click', globalScript.makeSearchBarSmall);
input.addEventListener('input', globalScript.getSearchResults);
mobileNavbutton.addEventListener('click', globalScript.toggleMobileMenu);
searchResultDiv.addEventListener('click', globalScript.resultClick);
navBar.addEventListener('click', globalScript.navBarListener);
globalScript.initializeCarousels();
globalScript.addGenres();

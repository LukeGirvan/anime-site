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
    makeSearchBarBig(e) {
        const input = e.target;
        input.style.marginLeft = '0rem';
        input.style.width = '400px';
    }
    makeSearchBarSmall(e) {
        const input = e.target;
        const searchResultDiv = document.querySelector('.search-results');
        searchResultDiv.classList.remove('active');
        while (searchResultDiv.firstChild) {
            searchResultDiv.removeChild(searchResultDiv.firstChild);
        }
        console.log(e);
        input.style.width = '220px';
    }
    displaySearchResults(e) {
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
    queryAfterStopTyping(query) {
        return __awaiter(this, void 0, void 0, function* () {
            // fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=5&order_by=rank&sort=asc`)
            // .then(response => response.json())
            // .then(results => {
            //     this.queryData = results.data
            // const searchResultDiv = document.querySelector('.search-results') as HTMLDivElement
            // for(let i =0;i<this.queryData.length;++i){
            //     const resultDiv = document.createElement('div')
            //     const data  = this.queryData[i] 
            //     const image = document.createElement('img')
            //     const imageSrc = data.images.webp.large_image_url
            //     const title = data.title
            //     const titleToadd = document.createElement('div')
            //     image.src = imageSrc
            //     titleToadd.textContent = title
            //     resultDiv.classList.add('result')
            //     resultDiv.appendChild(image)
            //     resultDiv.appendChild(titleToadd)
            //     searchResultDiv.appendChild(resultDiv)
            // }
            // searchResultDiv.classList.add('active')
            // })
            console.log(query);
            const x = `
        query ($searchTerm:String){
          Page(page: 1, perPage: 10) {
            media( search:$searchTerm , type: ANIME) {
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
            console.log(options);
            const data = yield fetch(url, options);
            const response = yield data.json();
            this.queryData = response.data.Page.media;
            console.log(response.data.Page.media);
            const searchResultDiv = document.querySelector('.search-results');
            if (searchResultDiv.childElementCount !== 0) {
                searchResultDiv.classList.remove('active');
                while (searchResultDiv.firstChild) {
                    searchResultDiv.removeChild(searchResultDiv.firstChild);
                }
            }
            for (let i = 0; i < this.queryData.length; ++i) {
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
        });
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
    resultClick(e) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (e.target && e.target.classList[0] !== 'result' && ((_a = e.target.parentElement) === null || _a === void 0 ? void 0 : _a.classList[0]) !== 'result')
                return;
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
    goHome() {
        window.location.href = 'http://127.0.0.1:5500/index.html';
    }
}
const globalScript = new Global();
const mobileNavbutton = document.querySelector('.mobile-nav-toggle');
const input = document.querySelector('.search-input');
const h1 = document.querySelector('.zanime');
h1.addEventListener('click', globalScript.goHome);
input.addEventListener('focus', globalScript.makeSearchBarBig);
// input.addEventListener('blur', globalScript.makeSearchBarSmall)
input.addEventListener('input', globalScript.displaySearchResults);
mobileNavbutton.addEventListener('click', globalScript.toggleMobileMenu);
document.addEventListener('click', globalScript.resultClick);

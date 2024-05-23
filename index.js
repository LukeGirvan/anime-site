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
class HomePage {
    constructor() {
        this.randomIndex = null;
        this.start = 0;
        this.index = 0;
        this.images = [];
        this.queryTimer = null;
        this.queryData = [];
        this.lastQuery = '';
        this.releases = {
            latest: []
        };
        this.popular = [];
        this.timer = null;
        this.animeData = {};
    }
    fetchById(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const target = e.target;
            console.log(target.id);
            const index = e.target.id;
            if (window.sessionStorage.getItem('anime-episode')) {
                window.sessionStorage.removeItem('anime-episode');
            }
            if (window.sessionStorage.getItem('anime-data')) {
                window.sessionStorage.removeItem('anime-data');
            }
            if (window.sessionStorage.getItem('anify-data')) {
                window.sessionStorage.removeItem('anify-data');
            }
            if (window.sessionStorage.getItem('fetch-this')) {
                window.sessionStorage.removeItem('fetch-this');
            }
            if (window.sessionStorage.getItem('episode-data')) {
                window.sessionStorage.removeItem('episode-data');
            }
            const animeDetails = JSON.stringify(homePage.popular[Number(index)]);
            window.sessionStorage.setItem('anime-data', animeDetails);
            const url = 'anime-details.html';
            window.location.href = url;
            // const arr = JSON.parse(window.sessionStorage.getItem('recommended') as string)
            // const id =arr[index].id;
            // try {
            //     const response = await fetch(`http://localhost:3000/meta/anilist/info/${id}?provider=gogoanime`, {
            //         headers: {
            //             Accept: 'application/json',
            //             'Content-Type': 'application/json'
            //         }
            //     });
            //     const data = await response.json();
            //     const episodeData = {totalEpisodes:data.episodes.length ,episodes:data.episodes}
            //     window.sessionStorage.setItem(`episode-data`, JSON.stringify(data))
            //     const episode = data.episodes[0].id;
            //     const stringified = JSON.stringify(episode)
            //     const name = episode.substring(0,  episode.length-10)
            //     const x = JSON.stringify(arr[index]);
            //     console.log(episode);
            //     window.sessionStorage.setItem('name', name)
            //     window.sessionStorage.setItem('fetch-this',stringified)
            //     const lastWatched = JSON.parse(window.sessionStorage.getItem('last-watched') as string);
            //     window.sessionStorage.setItem('anime-data', x);
            // const url = 'anime-details.html';
            // window.location.href = url;
            // } catch (error) {
            //     console.error('Error:', error);
            // }
        });
    }
    fetchPopular() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        query {
          Page(page: 1, perPage: 25) {
            media(sort: POPULARITY_DESC, type: ANIME) {
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
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query })
            };
            const response = yield fetch(url, options);
            return response.json();
        });
    }
    getPopular() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const divForBg = document.querySelector('.slide');
            const details = divForBg.querySelector('.details');
            const spinner = document.querySelector('.spinner');
            details.style.visibility = 'hidden';
            const cachedData = window.sessionStorage.getItem('recommended');
            let response;
            if (cachedData) {
                response = JSON.parse(cachedData);
            }
            else {
                response = yield this.fetchPopular();
                window.sessionStorage.setItem('recommended', JSON.stringify(response));
            }
            this.popular = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.Page.media) || response;
            const titleDiv = document.querySelector('.slide > .details > .recommended-title');
            const ratingDiv = document.querySelector('.slide > .details > .rating');
            const description = document.querySelector('.slide > .details > .description');
            const watchButton = document.querySelector('.slide > .details > .btn');
            const randomIndex = Math.floor(Math.random() * this.popular.length);
            const selectedAnime = this.popular[randomIndex];
            const titleString = selectedAnime.title.english;
            const ratingText = (selectedAnime.averageScore / 10).toString();
            const descriptionText = selectedAnime.description.length < 400
                ? selectedAnime.description
                : `${selectedAnime.description.substring(0, 400)}...`;
            const bannerImage = selectedAnime.bannerImage;
            const fragment = document.createDocumentFragment();
            const space = document.createTextNode('\u00A0\u00A0');
            const sub = document.createTextNode(' SUB ');
            const tv = document.createTextNode('TV ');
            const starIcon = document.createElement('i');
            const playButton = document.createElement('i');
            const captionIcon = document.createElement('i');
            captionIcon.className = "fa-solid fa-closed-captioning";
            playButton.className = "fa-solid fa-play";
            starIcon.className = 'fa-solid fa-star';
            ratingDiv.appendChild(starIcon);
            ratingDiv.appendChild(document.createTextNode(ratingText));
            ratingDiv.appendChild(space.cloneNode());
            ratingDiv.appendChild(playButton);
            ratingDiv.appendChild(tv);
            ratingDiv.appendChild(space.cloneNode());
            ratingDiv.appendChild(captionIcon);
            ratingDiv.appendChild(sub);
            divForBg.style.background = `url(${bannerImage}) no-repeat center center / cover`;
            titleDiv.textContent = titleString;
            description.innerHTML = descriptionText;
            watchButton.id = `${randomIndex}`;
            watchButton.addEventListener('click', this.fetchById);
            details.style.visibility = '';
            spinner.style.display = 'none';
            this.popularFill();
        });
    }
    fetchLatest() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      query GetMedia($id: Int, $page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
          }
          media(sort: TRENDING_DESC, id: $id, type: ANIME) {
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
            nextAiringEpisode {
              airingAt
              timeUntilAiring
              episode
            }
            startDate {
              year
              month
              day
            }
            
          }
         
        }
      }
    `;
            // Define the variables for the query
            const variables = {
                page: 1,
                perPage: 25
            };
            // Define the GraphQL endpoint
            const url = 'https://graphql.anilist.co';
            // Define the options for the fetch request
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query, variables })
            };
            const start = performance.now();
            const response = yield fetch(url, options);
            console.log(response);
            const data = yield response.json();
            const end = performance.now();
            console.log(end - start);
            return data;
            // const response= await  fetch('http://localhost:3000/anime/gogoanime/top-airing')
            // return response.json()
        });
    }
    populateCards() {
        return __awaiter(this, void 0, void 0, function* () {
            const cardholder = document.querySelector('.latest-card-holder');
            const spinner = document.querySelector('.latest-card-holder > .spinner');
            const data = JSON.parse(window.sessionStorage.getItem('latest')) ?
                JSON.parse(window.sessionStorage.getItem('latest')) : yield homePage.fetchLatest();
            const media = data.data !== undefined ? data.data.Page.media.filter((item) => item.idMal !== null) : data.filter((item) => item.idMal !== null);
            if (!window.sessionStorage.getItem('latest')) {
                window.sessionStorage.setItem('latest', JSON.stringify(media));
            }
            homePage.releases.latest = media;
            if (media) {
                spinner.style.display = 'none';
            }
            for (let i = 0; i < media.length; ++i) {
                if (media[i].mal === null)
                    continue;
                const div = document.createElement('div');
                const div2 = document.createElement('div');
                const animeImage = document.createElement('img');
                const title = document.createElement('p');
                const blur = document.createElement('div');
                const playButton = document.createElement('img');
                const link = document.createElement('a');
                div.id = `${i}`;
                link.id = `${i}`;
                link.classList.add('anime-link');
                playButton.src = './images/play-button-icon-white-8.png';
                link.appendChild(playButton);
                animeImage.classList.add('anime-image');
                blur.classList.add('hover-blur');
                blur.id = `${i}`;
                title.textContent = media[i].title.english ?
                    media[i].title.english :
                    media[i].title.romaji;
                div.classList.add('image-holder');
                div2.classList.add('p-holder');
                playButton.classList.add('play-button');
                playButton.id = `${i}`;
                blur.appendChild(link);
                blur.appendChild(title);
                animeImage.src = media[i].coverImage.extraLarge ?
                    media[i].coverImage.extraLarge :
                    media[i].coverImage.large;
                div.appendChild(animeImage);
                div2.appendChild(title);
                div.appendChild(div2);
                div.appendChild(blur);
                cardholder.appendChild(div);
                if (homePage.isOffScreen(div, cardholder.clientWidth)) {
                    div.classList.add('off-screen-blur');
                }
            }
            homePage.recommededFill();
        });
    }
    ;
    cleanString(inputString) {
        // Replace all spaces with hyphens
        let cleanedString = inputString.replace(/\s+/g, '-');
        // Remove all special characters except hyphens
        cleanedString = cleanedString.replace(/[^\w-]/g, '-');
        return cleanedString.toLowerCase();
    }
    getMediaById(index) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(index);
            // console.log(index)
            //   const id = homePage.cleanString(homePage.releases.latest[index].id);
            //   console.log(id)
            //   // let gogoid = '';
            //   try {
            //       const response = await fetch(`http://localhost:3000/meta/anilist/info/21?provider=zoro`, {
            //           headers: {
            //               Accept: 'application/json',
            //               'Content-Type': 'application/json'
            //           }
            //       });
            //       const data = await response.json();
            //       zoro = data.results[0].id;
            //       // const releasing = data.status ===
            //       const episode = gogoid + '-episode-1';
            //       const stringified = JSON.stringify(episode)
            //       const x = JSON.stringify(homePage.releases.latest[index]);
            //       console.log(episode);
            //       window.sessionStorage.setItem('name', name)
            //       window.sessionStorage.setItem('fetch-this',stringified)
            //       const lastWatched = JSON.parse(window.sessionStorage.getItem('last-watched') as string);
            //       window.sessionStorage.setItem('anime-data', x);
            //       const url = 'anime-details.html';
            //       window.location.href = url;
            //   } catch (error) {
            //       console.error('Error:', error);
            //       // Handle errors here
            //   }
            if (window.sessionStorage.getItem('anime-episode')) {
                window.sessionStorage.removeItem('anime-episode');
            }
            if (window.sessionStorage.getItem('anime-data')) {
                window.sessionStorage.removeItem('anime-data');
            }
            if (window.sessionStorage.getItem('anify-data')) {
                window.sessionStorage.removeItem('anify-data');
            }
            if (window.sessionStorage.getItem('fetch-this')) {
                window.sessionStorage.removeItem('fetch-this');
            }
            if (window.sessionStorage.getItem('episode-data')) {
                window.sessionStorage.removeItem('episode-data');
            }
            const animeData = JSON.stringify(homePage.releases.latest[index]);
            window.sessionStorage.setItem('anime-data', animeData);
            const url = 'anime-details.html';
            window.location.href = url;
        });
    }
    recommededFill() {
        const arr = homePage.releases.latest ? homePage.releases.latest : JSON.parse(window.sessionStorage.getItem('latest'));
        const recommendedDIv = document.querySelector('.recommended2');
        const animeImage = document.createElement('img');
        const randomIndex = Math.floor(Math.random() * arr.length);
        const title = document.createElement('h4');
        const titleDiv = document.querySelector('.recommended2 > .details > .recommended-title');
        const descriptionPara = document.querySelector('.recommended2 > .details > .description');
        const watchButton = document.createElement('a');
        const imageHolder = document.querySelector('.recommended2  > .image-holder');
        const ratingDiv = document.querySelector('.recommended2 > .details > .rating');
        const ratingText = document.createTextNode((arr[randomIndex].averageScore / 10).toString());
        const space = document.createTextNode(`\u00A0\u00A0 `);
        const sub = document.createTextNode(`  SUB `);
        const tv = document.createTextNode(`TV `);
        const starIcon = document.createElement('i');
        const playButton = document.createElement('i');
        const captionIcon = document.createElement('i');
        captionIcon.className = "fa-solid fa-closed-captioning";
        playButton.className = "fa-solid fa-play";
        starIcon.className = 'fa-solid fa-star';
        ratingDiv.appendChild(starIcon);
        ratingDiv.appendChild(ratingText);
        ratingDiv.appendChild(space);
        ratingDiv.appendChild(playButton);
        ratingDiv.appendChild(tv);
        ratingDiv.appendChild(space.cloneNode());
        ratingDiv.appendChild(captionIcon);
        ratingDiv.appendChild(sub);
        watchButton.id = `${randomIndex}`;
        watchButton.addEventListener('click', homePage.fetchById);
        titleDiv.textContent = arr[randomIndex].title.english ? arr[randomIndex].title.english : arr[randomIndex].title.romaji;
        descriptionPara.innerHTML = arr[randomIndex].description.length < 400 ? arr[randomIndex].description : arr[randomIndex].description.substring(0, 400) + '...';
        animeImage.src = arr[randomIndex].coverImage.extraLarge ?
            arr[randomIndex].coverImage.extraLarge : arr[randomIndex].coverImage.large;
        animeImage.classList.add('anime-image');
        imageHolder.appendChild(animeImage);
        title.textContent = arr[randomIndex].title.english ?
            arr[randomIndex].title.english :
            arr[randomIndex].title.romaji;
    }
    popularFill() {
        const media = this.popular.length > 0 ? this.popular : JSON.parse(window.sessionStorage.getItem('recommended'));
        console.log(media);
        const spinner = document.querySelector('.popular > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)');
        const cardholder = document.querySelector('.popular-card-holder');
        if (media) {
            spinner.style.display = 'none';
        }
        for (let i = 0; i < media.length; ++i) {
            if (media[i].mal === null)
                continue;
            const div = document.createElement('div');
            const div2 = document.createElement('div');
            const animeImage = document.createElement('img');
            const title = document.createElement('p');
            const blur = document.createElement('div');
            const playButton = document.createElement('img');
            const link = document.createElement('a');
            div.setAttribute('data-index', `${i}`);
            link.id = `${i}`;
            link.classList.add('anime-link');
            playButton.src = './images/play-button-icon-white-8.png';
            link.appendChild(playButton);
            animeImage.classList.add('anime-image');
            blur.classList.add('hover-blur');
            blur.id = `${i}`;
            title.textContent = media[i].title.english ?
                media[i].title.english :
                media[i].title.romaji;
            div.classList.add('image-holder');
            div2.classList.add('p-holder');
            playButton.classList.add('play-button');
            playButton.id = `${i}`;
            blur.appendChild(link);
            blur.appendChild(title);
            animeImage.src = media[i].coverImage.extraLarge ?
                media[i].coverImage.extraLarge :
                media[i].coverImage.large;
            div.appendChild(animeImage);
            div2.appendChild(title);
            div.appendChild(div2);
            div.appendChild(blur);
            cardholder.appendChild(div);
            if (homePage.isOffScreen(div, cardholder.clientWidth)) {
                div.classList.add('off-screen-blur');
            }
        }
    }
    test(e) {
        let index;
        const target = e.target;
        console.log(target.closest('.latest-release') !== null, target.closest('.latest-release'));
        const arr = ['hover-blur', 'image-holder', 'anime-link', 'play-button'];
        if (arr.indexOf(target.classList[0]) === -1)
            return;
        index = target.id;
        if (window.sessionStorage.getItem('anime-episode')) {
            window.sessionStorage.removeItem('anime-episode');
        }
        if (window.sessionStorage.getItem('anime-data')) {
            window.sessionStorage.removeItem('anime-data');
        }
        if (window.sessionStorage.getItem('fetch-this')) {
            window.sessionStorage.removeItem('fetch-this');
        }
        if (window.sessionStorage.getItem('anify-data')) {
            window.sessionStorage.removeItem('anify-data');
        }
        if (window.sessionStorage.getItem('episode-data')) {
            window.sessionStorage.removeItem('episode-data');
        }
        const data = target.closest('.latest-release') !== null ? homePage.releases.latest[Number(index)] : homePage.popular[Number(index)];
        const animeData = JSON.stringify(data);
        window.sessionStorage.setItem('anime-data', animeData);
        const url = 'anime-details.html';
        window.location.href = url;
    }
    isOffScreen(element, parentWidth) {
        return element.getBoundingClientRect().left <= 0 ||
            element.getBoundingClientRect().right >= parentWidth ||
            element.getBoundingClientRect().left >= parentWidth;
    }
    scrollLatestCarousel(e) {
        const cardHolder = document.querySelector('.latest-card-holder');
        const nextButton = document.querySelector('.next-btn1');
        const prevButton = document.querySelector('.prev-btn1');
        const nextSpan = document.querySelector('.latest-next-span');
        const prevSpan = document.querySelector('.latest-prev-span');
        const prevButtonDisplay = getComputedStyle(prevButton).display;
        const nextButtonDisplay = getComputedStyle(nextButton).display;
        const target = e.target;
        console.log(target);
        if (target === nextButton || target === nextSpan && prevButtonDisplay === 'none') {
            prevButton.style.display = 'inline';
        }
        if (target === prevButton || target === prevSpan && nextButtonDisplay === 'none') {
            nextButton.style.display = 'inline';
        }
        const isPrev = target === prevButton || target === prevSpan ? true : false;
        const imageWidth = cardHolder.querySelector('.image-holder').clientWidth;
        const allImages = cardHolder.querySelectorAll('.image-holder');
        const imagesOnScreen = cardHolder.querySelectorAll('.image-holder:not(.off-screen-blur)').length;
        const gap = 32 * imagesOnScreen;
        const calc = (imageWidth * imagesOnScreen) + gap;
        const scrollBy = isPrev ? -calc : calc;
        cardHolder.scrollLeft += scrollBy;
        if (cardHolder.scrollLeft === 0) {
            prevButton.style.display = 'none';
        }
        if (cardHolder.scrollWidth - cardHolder.scrollLeft === cardHolder.clientWidth) {
            nextButton.style.display = 'none';
        }
        for (let i = 0; i < allImages.length; i++) {
            const image = allImages[i];
            if (homePage.isOffScreen(image, cardHolder.clientWidth)) {
                image.classList.add('off-screen-blur');
            }
            if (!homePage.isOffScreen(image, cardHolder.clientWidth) && image.classList.contains('off-screen-blur')) {
                image.classList.remove('off-screen-blur');
            }
        }
    }
    scrollPopularCarousel(e) {
        const cardHolder = document.querySelector('.popular-card-holder');
        const nextButton = document.querySelector('.next-btn2');
        const prevButton = document.querySelector('.prev-btn2');
        const prevButtonDisplay = getComputedStyle(prevButton).display;
        const nextButtonDisplay = getComputedStyle(nextButton).display;
        const target = e.target;
        console.log(cardHolder.scrollLeft + cardHolder.clientWidth, cardHolder.scrollWidth);
        if (target === nextButton && prevButtonDisplay === 'none') {
            prevButton.style.display = 'inline';
        }
        if (target === prevButton && nextButtonDisplay === 'none') {
            nextButton.style.display = 'inline';
        }
        const isPrev = target === prevButton ? true : false;
        const imageWidth = cardHolder.querySelector('.image-holder').clientWidth;
        const allImages = cardHolder.querySelectorAll('.image-holder');
        const imagesOnScreen = cardHolder.querySelectorAll('.image-holder:not(.off-screen-blur)').length;
        const gap = 32 * imagesOnScreen;
        const calc = (imageWidth * imagesOnScreen) + gap;
        const scrollBy = isPrev ? -calc : calc;
        cardHolder.scrollLeft += scrollBy;
        if (cardHolder.scrollLeft === 0) {
            prevButton.style.display = 'none';
        }
        if (cardHolder.scrollWidth - cardHolder.scrollLeft === cardHolder.clientWidth) {
            nextButton.style.display = 'none';
        }
        for (let i = 0; i < allImages.length; i++) {
            const image = allImages[i];
            if (homePage.isOffScreen(image, cardHolder.clientWidth)) {
                image.classList.add('off-screen-blur');
            }
            if (!homePage.isOffScreen(image, cardHolder.clientWidth) && image.classList.contains('off-screen-blur')) {
                image.classList.remove('off-screen-blur');
            }
        }
    }
}
const homePage = new HomePage();
homePage.getPopular();
const nextButton = document.querySelector('.next-btn1');
const prevButton = document.querySelector('.prev-btn1');
const latestNextSpan = document.querySelector('.latest-next-span');
const latestPrevSpan = document.querySelector('.latest-prev-span');
const nextButton2 = document.querySelector('.next-btn2');
const prevButton2 = document.querySelector('.prev-btn2');
nextButton.addEventListener('click', homePage.scrollLatestCarousel);
prevButton.addEventListener('click', homePage.scrollLatestCarousel);
latestNextSpan.addEventListener('click', homePage.scrollLatestCarousel);
latestPrevSpan.addEventListener('click', homePage.scrollLatestCarousel);
nextButton2.addEventListener('click', homePage.scrollPopularCarousel);
prevButton2.addEventListener('click', homePage.scrollPopularCarousel);
homePage.populateCards();
document.addEventListener('click', homePage.test);
const latestCarousel = document.querySelector('.latest-card-holder');
latestCarousel.scrollLeft = 0;
const popularCarousel = document.querySelector('.popular-card-holder');
popularCarousel.scrollLeft = 0;

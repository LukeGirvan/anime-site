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
        this.firstOffScreen = 0;
        this.limit = 0;
        this.latestIsScrolling = false;
        this.popularIsScrolling = false;
        this.randomIndex = null;
        this.start = 0;
        this.latestScrollBy = 0;
        this.popularScrollBy = 0;
        this.images = [];
        this.queryTimer = null;
        this.queryData = [];
        this.lastQuery = '';
        this.releases = {
            trending: [],
            popular: []
        };
        this.timer = null;
        this.animeData = {};
    }
    fetchById(e) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const target = e.target;
            const type = (_a = e.target.dataset) === null || _a === void 0 ? void 0 : _a.type;
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
            const arr = type === 'popular' ? homePage.releases.popular[Number(index)] : homePage.releases.trending[Number(index)];
            const animeDetails = JSON.stringify(arr);
            window.sessionStorage.setItem('anime-data', animeDetails);
            const url = 'anime-details.html';
            window.location.href = url;
        });
    }
    fetchPopular() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      query {
        Page(page: 1, perPage: 20) {
          media(sort: POPULARITY_DESC, type: ANIME) {
            startDate {
              year
              month
              day
            }
            id
            idMal
            format
            title {
              romaji
              english
              userPreferred
            }
            popularity
            coverImage {
              extraLarge
            }
            bannerImage
            averageScore
            description
            episodes
            type
            status
            
            genres
            nextAiringEpisode {
              airingAt
              timeUntilAiring
              episode
            }
            relations {
              edges {
                relationType
                node {
                  id
                  title {
                    romaji
                    english
                    userPreferred
                  }
                  coverImage {
                    extraLarge
                    large
                  }
                }
              }
            }
            studios {
              edges {
                node {
                  id
                  name
                }
              }
            }
            recommendations {
              edges {
                node {
                  id
                  mediaRecommendation {
                    id
                    idMal
                    bannerImage
                    title {
                      romaji
                      english
                    }
                    coverImage {
                      extraLarge
                      large
                    }
                    episodes
                    nextAiringEpisode {
                      airingAt
                      timeUntilAiring
                      episode
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
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query })
            };
            const response = yield fetch(url, options);
            const data = yield response.json();
            console.log(data);
            return data.data.Page.media;
            // return response.json();
        });
    }
    getPopular() {
        return __awaiter(this, void 0, void 0, function* () {
            const divForBg = document.querySelector('.slide');
            const details = divForBg.querySelector('.details');
            const spinner = document.querySelector('.spinner');
            details.style.visibility = 'hidden';
            const cachedData = window.sessionStorage.getItem('popular');
            let response;
            if (cachedData) {
                response = JSON.parse(cachedData);
            }
            else {
                response = yield homePage.fetchPopular();
                window.sessionStorage.setItem('popular', JSON.stringify(response));
            }
            console.log(response);
            homePage.releases.popular = response;
            console.log(homePage.releases);
            const titleDiv = document.querySelector('.slide > .details > .recommended-title');
            const ratingDiv = document.querySelector('.slide > .details > .rating');
            const description = document.querySelector('.slide > .details > .description');
            const watchButton = document.querySelector('.slide > .details > .btn');
            const randomIndex = Math.floor(Math.random() * homePage.releases.popular.length);
            console.log(randomIndex);
            const selectedAnime = homePage.releases.popular[randomIndex];
            const titleString = selectedAnime.title.userPreferred;
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
            watchButton.dataset.type = 'popular';
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
            startDate {
              year
              month
              day
            }
            id
            idMal
            format
            title {
              romaji
              english
              userPreferred
            }
            popularity
            coverImage {
              extraLarge
            }
            bannerImage
            averageScore
            description
            episodes
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
            nextAiringEpisode {
              airingAt
              timeUntilAiring
              episode
            }
            relations {
              edges {
                relationType
                node {
                  id
                  title {
                    romaji
                    english
                    userPreferred
                  }
                  coverImage {
                    extraLarge
                    large
                  }
                }
              }
            }
            recommendations {
              edges {
                node {
                  id
                  mediaRecommendation {
                    id
                    bannerImage
                    idMal
                    title {
                      romaji
                      english
                    }
                    coverImage {
                      extraLarge
                      large
                    }
                    episodes
                    nextAiringEpisode {
                      airingAt
                      timeUntilAiring
                      episode
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
            // Define the variables for the query
            const variables = {
                page: 1,
                perPage: 20
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
            const response = yield fetch(url, options);
            console.log(response);
            const data = yield response.json();
            const filteredData = data.data.Page.media.filter((media) => media.status !== 'NOT_YET_RELEASED');
            return filteredData;
            // const response= await  fetch('http://localhost:3000/anime/gogoanime/top-airing')
            // return response.json()
        });
    }
    addReleasing(element, status) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(status);
            const options = {
                'RELEASING': () => {
                    element.classList.add('green');
                    element.textContent = status;
                }, 'FINISHED': () => {
                    element.classList.add('blue');
                    element.textContent = status;
                }, 'NOT_YET_RELEASED': () => {
                    element.classList.add('red');
                    element.textContent = 'NOT RELEASED';
                }
            };
            options[status]();
        });
    }
    // applyStyleClassesAtStart(){
    //   const screenWidth = document.documentElement.clientWidth
    //   console.log(screenWidth)
    //   const recommended2 = document.querySelector("body > div > div.recommended2.flex")
    //   const recommended2Details= document.querySelector("body > div > div.recommended2.flex > .details")
    //   const slideDetails = document.querySelector("body > div > div.slide > div.details") 
    //   if(screenWidth <=1199){
    //     recommended2?.classList.add('center')
    //     recommended2?.classList.add('column')
    //     recommended2Details?.classList.add('flex')
    //     recommended2Details?.classList.add('center')
    //     recommended2Details?.classList.add('column')
    //     slideDetails?.classList.add('flex')
    //     slideDetails?.classList.add('center')
    //     slideDetails?.classList.add('column')
    //   }
    // }
    populateCards() {
        return __awaiter(this, void 0, void 0, function* () {
            const cardholder = document.querySelector('.carousel');
            const spinner = document.querySelector("body > div > div.latest-release > div.carousel-wrapper > div > div");
            const data = JSON.parse(window.sessionStorage.getItem('trending')) ?
                JSON.parse(window.sessionStorage.getItem('trending')) : yield homePage.fetchLatest();
            const media = data.data !== undefined ? data.data.Page.media.filter((item) => item.idMal !== null) : data.filter((item) => item.idMal !== null);
            if (!window.sessionStorage.getItem('trending')) {
                window.sessionStorage.setItem('trending', JSON.stringify(media));
            }
            homePage.releases.trending = media;
            if (media) {
                spinner.style.display = 'none';
            }
            homePage.fillCardHolder(cardholder, media);
            homePage.recommendedFill();
        });
    }
    ;
    fillCardHolder(cardholder, media) {
        //   for(let i = 0;i<media.length;++i){
        //     if(media[i].mal === null)continue;
        //     const div = document.createElement('div')
        //     const div2= document.createElement('div')
        //     const animeImage = document.createElement('img')
        //     const title = document.createElement('p')
        //     const blur = document.createElement('div')
        //     const playButton = document.createElement('img')
        //     const link = document.createElement('a')
        //     const releasing = document.createElement('div')
        //     releasing.classList.add('releasing')
        //     homePage.addReleasing(releasing, media[i].status)
        //     div.id= `${i}`
        //     link.id = `${i}`
        //     link.classList.add('anime-link')
        //     playButton.src = './images/play-button-icon-white-8.png'
        //     link.appendChild(playButton)
        //     animeImage.classList.add('anime-image')
        //     blur.classList.add('hover-blur')
        //     blur.draggable = false;
        //     blur.id = `${i}`
        //     blur.appendChild(releasing)
        //     title.textContent = media[i].title.userPreferred ?
        //             media[i].title.userPreferred :
        //             media[i].title.romaji
        //     div.classList.add('image-holder')
        //     div.draggable = false;
        //     div2.classList.add('p-holder')
        //     playButton.classList.add('play-button')
        //     playButton.id = `${i}`
        //     playButton.draggable = false
        //     blur.appendChild(link)
        //     blur.appendChild(title)
        //     animeImage.draggable = false
        //     animeImage.src = media[i].coverImage.extraLarge ? 
        //             media[i].coverImage.extraLarge :
        //             media[i].coverImage.large
        //     div.appendChild(animeImage)
        //     div2.appendChild(title)
        //     div.appendChild(div2)
        //     div.appendChild(blur)
        //     cardholder.appendChild(div)
        //     cardholder.draggable = false
        //     if(homePage.isOffScreen(div,cardholder.clientWidth)){
        //       div.classList.add('off-screen-blur')
        //     }
        // }
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
            const metdaDataHolder = document.createElement('div');
            const year = document.createElement('div');
            const rating = document.createElement('div');
            const ratingText = `${parseFloat(Number(media[i].averageScore) / 10)}`;
            const ratingTextNode = document.createTextNode(ratingText);
            const starIcon = document.createElement('i');
            const circleIcon = document.createElement('i');
            const titleTextNode = document.createTextNode(media[i].title.userPreferred.length < 25 ? media[i].title.userPreferred : media[i].title.userPreferred.substring(0, 23) + '...');
            const releasing = document.createElement('div');
            releasing.classList.add('releasing');
            homePage.addReleasing(releasing, media[i].status);
            circleIcon.className = 'fa-solid fa-circle';
            circleIcon.classList.add(media[i].status === 'RELEASING' ? 'green' : 'blue');
            starIcon.className = 'fa-solid fa-star';
            year.textContent = `${media[i].startDate.year} | ${media[i].format}`;
            year.classList.add('year');
            metdaDataHolder.classList.add('meta-data');
            metdaDataHolder.appendChild(year);
            rating.className = 'rating-div';
            rating.appendChild(starIcon);
            rating.appendChild(ratingTextNode);
            metdaDataHolder.appendChild(rating);
            div.id = `${i}`;
            link.id = `${i}`;
            link.classList.add('anime-link');
            playButton.src = './images/play-button-icon-white-8.png';
            link.appendChild(playButton);
            animeImage.classList.add('anime-image');
            blur.classList.add('hover-blur');
            blur.id = `${i}`;
            blur.appendChild(releasing);
            title.appendChild(circleIcon);
            title.appendChild(titleTextNode);
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
            div2.appendChild(metdaDataHolder);
            div.appendChild(div2);
            div.appendChild(blur);
            cardholder.appendChild(div);
            if (homePage.isOffScreen(div, cardholder.clientWidth)) {
                div.classList.add('off-screen-blur');
            }
        }
    }
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
    recommendedFill() {
        const arr = homePage.releases.trending.length > 0 ? homePage.releases.trending : JSON.parse(window.sessionStorage.getItem('latest'));
        if (JSON.stringify(homePage.releases.trending) !== JSON.stringify(arr)) {
            homePage.releases.trending = arr;
        }
        const recommendedDIv = document.querySelector('.recommended2');
        const animeImage = document.createElement('img');
        const randomIndex = Math.floor(Math.random() * arr.length);
        const title = document.createElement('h4');
        const titleDiv = document.querySelector('.recommended2 > .details > .recommended-title');
        const descriptionPara = document.querySelector('.recommended2 > .details > .description');
        const watchButton = recommendedDIv.querySelector('.btn');
        const imageHolder = document.querySelector('.recommended2  > .recommended-image');
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
        watchButton.dataset.type = 'trending';
        titleDiv.textContent = arr[randomIndex].title.userPreferred ? arr[randomIndex].title.userPreferred : arr[randomIndex].title.romaji;
        descriptionPara.innerHTML = arr[randomIndex].description.length < 300 ? descriptionPara.innerHTML = arr[randomIndex].description : descriptionPara.innerHTML = arr[randomIndex].description.substring(0, 300) + '...';
        animeImage.src = arr[randomIndex].coverImage.extraLarge ?
            arr[randomIndex].coverImage.extraLarge : arr[randomIndex].coverImage.large;
        animeImage.classList.add('anime-image');
        imageHolder.appendChild(animeImage);
        title.textContent = arr[randomIndex].title.userPreferred ?
            arr[randomIndex].title.userPreferred :
            arr[randomIndex].title.romaji;
    }
    popularFill() {
        const media = homePage.releases.popular.length > 0 ? homePage.releases.popular : JSON.parse(window.sessionStorage.getItem('popular'));
        console.log(media);
        const spinner = document.querySelector("body > div > div.popular > div.carousel-wrapper > div > div");
        const cardholder = document.querySelector('.carousel.popular');
        if (media) {
            spinner.style.display = 'none';
        }
        homePage.fillCardHolder(cardholder, media);
    }
    test(e) {
        let index;
        const target = e.target;
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
        const data = target.closest('.latest-release') !== null ? homePage.releases.trending[Number(index)] : homePage.releases.popular[Number(index)];
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
        if (homePage.latestIsScrolling)
            return;
        homePage.latestIsScrolling = true;
        const cardHolder = document.querySelector('.carousel');
        const nextButton = document.querySelector('.carousel-next');
        const prevButton = document.querySelector('.carousel-prev');
        const nextSpan = document.querySelector('.carousel-next-span');
        const prevSpan = document.querySelector('.carousel-prev-span');
        const prevButtonDisplay = getComputedStyle(prevButton).display;
        const nextButtonDisplay = getComputedStyle(nextButton).display;
        const target = e.target;
        const nextArr = [nextButton, nextSpan];
        const prevArr = [prevButton, prevSpan];
        if (nextArr.indexOf(target) !== -1 && prevButtonDisplay === 'none') {
            prevButton.style.display = 'inline';
            prevSpan.style.display = 'inline';
        }
        if (prevArr.indexOf(target) !== -1 && nextButtonDisplay === 'none') {
            nextButton.style.display = 'inline';
            nextSpan.style.display = 'inline';
        }
        const isPrev = prevArr.indexOf(target) !== -1 ? true : false;
        const imageWidth = cardHolder.querySelector('.image-holder').clientWidth;
        const allImages = cardHolder.querySelectorAll('.image-holder');
        const imagesOnScreen = cardHolder.querySelectorAll('.image-holder:not(.off-screen-blur)').length;
        const gap = 32 * imagesOnScreen;
        const calc = (imageWidth * imagesOnScreen) + gap;
        const transformValue = isPrev ? -calc : calc;
        if (homePage.limit === 0) {
            homePage.limit = (allImages[allImages.length - 1].getBoundingClientRect().right + 32) - cardHolder.clientWidth;
        }
        console.log(homePage.limit);
        homePage.latestScrollBy = isPrev
            ? Math.max(0, homePage.latestScrollBy + transformValue)
            : Math.min(homePage.latestScrollBy + transformValue, homePage.limit);
        cardHolder.style.transform = `translateX(-${homePage.latestScrollBy}px)`;
        console.log(homePage.latestScrollBy);
        setTimeout(() => {
            for (let i = 0; i < allImages.length; i++) {
                const image = allImages[i];
                if (homePage.isOffScreen(image, cardHolder.clientWidth)) {
                    image.classList.add('off-screen-blur');
                }
                if (!homePage.isOffScreen(image, cardHolder.clientWidth) && image.classList.contains('off-screen-blur')) {
                    image.classList.remove('off-screen-blur');
                }
                if (!homePage.isOffScreen(allImages[0], cardHolder.clientWidth)) {
                    prevButton.style.display = 'none';
                    prevSpan.style.display = 'none';
                }
                if (!homePage.isOffScreen(allImages[allImages.length - 1], cardHolder.clientWidth)) {
                    nextButton.style.display = 'none';
                    nextSpan.style.display = 'none';
                }
            }
            homePage.latestIsScrolling = false;
        }, 500);
    }
    scrollPopularCarousel(e) {
        if (homePage.popularIsScrolling)
            return;
        homePage.popularIsScrolling = true;
        const cardHolder = document.querySelector('.popular-card-holder');
        const nextButton = document.querySelector('.next-btn2');
        const prevButton = document.querySelector('.prev-btn2');
        const nextSpan = document.querySelector('.popular-next-span');
        const prevSpan = document.querySelector('.popular-prev-span');
        const prevButtonDisplay = getComputedStyle(prevButton).display;
        const nextButtonDisplay = getComputedStyle(nextButton).display;
        const target = e.target;
        const nextArr = [nextButton, nextSpan];
        const prevArr = [prevButton, prevSpan];
        if (nextArr.indexOf(target) !== -1 && prevButtonDisplay === 'none') {
            prevButton.style.display = 'inline';
            prevSpan.style.display = 'inline';
        }
        if (prevArr.indexOf(target) !== -1 && nextButtonDisplay === 'none') {
            nextButton.style.display = 'inline';
            nextSpan.style.display = 'inline';
        }
        const isPrev = prevArr.indexOf(target) !== -1 ? true : false;
        const imageWidth = cardHolder.querySelector('.image-holder').clientWidth;
        const allImages = cardHolder.querySelectorAll('.image-holder');
        const imagesOnScreen = cardHolder.querySelectorAll('.image-holder:not(.off-screen-blur)').length;
        const gap = 32 * imagesOnScreen;
        const calc = (imageWidth * imagesOnScreen) + gap;
        const transformValue = isPrev ? -calc : calc;
        if (homePage.limit === 0) {
            homePage.limit = (allImages[allImages.length - 1].getBoundingClientRect().right + 32) - cardHolder.clientWidth;
        }
        console.log(homePage.limit);
        homePage.latestScrollBy = isPrev
            ? Math.max(0, homePage.latestScrollBy + transformValue)
            : Math.min(homePage.latestScrollBy + transformValue, homePage.limit);
        cardHolder.style.transform = `translateX(-${homePage.latestScrollBy}px)`;
        console.log(homePage.latestScrollBy);
        setTimeout(() => {
            for (let i = 0; i < allImages.length; i++) {
                const image = allImages[i];
                if (homePage.isOffScreen(image, cardHolder.clientWidth)) {
                    image.classList.add('off-screen-blur');
                }
                if (!homePage.isOffScreen(image, cardHolder.clientWidth) && image.classList.contains('off-screen-blur')) {
                    image.classList.remove('off-screen-blur');
                }
                if (!homePage.isOffScreen(allImages[0], cardHolder.clientWidth)) {
                    prevButton.style.display = 'none';
                    prevSpan.style.display = 'none';
                }
                if (!homePage.isOffScreen(allImages[allImages.length - 1], cardHolder.clientWidth)) {
                    nextButton.style.display = 'none';
                    nextSpan.style.display = 'none';
                }
            }
            homePage.popularIsScrolling = false;
        }, 500);
    }
}
const homePage = new HomePage();
// window.addEventListener('load', homePage.applyStyleClassesAtStart)
homePage.getPopular();
homePage.populateCards();
document.addEventListener('click', homePage.test);
const carousels = document.querySelectorAll('.carousel');
if (carousels) {
    carousels.forEach(carousel => {
        carousel.scrollLeft = 0;
    });
}

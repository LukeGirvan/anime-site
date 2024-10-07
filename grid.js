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
class Grid {
    constructor() {
        this.hasNextPage = false;
        this.gridItems = [];
        this.page = window.sessionStorage.getItem('page-num') ?
            JSON.parse(window.sessionStorage.getItem('page-num')) : 1;
        this.titles = [];
        this.cardholder = document.querySelector('.latest-release');
    }
    queryForType(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        query ($page: Int, $sort: [MediaSort], $status_not: MediaStatus, $episodes_greater: Int, $genre: [String]) {
          Page(page: $page, perPage: 25) {
            pageInfo{
              hasNextPage 
              lastPage
            }
            media(sort: $sort, type: ANIME, status_not: $status_not, episodes_greater: $episodes_greater , genre_in: $genre) {
              startDate {
                year
                month
                day
              }
              id
              idMal
              title {
                romaji
                english
                userPreferred
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
              format
              popularity
              recommendations {
                edges {
                  node {
                    id
                    mediaRecommendation {
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
              }
            }
          }
        }
      `;
            const url = 'https://graphql.anilist.co';
            let option = window.sessionStorage.getItem('sort-by');
            let parsedOption = null;
            const genre = JSON.parse(window.sessionStorage.getItem('grid-genre'));
            if (genre) {
                option = JSON.stringify('popular');
            }
            if (option) {
                try {
                    parsedOption = JSON.parse(option);
                }
                catch (error) {
                    console.error('Error parsing sort option from sessionStorage:', error);
                }
            }
            console.log(!option && genre);
            const sortRelations = {
                popular: 'POPULARITY_DESC',
                trending: 'TRENDING_DESC'
            };
            const sort = parsedOption ? sortRelations[parsedOption] : undefined;
            let variables;
            if (!genre) {
                variables = {
                    sort: [sort],
                    page: page,
                    status_not: 'NOT_YET_RELEASED',
                    episodes_greater: 0,
                };
            }
            else {
                variables = {
                    sort: [sort],
                    page: page,
                    status_not: 'NOT_YET_RELEASED',
                    episodes_greater: 0,
                    genre: [genre]
                };
            }
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query, variables })
            };
            const response = yield fetch(url, options);
            const data = yield response.json();
            console.log(data);
            return data.data;
        });
    }
    getGenres() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      query {
        GenreCollection
      }
    `;
            const response = yield fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ query })
            });
            const data = yield response.json();
            return data.data.GenreCollection;
        });
    }
    populateDropdown(genres) {
        const dropdown = document.getElementById('genresDropdown');
        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            dropdown.appendChild(option);
        });
    }
    isOffScreen(element, parentWidth) {
        return element.getBoundingClientRect().left <= 0 ||
            element.getBoundingClientRect().right >= parentWidth ||
            element.getBoundingClientRect().left >= parentWidth;
    }
    // skeletons(){
    //   console.log('running  skeleton')
    //   const cardholder = document.querySelector('.grid') as HTMLDivElement
    //   console.log(cardholder)
    //   for(let i =0;i<20;i++){
    //     const skeletonBox = document.createElement('div')
    //     const skeletonText = document.createElement('div')
    //     skeletonBox.classList.add('skeleton')
    //     skeletonBox.classList.add('box')
    //     skeletonText.classList.add('skeleton')
    //     skeletonText.classList.add('text')
    //     skeletonBox.appendChild(skeletonText)
    //     cardholder.appendChild(skeletonBox)
    //   }
    // }
    addReleasing(element, status) {
        return __awaiter(this, void 0, void 0, function* () {
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
    errorMessage() {
        const grid = document.querySelector('.grid');
        const div = document.createElement('div');
        const errorMsg = 'No results found';
        const paragraph = document.createElement('p');
        div.classList.add('error-div');
        div.style.width = `${grid.clientWidth}px`;
        console.log(grid.clientWidth);
        paragraph.classList.add('error');
        paragraph.textContent = errorMsg;
        div.appendChild(paragraph);
        grid.appendChild(div);
    }
    queryAnilist(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const x = `
        query ($searchTerm: String) {
          Page(page: 1, perPage: 25) {
              pageInfo{
                  hasNextPage 
                  lastPage
                }
            media(search: $searchTerm, type: ANIME) {
              startDate {
                year
                month
                day
              }
              id
              idMal
              title {
                romaji
                english
                userPreferred
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
              format
              popularity
              recommendations {
                edges {
                  node {
                    id
                    mediaRecommendation {
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
            // console.log(data.data.Page.media)
            return data.data;
        });
    }
    populateCards() {
        return __awaiter(this, void 0, void 0, function* () {
            let data, nextPageCheck, pageInfo;
            const cardholder = document.querySelector('.grid');
            const sortBy = JSON.parse(window.sessionStorage.getItem('sort-by'));
            const genre = JSON.parse(window.sessionStorage.getItem('grid-genre'));
            const queryForSearch = JSON.parse(window.sessionStorage.getItem('search-query'));
            const pageNum = grid.page;
            if (!genre && pageNum === 1 && !queryForSearch) {
                data = JSON.parse(window.sessionStorage.getItem(`${sortBy}`));
            }
            else if (queryForSearch) {
                nextPageCheck = yield grid.queryAnilist(queryForSearch);
                console.log(nextPageCheck);
                pageInfo = nextPageCheck.Page.pageInfo.hasNextPage;
                grid.hasNextPage = pageInfo;
                data = nextPageCheck.Page.media;
            }
            else if (genre && window.sessionStorage.getItem(`page-${pageNum}-data-${genre}`)) {
                nextPageCheck = JSON.parse(window.sessionStorage.getItem(`page-${pageNum}-data-${genre}`));
                pageInfo = nextPageCheck.Page.pageInfo.hasNextPage;
                grid.hasNextPage = pageInfo;
                data = nextPageCheck.Page.media;
                console.log('cached');
            }
            else if (!genre && window.sessionStorage.getItem(`page-${pageNum}-data-${sortBy}`)) {
                nextPageCheck = JSON.parse(window.sessionStorage.getItem(`page-${pageNum}-data-${sortBy}`));
                pageInfo = nextPageCheck.Page.pageInfo.hasNextPage;
                grid.hasNextPage = pageInfo;
                data = nextPageCheck.Page.media;
                console.log('cached');
            }
            else {
                nextPageCheck = yield grid.queryForType(pageNum);
                console.log(nextPageCheck);
                pageInfo = nextPageCheck.Page.pageInfo.hasNextPage;
                grid.hasNextPage = pageInfo;
                data = nextPageCheck.Page.media;
            }
            const gridDiv = document.querySelector('.grid');
            console.log(data.length);
            for (let i = 0; i < data.length; i++) {
                grid.gridItems.push(data[i]);
            }
            console.log(data);
            const media = data.data !== undefined ? data.data.Page.media.filter((item) => item.idMal !== null) : data.filter((item) => item.idMal !== null);
            grid.fillCardHolder(cardholder, media);
            const dropDown = document.querySelector('#episodes');
            const pagination = document.querySelector('.pagination');
            gridDiv.addEventListener('click', grid.test);
            pagination.style.display = 'flex';
            // grid.pageNum()
            pagination.addEventListener('click', grid.pagination);
            // cardholder.addEventListener('mouseover', grid.hoverListener)
            grid.titles.sort((a, b) => a.localeCompare(b));
            console.log(grid.titles);
            dropDown.addEventListener('change', grid.sortByRating);
            const stringifiedData = JSON.stringify(nextPageCheck);
            if (genre && !window.sessionStorage.getItem(`page-${pageNum}-data-${genre}`)) {
                window.sessionStorage.setItem(`page-${pageNum}-data-${genre}`, stringifiedData);
            }
            if (sortBy && !window.sessionStorage.getItem(`page-${pageNum}-data-${sortBy}`) && !genre) {
                window.sessionStorage.setItem(`page-${pageNum}-data-${sortBy}`, stringifiedData);
            }
        });
    }
    ;
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
        if (window.sessionStorage.getItem('page-data')) {
            window.sessionStorage.removeItem('page-data');
        }
        const data = grid.gridItems[index];
        const animeData = JSON.stringify(data);
        window.sessionStorage.setItem('anime-data', animeData);
        const url = 'anime-details.html';
        window.location.href = url;
    }
    fillCardHolder(cardholder, media) {
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
            grid.addReleasing(releasing, media[i].status);
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
        }
        const skeletons = document.querySelectorAll('.skeleton');
        console.log(skeletons);
        if (media.length > 0) {
            skeletons.forEach((skeleton) => {
                skeleton.remove();
            });
        }
        media.forEach((element) => {
            grid.titles.push(element.title.userPreferred);
        });
    }
    loadMore(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            grid.page += 1;
            const data = yield grid.queryForType(grid.page);
            console.log(data);
            window.sessionStorage.setItem('grid-query', JSON.stringify(data));
            yield grid.populateCards();
        });
    }
    sortByRating(e) {
        console.log(grid.gridItems);
        const option = e.target.value;
        const sortByOption = {
            'popular': () => {
                grid.gridItems.sort((a, b) => b.popularity - a.popularity);
            },
            'rating': () => {
                grid.gridItems.sort((a, b) => b.averageScore - a.averageScore);
            },
            'title-desc': () => {
                grid.gridItems.sort((a, b) => b.title.userPreferred.localeCompare(a.title.userPreferred));
            }, 'title-asc': () => {
                grid.gridItems.sort((a, b) => a.title.userPreferred.localeCompare(b.title.userPreferred));
            }
        };
        console.log("Before sorting:");
        console.log(grid.gridItems);
        sortByOption[option]();
        const media = grid.gridItems;
        const cardholder = document.querySelector('.grid');
        grid.changeCardHolder(cardholder, media);
    }
    changeCardHolder(cardholder, media) {
        cardholder.innerHTML = '';
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
            title.textContent = media[i].title.userPreferred;
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
        }
    }
    // hoverListener(e:Event){
    //   console.log(e.target)
    // }
    pageNum() {
        // const active = document.querySelector('.active') as HTMLAnchorElement
        // const pageNum = grid.page
        // if(active && pageNum && Number(active.textContent) !== pageNum){
        //   const target =( document.querySelector('.pagination') as HTMLAnchorElement).children[Number(pageNum) -1]
        //   active.classList.remove('active')
        //   target.classList.add('active')
        // }else{
        //   console.log('didnt enter if ststement')
        // }
    }
    pagination(e) {
        const target = e.target;
        console.log(target.classList[0] === 'prev-page' && grid.page !== 1);
        console.log(grid.hasNextPage);
        console.log(target.classList[0] === 'next-page' && grid.hasNextPage);
        // if(target.classList.contains('active'))return;
        console.log(target);
        if (target.classList[0] === 'prev-page' && grid.page !== 1) {
            grid.page -= 1;
            grid.changePage(grid.page);
        }
        if (target.classList[0] === 'next-page' && grid.hasNextPage) {
            grid.page += 1;
            grid.changePage(grid.page);
        }
    }
    changePage(pageNum) {
        window.sessionStorage.setItem('page-num', JSON.stringify(pageNum));
        window.location.href = 'grid.html';
    }
    h2fill() {
        const h2 = document.querySelector('.h2-holder > h2');
        const genre = JSON.parse(window.sessionStorage.getItem('grid-genre'));
        const sortBy = JSON.parse(window.sessionStorage.getItem('sort-by'));
        const searchTerm = JSON.parse(window.sessionStorage.getItem('search-query'));
        if (genre) {
            h2.textContent = genre;
        }
        else if (searchTerm) {
            h2.textContent = 'Results';
        }
        else {
            h2.textContent = sortBy.charAt(0).toUpperCase() + sortBy.slice(1);
        }
    }
}
const grid = new Grid();
window.addEventListener('load', grid.h2fill);
window.addEventListener('load', grid.populateCards);
// grid.getGenres().then(genres => grid.populateDropdown(genres));

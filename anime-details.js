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
class AnimeDetails {
    constructor() {
        this.data = {};
        this.recommended = [];
        this.replacement = ['./images/background-image-replace1.jpg',
            './images/background-image-replace2.webp',
            './images/background-image-replace3.webp'];
    }
    onload() {
        const data = JSON.parse(window.sessionStorage.getItem('anime-data'));
        const coverImage = document.querySelector('.cover-image');
        const divForBackground = document.querySelector('.background-image');
        const title = document.querySelector('.anime-title');
        const otherTitle = document.querySelector('.other-title');
        const rating = document.querySelector('.rating');
        const randomImage = Math.floor(Math.random() * animeDetails.replacement.length);
        const ratingText = `${parseFloat(Number(data.averageScore) / 10)}`;
        const description = document.querySelector('.description-div');
        const starIcon = document.createElement('i');
        const playButton = document.createElement('i');
        const captionIcon = document.createElement('i');
        const tv = `${data.totalEpisodes}`;
        const space = document.createTextNode('\u00A0\u00A0');
        // const ratingTextNode = document.createTextNode(ratingText)
        captionIcon.className = "fa-solid fa-closed-captioning";
        playButton.className = "fa-solid fa-play";
        starIcon.className = 'fa-solid fa-star';
        description.innerHTML = data.description;
        const textNode1 = document.createTextNode(ratingText);
        const textNode2 = document.createTextNode(tv);
        const textNode3 = document.createTextNode(ratingText);
        const textNode4 = document.createTextNode(ratingText);
        rating.appendChild(starIcon);
        rating.appendChild(textNode1);
        rating.appendChild(space);
        rating.appendChild(playButton);
        rating.appendChild(textNode2);
        divForBackground.style.backgroundImage = data.bannerImage ? `url(${data.bannerImage})` : `url(${animeDetails.replacement[randomImage]})`;
        title.textContent = data.title.english;
        otherTitle.textContent = data.title.romaji ? data.title.romaji : data.title.romaji;
        coverImage.src = data.coverImage.extraLarge ? data.coverImage.extraLarge : data.coverImage.large;
    }
    fetchAnilist() {
        return __awaiter(this, void 0, void 0, function* () {
            const animeData = JSON.parse(window.sessionStorage.getItem('anime-data'));
            const id = animeData.id;
            const query = `
        query ($id: Int) {
            Media (id: $id) {
              
              title {
                romaji
                english
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
                      coverImage{
                        extraLarge
                        large
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
                id: id
            };
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    variables: variables
                })
            };
            const response = yield fetch(url, options);
            const data = yield response.json();
            return data;
        });
    }
    fetchEpisodeDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = window.sessionStorage.getItem('episode-data') ? JSON.parse(window.sessionStorage.getItem('episode-data')) :
                yield animeDetails.fetchAnilist();
            console.log(data);
            for (let i = 0; i < data.data.Media.recommendations.edges.length; i++) {
                const recommendation = data.data.Media.recommendations.edges[i].node.mediaRecommendation;
                console.log(recommendation);
                animeDetails.recommended.push(recommendation);
            }
            console.log(animeDetails.recommended);
            yield animeDetails.fill(data.data.Media);
            yield animeDetails.fillEpisodeButtons();
            if (!window.sessionStorage.getItem('episode-data')) {
                const episodeData = JSON.stringify(data);
                window.sessionStorage.setItem('episode-data', episodeData);
            }
            yield animeDetails.populateCards();
        });
    }
    fillEpisodeButtons() {
        return __awaiter(this, void 0, void 0, function* () {
            const spinner = document.querySelector('.spinner');
            const animeData = JSON.parse(window.sessionStorage.getItem('anime-data'));
            const id = animeData.id;
            let data;
            if (!window.sessionStorage.getItem('anify-data')) {
                const response = yield fetch(`https://api.anify.tv/info/${id}`);
                data = yield response.json();
            }
            else {
                data = JSON.parse(window.sessionStorage.getItem('anify-data'));
            }
            const episodes = data.episodes.data[0].providerId === 'gogoanime' ? data.episodes.data[0].episodes : data.episodes.data[1].episodes;
            const totalEpisodes = data.totalEpisodes;
            const episodeData = { totalEpisodes: totalEpisodes,
                episodes: episodes
            };
            const episodeHolder = document.querySelector('.sub-div');
            const dropdown = document.querySelector('#episodes');
            let selectedRange = 0;
            if (episodes.length >= 100) {
                const epNum = '1';
                const minusBy = epNum.substring(1, epNum.length);
                const x = Number(epNum) - Number(minusBy);
                const numRanges = Math.ceil(episodes.length / 100);
                dropdown.innerHTML = '';
                // Populate dropdown with ranges
                for (let i = 0; i < numRanges; i++) {
                    const startRange = i * 100 + 1;
                    const endRange = Math.min((i + 1) * 100, episodes.length);
                    const optionText = `${startRange}-${endRange}`;
                    const optionElement = document.createElement("option");
                    optionElement.textContent = optionText;
                    optionElement.value = optionText;
                    dropdown.appendChild(optionElement);
                    // Check if current range includes the episode number
                    if (x >= startRange && x <= endRange) {
                        selectedRange = i;
                    }
                }
                // Set the dropdown value
                dropdown.value = `${selectedRange * 100 + 1}-${Math.min((selectedRange + 1) * 100, episodes.length)}`;
            }
            else {
                dropdown.style.display = 'none';
                selectedRange = 0;
            }
            for (let i = selectedRange * 100; i < Math.min((selectedRange + 1) * 100, episodes.length); ++i) {
                const button = document.createElement('a');
                button.textContent = `${i + 1}`;
                button.classList.add('episode-button');
                button.id = `${episodes[i].id}`;
                episodeHolder.appendChild(button);
            }
            spinner.style.display = 'none';
            const storeThis = {
                id: data.id,
                mappings: data.mappings,
                episodes: data.episodes
            };
            animeDetails.data = storeThis;
            if (!window.sessionStorage.getItem(`anify-data`)) {
                window.sessionStorage.setItem(`anify-data`, JSON.stringify(storeThis));
            }
        });
    }
    populateCards() {
        return __awaiter(this, void 0, void 0, function* () {
            const cardholder = document.querySelector('.latest-card-holder');
            const spinner = document.querySelector('.latest-card-holder > .spinner');
            console.log(`ljkaroiar[pguiwuuiop]`);
            // const data = this.recommended
            const media = animeDetails.recommended;
            console.log(media);
            if (!window.sessionStorage.getItem('recommendations')) {
                window.sessionStorage.setItem('recommendations', JSON.stringify(media));
            }
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
                animeImage.src = media[i].coverImage.extraLarge ? media[i].coverImage.extraLarge :
                    media[i].coverImage.large;
                div.appendChild(animeImage);
                div2.appendChild(title);
                div.appendChild(div2);
                div.appendChild(blur);
                cardholder.appendChild(div);
                // if(homePage.isOffScreen(div,cardholder.clientWidth)){
                //   div.classList.add('off-screen-blur')
                // }
            }
            // homePage.recommededFill()
        });
    }
    ;
    fill(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(data);
            const studioDiv = document.querySelector('.studio-div');
            const statusDiv = document.querySelector('.airing-div');
            const typeDiv = document.querySelector('.type-div');
            const genreDiv = document.querySelector('.genre-div');
            const episodeDiv = document.querySelector('.total-episode-div');
            let studios = ``;
            let genres = ``;
            for (let i = 0; i < data.studios.edges.length; i++) {
                studios += `${data.studios.edges[i].node.name}  `;
            }
            for (let i = 0; i < data.genres.length; i++) {
                if (i === data.genres.length - 1) {
                    genres += `${data.genres[i]}  `;
                }
                else {
                    genres += `${data.genres[i]},  `;
                }
            }
            console.log(data.status, data.type);
            const studioTextNode = document.createTextNode(studios);
            const genreTextNode = document.createTextNode(genres);
            const statusTextNode = document.createTextNode(data.status);
            const typeTextNode = document.createTextNode(data.type);
            studioDiv.appendChild(studioTextNode);
            genreDiv.appendChild(genreTextNode);
            statusDiv.appendChild(statusTextNode);
            typeDiv.appendChild(typeTextNode);
        });
    }
    listenToButton(e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (e.target && !(e.target.classList[0] === 'episode-button'))
                return;
            const loadingBar = document.getElementById('loading-bar');
            const clear = window.sessionStorage.getItem('anime-episode');
            if (clear) {
                window.sessionStorage.removeItem('anime-episode');
            }
            loadingBar.classList.add('loading');
            loadingBar.style.display = 'block';
            const id = e.target.id.substring(1, e.target.id.length);
            for (let i = 0; i < animeDetails.data.mappings.length; i++) {
                const lol = animeDetails.data.mappings[i].providerId;
                if (lol === 'gogoanime') {
                    window.sessionStorage.setItem('name', JSON.stringify(lol));
                }
            }
            console.log(id);
            const encodedId = encodeURIComponent(id);
            window.sessionStorage.setItem('episode', JSON.stringify(id));
            loadingBar.classList.remove('loading');
            loadingBar.classList.add('loaded');
            if (loadingBar) {
                loadingBar.style.display = 'none';
            }
            window.location.href = 'watch.html?id=' + encodedId;
        });
    }
    fillRecommended() {
    }
}
const animeDetails = new AnimeDetails();
// animeDetails.fetchOnClick()
window.addEventListener('load', animeDetails.onload);
window.addEventListener('load', animeDetails.fetchEpisodeDetails);
document.addEventListener('click', animeDetails.listenToButton);

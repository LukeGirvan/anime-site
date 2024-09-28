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
class Watch {
    constructor() {
    }
    // changeTitle(){
    //     const animeData = JSON.parse(window.sessionStorage.getItem('anime-data') as  string)
    //     const  episodeNum= (document.querySelector('.current') as HTMLButtonElement).textContent
    //     const title = animeData.title.english ? animeData.title.english : animeData.title.romaji;
    //     document.title = `Watch ${title} Episode-${episodeNum} `
    // }
    // async serverSwapFetch(id:string,  server:string,  index:number){
    //     const response = await fetch(`http://localhost:3000/anime/${server}/info?id=${id}`)
    //     const data = await  response.json()
    //     const episodeId = data.episodes[index].id
    //     watchAnime.getAltSources(episodeId,  server, index)
    // }
    // async getAltSources(episodeId:string, server:string, index:number){
    //     const response = await fetch(`http://localhost:3000/anime/${server}/watch?episodeId=${episodeId}?server=vidstreaming`)
    //     const data = await  response.json()
    //     const sources = data?.sources 
    //     let source;
    //     if(sources){
    //         const url = sources[0].url
    //         window.sessionStorage.setItem('anime-episode', JSON.stringify(url))
    //         window.dispatchEvent(new Event('animeEpisodeChange')); 
    //     }
    // }
    // changeServer(){
    //     const number = Number((document.querySelector('.current')  as HTMLAnchorElement).textContent )  -1
    //     const data = JSON.parse(window.sessionStorage.getItem('anify-data') as  string)
    //     const mappings = data.mappings
    //     let id;
    //     let cleanedString;
    //     for(let  i =0; i<mappings?.length; i++){
    //         const source = mappings[i].providerId
    //         if(source === 'zoro'){
    //             id = mappings[i].id 
    //             const indexOfQ = id.indexOf('?')
    //             cleanedString = id.substring(1, indexOfQ )
    //         }
    //     }
    //     console.log(cleanedString)
    //     watchAnime.serverSwapFetch(cleanedString,  'zoro', number)
    // }
    episodes() {
        return __awaiter(this, void 0, void 0, function* () {
            const spinner = document.querySelector('.spinner');
            const data = JSON.parse(window.sessionStorage.getItem('anime-data'));
            // let data;
            const totalEpisodes = data.nextAiringEpisode ?
                data.nextAiringEpisode.episode : data.episodes;
            const episodeHolder = document.querySelector('.sub-div');
            const dropdown = document.querySelector('#episodes');
            let selectedRange = 0;
            if (totalEpisodes >= 100) {
                const epNum = '1';
                const minusBy = epNum.substring(1, epNum.length);
                const x = Number(epNum) - Number(minusBy);
                const numRanges = Math.ceil(totalEpisodes / 100);
                dropdown.innerHTML = '';
                for (let i = 0; i < numRanges; i++) {
                    const startRange = i * 100 + 1;
                    const endRange = Math.min((i + 1) * 100, totalEpisodes);
                    const optionText = `${startRange}-${endRange}`;
                    const optionElement = document.createElement("option");
                    optionElement.textContent = optionText;
                    optionElement.value = optionText;
                    dropdown.appendChild(optionElement);
                    if (x >= startRange && x <= endRange) {
                        selectedRange = i;
                    }
                }
                dropdown.value = `${selectedRange * 100 + 1}-${Math.min((selectedRange + 1) * 100, totalEpisodes)}`;
            }
            else {
                dropdown.style.display = 'none';
                selectedRange = 0;
            }
            for (let i = selectedRange * 100; i < Math.min((selectedRange + 1) * 100, totalEpisodes); ++i) {
                const button = document.createElement('a');
                button.textContent = `${i + 1}`;
                button.classList.add('episode-button');
                // const id = 
                button.id = `-episode-${i + 1}`;
                episodeHolder.appendChild(button);
            }
            spinner.style.display = 'none';
        });
    }
    dropDownChange(e) {
        const uri = window.location.href;
        const searchParams = new URLSearchParams(uri.split('?')[1]);
        const episodeFromUrl = decodeURIComponent(searchParams.get('id'));
        console.log(episodeFromUrl);
        const value = e.target.value;
        const split = value.split('-');
        const name = JSON.parse(window.sessionStorage.getItem('name'));
        const num1 = Number(split[0]);
        const num2 = Number(split[1]);
        const dropdown = document.querySelector('#episodes');
        const div = document.querySelector('.sub-div');
        console.log(episodeFromUrl);
        div.innerHTML = '';
        for (let i = num1; i <= num2; i++) {
            const button = document.createElement('a');
            button.textContent = `${i}`;
            button.classList.add('episode-button');
            button.id = `${name}-episode-${i}`;
            if (`${name}-episode-${i}` === `${episodeFromUrl}`) {
                button.classList.add('current');
            }
            div.appendChild(button);
        }
    }
    // async getGogoEpisodes(){
    //     const uri = window.location.href
    //     const searchParams = new URLSearchParams(uri.split('?')[1]);
    //     const id = searchParams.get('id') as string
    //     console.log(id)
    //     const response = await fetch(`http://localhost:3000/anime/gogoanime/watch/${id}`)
    //     const data = await response.json()
    //     const sources  = data.sources  
    //     let url;
    //     // url=sources[0].url
    //     for(let i = 0;i<sources.length;i++ ){
    //          if (sources[i].quality === '1080p'){
    //             url=sources[i].url
    //          }
    //          if (sources[i].quality === 'default'  &&  !url){
    //             url=sources[i].url
    //          }
    //     }
    //     window.sessionStorage.setItem('anime-episode', JSON.stringify(url))
    //     window.dispatchEvent(new Event('animeEpisodeChange'));
    // }
    playTrailer() {
        const url = JSON.parse(window.sessionStorage.getItem('trailer'));
        const iframe = document.querySelector('.trailer');
        iframe.src = url;
    }
}
const dropdownMenu = document.querySelector('#episodes');
const watchAnime = new Watch();
dropdownMenu.addEventListener('change', watchAnime.dropDownChange);
// document.addEventListener('click', watchAnime.episodeChange)
// watchAnime.getGogoEpisodes()
watchAnime.episodes();
watchAnime.playTrailer();

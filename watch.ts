
class Watch{
    constructor(){

    }
    
    changeTitle(){
        const animeData = JSON.parse(window.sessionStorage.getItem('anime-data') as  string)
        const  episodeNum= (document.querySelector('.current') as HTMLButtonElement).textContent
        const title = animeData.title.english ? animeData.title.english : animeData.title.romaji;
        document.title = `Watch ${title} Episode-${episodeNum} `
    }

    async serverSwapFetch(id:string,  server:string,  index:number){
        const response = await fetch(`http://localhost:3000/anime/${server}/info?id=${id}`)
        const data = await  response.json()
        const episodeId = data.episodes[index].id
        watchAnime.getAltSources(episodeId,  server, index)
    }

    async getAltSources(episodeId:string, server:string, index:number){
        const response = await fetch(`http://localhost:3000/anime/${server}/watch?episodeId=${episodeId}?server=vidstreaming`)
        const data = await  response.json()
        const sources = data?.sources 
        let source;
        if(sources){
            const url = sources[0].url
            window.sessionStorage.setItem('anime-episode', JSON.stringify(url))
            window.dispatchEvent(new Event('animeEpisodeChange')); 
    
        }
    }


    changeServer(){
        const number = Number((document.querySelector('.current')  as HTMLAnchorElement).textContent )  -1
        const data = JSON.parse(window.sessionStorage.getItem('anify-data') as  string)
        const mappings = data.mappings

        let id;
        let cleanedString;
        for(let  i =0; i<mappings?.length; i++){
            const source = mappings[i].providerId
            if(source === 'zoro'){
                id = mappings[i].id 
                const indexOfQ = id.indexOf('?')
                cleanedString = id.substring(1, indexOfQ )
            }
        }
        console.log(cleanedString)
        watchAnime.serverSwapFetch(cleanedString,  'zoro', number)

    }


    async episodes(){
        if(!window.sessionStorage.getItem('anify-data')){
            const animeData = JSON.parse(window.sessionStorage.getItem('anime-data') as  string)
            const id =  animeData.id
            const response = await fetch(`http://api.anify.tv/info/${id}`)
            const data = await response.json()
            const div = document.querySelector('.sub-div') as HTMLDivElement;
            const uri = window.location.href;
            const searchParams = new URLSearchParams(uri.split('?')[1]);
            const episode = searchParams.get('id') as string
            const episodes = data.episodes.data[0].providerId === 'gogoanime' ? data.episodes.data[0].episodes :
            data.episodes.data[1].episodes
            const dropdown = document.querySelector('#episodes') as HTMLSelectElement;
            const start = episode.split('-');
            const epNum = start[start.length - 1];
            const minusBy = epNum.substring(1, epNum.length);
            const x = Number(epNum) - Number(minusBy);
            const numRanges = Math.ceil(episodes.length / 100);
            dropdown.innerHTML = '';
            let selectedRange = 0;

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

            // Populate episode buttons
            for (let i = selectedRange * 100; i < Math.min((selectedRange + 1) * 100, episodes.length); ++i) {
                const button = document.createElement('a');
                button.textContent = `${i + 1}`;
                button.classList.add('episode-button');
                button.id = `${episodes[i].id.substring(1, episodes[i].id.length)}`;
                if (`${episodes[i].id}` === `${episode}`) {
                    button.classList.add('current');
                }
                div.appendChild(button);
            }
        }else{
            const data = JSON.parse(window.sessionStorage.getItem('anify-data')  as  string)
            const div = document.querySelector('.sub-div') as HTMLDivElement;
            const uri = window.location.href;
            const searchParams = new URLSearchParams(uri.split('?')[1]);
            const episodes = data.episodes.data[0].providerId === 'gogoanime' ? data.episodes.data[0].episodes :
            data.episodes.data[1].episodes
            const episode = searchParams.get('id') as string
            const dropdown = document.querySelector('#episodes') as HTMLSelectElement;
            const start = episode.split('-');
            const epNum = start[start.length - 1];
            const minusBy = epNum.substring(1, epNum.length);
            const x = Number(epNum) - Number(minusBy);
            const numRanges = Math.ceil(episodes.length / 100);
            dropdown.innerHTML = '';
            let selectedRange = 0;
            
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
            
            // Populate episode buttons
            for (let i = selectedRange * 100; i < Math.min((selectedRange + 1) * 100, episodes.length); ++i) {
                const button = document.createElement('a');
                button.textContent = `${i + 1}`;
                button.classList.add('episode-button');
                button.id = `${episodes[i].id.substring(1, episodes[i].id.length)}`;
                if (`${episodes[i].id.substring(1, episodes[i].id.length)}` === `${episode}`) {
                    button.classList.add('current');
                }
                div.appendChild(button);
            }
        }
    }

    dropDownChange(e:Event){
        const uri = window.location.href
        const searchParams = new URLSearchParams(uri.split('?')[1]);
        const episodeFromUrl = decodeURIComponent(searchParams.get('id') as string)
        console.log(episodeFromUrl)
        const value = (e.target as HTMLSelectElement).value
        const split = value.split('-')
        const name = JSON.parse(window.sessionStorage.getItem('name') as string)
        const num1 = Number(split[0])
        const num2 =   Number(split[1])
        const dropdown = document.querySelector('#episodes') as  HTMLSelectElement
        const div = document.querySelector('.sub-div') as HTMLDivElement
        console.log(episodeFromUrl)
        div.innerHTML = '';
        for(let i = num1; i<=num2;i++){
            const button  = document.createElement('a')
            button.textContent= `${i}`
            button.classList.add( 'episode-button')
            button.id = `${name}-episode-${i}`
            if(`${name}-episode-${i}`=== `${episodeFromUrl}`){
                button.classList.add('current') 
            }
            div.appendChild(button)
        }
    }

    async getGogoEpisodes(){
        
        
    
        const uri = window.location.href
        const searchParams = new URLSearchParams(uri.split('?')[1]);
        const id = searchParams.get('id') as string
        console.log(id)
        const response = await fetch(`http://localhost:3000/anime/gogoanime/watch/${id}`)
        const data = await response.json()
        
        const sources  = data.sources  
        let url;
        // url=sources[0].url
        for(let i = 0;i<sources.length;i++ ){
             if (sources[i].quality === '1080p'){
                url=sources[i].url
             }
             if (sources[i].quality === 'default'  &&  !url){
                url=sources[i].url
             }
        }
        window.sessionStorage.setItem('anime-episode', JSON.stringify(url))
        window.dispatchEvent(new Event('animeEpisodeChange'));
    }


      episodeChange(e:Event){
        const target = e.target as HTMLElement
        if(target.classList[0] !== 'episode-button'
        )return;
        const current = document.querySelector('.current') as HTMLAnchorElement
        if(current){
            current.classList.remove('current')
        }
        target.classList.add('current')
        console.log(target.classList)
        watchAnime.updateId(target.id)
        watchAnime.changeTitle()
        fetch(`http://localhost:3000/anime/gogoanime/watch/${target.id}?server=vidstreaming`)
            .then(response => response.json())
            .then(data => {
                const sources = data.sources;
                console.log(sources);
                let url;
                for (let i = 0; i < sources.length; ++i) {
                    const quality = sources[i].quality;
                    if (quality === 'default') {
                        url = sources[i].url;
                    }
                    console.log(quality);
                }
                window.sessionStorage.setItem('anime-episode', JSON.stringify(url));
                window.dispatchEvent(new Event('animeEpisodeChange'));
            })
            .catch(error => {
                console.error('Error:', error);
            });

     }

      updateId(newId: string) {
        // Get the current URL
        var currentUrl: string = window.location.href;

        // Split the URL at '?'
        var parts: string[] = currentUrl.split('?');

        // Get the base URL
        var baseUrl: string = parts[0];

        // Construct the new URL with updated ID
        var newUrl: string = baseUrl + '?id=' + newId;

        // Push the new URL to history without refreshing the page
        history.pushState(null, '', newUrl);
    }

    
     
   
}

const dropdownMenu = document.querySelector('#episodes') as HTMLSelectElement
const watchAnime = new Watch()
dropdownMenu.addEventListener('change', watchAnime.dropDownChange)
document.addEventListener('click', watchAnime.episodeChange)
watchAnime.getGogoEpisodes()
watchAnime.episodes()
watchAnime.changeTitle()
const zoro = document.querySelector('.zoro') as HTMLAnchorElement
zoro.addEventListener('click', watchAnime.changeServer)
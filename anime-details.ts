
class AnimeDetails{
    data:any;
    replacement:any;
    recommended:any;

    constructor(){
        this.data = {}
        this.recommended = []
        this.replacement=['./images/background-image-replace1.jpg',
        './images/background-image-replace2.webp',
        './images/background-image-replace3.webp'];
       


    }


    onload(){
       
        const data = JSON.parse(window.sessionStorage.getItem('anime-data') as string)
        console.log(data)
        const coverImage = document.querySelector('.cover-image') as HTMLImageElement
        const divForBackground = document.querySelector('.background-image') as HTMLDivElement
        const title = document.querySelector('.anime-title') as HTMLTitleElement
        const otherTitle = document.querySelector('.other-title') as HTMLParagraphElement
        const rating = document.querySelector('.rating')  as  HTMLParagraphElement
        const randomImage = Math.floor(Math.random()*animeDetails.replacement.length)
        const ratingText = `${parseFloat(Number(data.averageScore)/10 as any)}`;
        const statusP = document.querySelector('.status') as HTMLParagraphElement
        const backgroundImgSrc = data.bannerImage ? `url(${data.bannerImage})`:`url(${animeDetails.replacement[randomImage]})`
        const totalEpisodes = data.nextAiringEpisode ?
                  data.nextAiringEpisode.episode : data.episodes;
                  console.log(totalEpisodes)
        const starIcon = document.createElement('i')
        const playButton = document.createElement('i')
        const captionIcon = document.createElement('i')
        const tv = `${totalEpisodes} eps` 
        const space = document.createTextNode('\u00A0\u00A0');
        const releasing = data.status === 'RELEASING' ? `Status: Releasing` :`Status: Finished`
        divForBackground.style.backgroundImage = `${backgroundImgSrc}`

        // const ratingTextNode = document.createTextNode(ratingText)
        captionIcon.className = "fa-solid fa-closed-captioning"
        playButton.className = "fa-solid fa-play"
        starIcon.className = 'fa-solid fa-star'
        // description.innerHTML = data.description
        const textNode1= document.createTextNode(ratingText)
        const textNode2= document.createTextNode(tv)
        const textNode3= document.createTextNode(releasing)
        // const textNode4= document.createTextNode(ratingText)
        animeDetails.fillDescription(data.idMal)
        rating.appendChild(starIcon)
        rating.appendChild(textNode1)
        rating.appendChild(space)
        rating.appendChild(playButton)
        rating.appendChild(textNode2)
        statusP.appendChild(textNode3)
        title.textContent = data.title.english
        otherTitle.textContent = data.title.romaji ? data.title.romaji :''
        
        coverImage.src = data.coverImage.extraLarge ? data.coverImage.extraLarge : data.coverImage.large 

    }
  

    async fillDescription(id:any){
      const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`)
      const data =  await response.json()
      console.log(data.data)
      const description = document.querySelector('.description-div')  as HTMLDivElement
      description.innerHTML = data.data.synopsis
    }

    async fetchAnilist(){
        const animeData = JSON.parse((window.sessionStorage.getItem('anime-data') as string));
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
              format
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
                      coverImage{
                        extraLarge
                        large
                      }
                      title {
                        romaji
                        english
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
      `;
  
      const url = 'https://graphql.anilist.co';
      const variables = {
        id:id
      }
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
  
      const response = await fetch(url, options)
      const data = await  response.json()
      console.log(data.data.Media)
      return data.data.Media;
    }


    async  fetchEpisodeDetails(){
       
        
        const data = window.sessionStorage.getItem('episode-data') ? JSON.parse(window.sessionStorage.getItem('episode-data') as  string) :
                await animeDetails.fetchAnilist()
        console.log(data)
        for(let i =0;i<data.recommendations.edges.length;i++){
            const recommendation = data.recommendations.edges[i].node.mediaRecommendation
            console.log(recommendation)
            animeDetails.recommended.push(recommendation)
        }
        console.log(animeDetails.recommended)
       
        await animeDetails.fill(data)
        await animeDetails.fillEpisodeButtons()
        
            
        if(!window.sessionStorage.getItem('episode-data')){
            const episodeData =  JSON.stringify(data)
            window.sessionStorage.setItem('episode-data', episodeData)
        }
            
       await animeDetails.populateCards()
    }
        

    cleanString(inputString: string): string {
      // Remove the "/watch/" prefix
      if (inputString.startsWith('/watch/')) {
          inputString = inputString.slice(7); // Remove the first 7 characters
      }
  
      // Remove anything after the first dot (.)
      const dotIndex = inputString.indexOf('.');
      if (dotIndex !== -1) {
          inputString = inputString.slice(0, dotIndex);
      }
  
      return inputString;
  }


    async fillEpisodeButtons(){
      
        const spinner = document.querySelector('.spinner') as  HTMLDivElement
        const data = JSON.parse(window.sessionStorage.getItem('anime-data') as string)
        // let data;
    
        const totalEpisodes = data.nextAiringEpisode ?
                  data.nextAiringEpisode.episode : data.episodes;
        
        const episodeHolder = document.querySelector('.sub-div')  as HTMLDivElement
        const dropdown = document.querySelector('#episodes') as HTMLSelectElement;
        let selectedRange = 0;
        if(totalEpisodes >=100){
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
        }else{
            dropdown.style.display ='none'
            selectedRange = 0
        }

        for(let i = selectedRange * 100; i < Math.min((selectedRange + 1) * 100, totalEpisodes); ++i){
            const button = document.createElement('a')
            button.textContent = `${i+1}`
           
            button.classList.add('episode-button')
            // const id = 
            button.id=  `-episode-${i+1}`;
            
            episodeHolder.appendChild(button)
        }
        spinner.style.display = 'none'
        
    }

   

    dropDownChange(e:Event){
      const episodeHolder = document.querySelector('.sub-div') as HTMLDivElement 

      const start = parseFloat((e.target as HTMLSelectElement).value.split('-')[0]) -1
      const end =  parseFloat((e.target as HTMLSelectElement).value.split('-')[1]) -1
      console.log(start, end)
      
      while(episodeHolder.childNodes.length > 0){
        episodeHolder.removeChild(episodeHolder.childNodes[episodeHolder.childNodes.length-1])
      }

      for(let i = start; i<=end;i++){
        const button = document.createElement('a')
        button.textContent = `${i+1}`
       
        button.classList.add('episode-button')
        
        button.id=  `-episode-${i+1}`;
        
        episodeHolder.appendChild(button)
      }
    }


    isOffScreen(element:HTMLElement, parentWidth:number){
      return element.getBoundingClientRect().left <= 0 || 
                    element.getBoundingClientRect().right >= parentWidth || 
                    element.getBoundingClientRect().left >= parentWidth

    }



    fillCardHolder(cardholder:HTMLElement,  media:any){
      for(let i = 0;i<media.length;++i){
        if(media[i].mal === null)continue;
        const div = document.createElement('div')
        const div2= document.createElement('div')
        const animeImage = document.createElement('img')
        const title = document.createElement('p')
        const blur = document.createElement('div')
        const playButton = document.createElement('img')
        const link = document.createElement('a')
        div.id= `${i}`
        link.id = `${i}`
        link.classList.add('anime-link')
        playButton.src = './images/play-button-icon-white-8.png'
        link.appendChild(playButton)
        animeImage.classList.add('anime-image')
        blur.classList.add('hover-blur')
        blur.id = `${i}`
        title.textContent = media[i].title.english ?
                media[i].title.english :
                media[i].title.romaji
        div.classList.add('image-holder')
        
        div2.classList.add('p-holder')
        div2.id = `${i}`
        playButton.classList.add('play-button')
        playButton.id = `${i}`
        blur.appendChild(link)
        blur.appendChild(title)
        animeImage.src = media[i].coverImage.extraLarge ? media[i].coverImage.extraLarge :
        media[i].coverImage.large;
        div.appendChild(animeImage)
        div2.appendChild(title)
        div.appendChild(div2)
        div.appendChild(blur)
        cardholder.appendChild(div)

        if(animeDetails.isOffScreen(div,cardholder.clientWidth)){
          div.classList.add('off-screen-blur')
        }
    }

    if(!cardholder.querySelector('.off-screen-blur')){
      const next = cardholder.parentElement?.querySelector('.carousel-next') as HTMLButtonElement
      next.style.display = 'none'
    }
    }


    async populateCards(){
        const cardholder = document.querySelector('.carousel') as HTMLDivElement 
        const spinner = document.querySelector('.carousel > .spinner') as HTMLElement
        
        // const data = this.recommended
        
        const media = animeDetails.recommended
        console.log(media)
        if(!window.sessionStorage.getItem('recommendations')){
          window.sessionStorage.setItem('recommendations', JSON.stringify(media))
        }
        
        
        if(media){
            spinner.style.display = 'none'
        }


        animeDetails.fillCardHolder(cardholder, media)
       
  
      };

    async fill(data:any){
        console.log(data)
        const studioDiv = document.querySelector('.studio-div') as  HTMLDivElement
        const statusDiv = document.querySelector('.airing-div') as  HTMLDivElement
        const typeDiv = document.querySelector('.type-div') as  HTMLDivElement
        const genreDiv = document.querySelector('.genre-div') as  HTMLDivElement
        const  episodeDiv = document.querySelector('.total-episode-div') as  HTMLDivElement
        let studios = ``
        let genres = ``

        for(let i =0;i<data.studios.edges.length;i++){
            
            if(i===data.studios.edges.length -1){
              studios += `${data.studios.edges[i].node.name}  `
             }else{
              studios += `${data.studios.edges[i].node.name},  `
             }
        }


        for(let i =0;i<data.genres.length;i++){
           if(i===data.genres.length -1){
            genres += `${data.genres[i]}  `
           }else{
            genres += `${data.genres[i]},  `
           }
        }


        console.log(data.status,data.type)
        const studioTextNode= document.createTextNode(studios)
        const genreTextNode = document.createTextNode(genres)
        const statusTextNode = document.createTextNode(data.status)
        const typeTextNode = document.createTextNode(data.format)
        studioDiv.appendChild(studioTextNode)
        genreDiv.appendChild(genreTextNode)
        statusDiv.appendChild(statusTextNode)
        typeDiv.appendChild(typeTextNode)
        
    }
    
    async  listenToButton(e: Event) {
        console.log(e.target)
        if (e.target && !((e.target as HTMLElement).classList[0] === 'episode-button')) return;
        
        const loadingBar = document.getElementById('loading-bar') as HTMLDivElement
        const clear = window.sessionStorage.getItem('anime-episode')
        if(clear){
            window.sessionStorage.removeItem('anime-episode')
        }
        loadingBar.classList.add('loading')
        loadingBar.style.display = 'block';
        
        const id = (e.target as HTMLAnchorElement).id
       
        const encodedId = encodeURIComponent(id);

        window.sessionStorage.setItem('episode', JSON.stringify(id))
        loadingBar.classList.remove('loading')
        loadingBar.classList.add('loaded')


        if (loadingBar) {
            loadingBar.style.display = 'none';
        }
        window.location.href = 'watch.html?id=' + encodedId;
    }
    
    test(e:Event){
        
      let  index;
      
      const target = e.target as HTMLElement
              
      const arr = ['hover-blur', 'image-holder', 'anime-link', 'play-button']

      if(arr.indexOf(target.classList[0]) === -1)return;

      index = target.id

      const episodeData = JSON.parse(window.sessionStorage.getItem('episode-data') as string)
      console.log(episodeData)
      const data = episodeData.recommendations.edges[index].node.mediaRecommendation
      console.log(data)
      const animeData = JSON.stringify(data)

      if(window.sessionStorage.getItem('anime-episode')){
        window.sessionStorage.removeItem('anime-episode')
      }
      if(window.sessionStorage.getItem('anime-data')){
        window.sessionStorage.removeItem('anime-data')
      }
      if(window.sessionStorage.getItem('fetch-this')){
        window.sessionStorage.removeItem('fetch-this')
      }
      if(window.sessionStorage.getItem('anify-data')){
        window.sessionStorage.removeItem('anify-data')
      }
      if(window.sessionStorage.getItem('episode-data')){
        window.sessionStorage.removeItem('episode-data')
      }
      
    
      window.sessionStorage.setItem('anime-data', animeData)
      const url = 'anime-details.html';
      window.location.href = url;
      
  }





    scrollLatestCarousel(e:Event){
      console.log(e.target)
      const cardHolder = document.querySelector('.recommended-card-holder') as HTMLDivElement
      const nextButton = document.querySelector('.next-btn1')  as HTMLButtonElement
      const prevButton = document.querySelector('.prev-btn1')  as HTMLButtonElement
      const nextSpan = document.querySelector('.recommended-next-span')  as HTMLSpanElement
      const prevSpan = document.querySelector('.recommended-prev-span')  as HTMLSpanElement
      const prevButtonDisplay = getComputedStyle(prevButton).display
      const nextButtonDisplay = getComputedStyle(nextButton).display
      const target =  (e.target as HTMLElement)
      console.log(target)
      if(target === nextButton || target === nextSpan && prevButtonDisplay === 'none'){
        prevButton.style.display = 'inline'
      }

      if(target === prevButton || target === prevSpan && nextButtonDisplay === 'none'){
        nextButton.style.display = 'inline'
      }

      const isPrev = target === prevButton || target === prevSpan ? true : false;
      const imageWidth = (cardHolder.querySelector('.image-holder') as HTMLDivElement).clientWidth
      const allImages = cardHolder.querySelectorAll('.image-holder') 
      const imagesOnScreen = cardHolder.querySelectorAll('.image-holder:not(.off-screen-blur)').length
      const gap = 32 * imagesOnScreen
      const calc = (imageWidth * imagesOnScreen ) + gap 
      const scrollBy = isPrev ? -calc : calc;
      console.log(scrollBy)
      cardHolder.scrollLeft += scrollBy

      if(cardHolder.scrollLeft === 0){
        prevButton.style.display ='none'
      }
      if(cardHolder.scrollWidth - cardHolder.scrollLeft === cardHolder.clientWidth){
        nextButton.style.display ='none'
      }

      for(let i =0;i<allImages.length;i++){
        const image = (allImages[i] as HTMLDivElement)
        if(animeDetails.isOffScreen(image, cardHolder.clientWidth)){
            image.classList.add('off-screen-blur')
        }
        if(!animeDetails.isOffScreen(image, cardHolder.clientWidth) && image.classList.contains('off-screen-blur')){
          image.classList.remove('off-screen-blur')
        }
      }
     }

}
   

const animeDetails = new AnimeDetails()

const dropdown = document.querySelector('#episodes') as HTMLSelectElement
const episodeHolder = document.querySelector('.episode-holder') as  HTMLDivElement
dropdown.addEventListener('change', animeDetails.dropDownChange)
window.addEventListener('load', animeDetails.onload)
window.addEventListener('load', animeDetails.fetchEpisodeDetails)
episodeHolder.addEventListener('click',  animeDetails.listenToButton)
document.addEventListener('click',animeDetails.test)
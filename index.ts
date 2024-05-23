
interface Results{
    title:string;
    images:{
        jpg:{
            image_url:string;
            large_image_url:string;
            small_image_url:string;
        },
        webp:{
            image_url:string;
            large_image_url:string;
            small_image_url:string;
        }
    }
    score:string;

}
interface Anime {
  id: number;
  idMal: number;
  title: {
    romaji: string;
    english: string;
  };
  coverImage: {
    extraLarge: string;
  };
  bannerImage: string;
  averageScore: number;
  description: string;
  status: string;
  recommendations: {
    edges: {
      node: {
        id: number;
        mediaRecommendation: {
          id: number;
          title: {
            romaji: string;
            english: string;
          };
        };
      };
    }[];
  };
}

interface PopularResponse {
  data: {
    Page: {
      media: Anime[];
    };
  };
}

interface Release{
    latest:{
        title:string;
    images:{
        jpg:{
            image_url:string;
            large_image_url:string;
            small_image_url:string;
        },
        webp:{
            image_url:string;
            large_image_url:string;
            small_image_url:string;
        }
    }
    score:string;

    };

    popular:{
        title:string;
        images:{
            jpg:{
                image_url:string;
                large_image_url:string;
                small_image_url:string;
            },
            webp:{
                image_url:string;
                large_image_url:string;
                small_image_url:string;
            }
        }
        score:string;
    
    };

}



class HomePage {
    index:number;
    popular: any[];
    images: any[];
    queryTimer: any;
    queryData: any[];
    lastQuery:string;
    releases:any;
    timer:any;
    animeData:any;
    start:number;
    randomIndex:any;
    constructor() {
        this.randomIndex = null;
        this.start = 0;
        this.index = 0;
        this.images = [];
        this.queryTimer = null;
        this.queryData = [];
        this.lastQuery = '';
        this.releases ={
            latest:[]
        }
        this.popular = []
        this.timer = null;
        this.animeData = {

        }
    }


    async fetchById(e:Event){
      const target  = e.target as HTMLElement
      console.log(target.id)
      const index = (e.target as HTMLElement).id
      if(window.sessionStorage.getItem('anime-episode')){
        window.sessionStorage.removeItem('anime-episode')
      }
      if(window.sessionStorage.getItem('anime-data')){
        window.sessionStorage.removeItem('anime-data')
      }
      if(window.sessionStorage.getItem('anify-data')){
        window.sessionStorage.removeItem('anify-data')
      }
      if(window.sessionStorage.getItem('fetch-this')){
        window.sessionStorage.removeItem('fetch-this')
      }
      if(window.sessionStorage.getItem('episode-data')){
        window.sessionStorage.removeItem('episode-data')
      }

      const animeDetails =JSON.stringify( homePage.popular[Number(index)])
      window.sessionStorage.setItem('anime-data',  animeDetails)
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
  }



  
  
  
    async fetchPopular(): Promise<PopularResponse> {
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
      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      };
  
      const response = await fetch(url, options);
     
      return response.json();
    }
  
    async getPopular(): Promise<void> {
      const divForBg = document.querySelector('.slide') as HTMLDivElement;
      const details = divForBg.querySelector('.details')  as  HTMLDivElement
      const spinner = document.querySelector('.spinner') as HTMLDivElement
      details.style.visibility = 'hidden'
      const cachedData = window.sessionStorage.getItem('recommended');
      let response: PopularResponse;
  
      if (cachedData) {
        response = JSON.parse(cachedData) as PopularResponse;
      } else {
        response = await this.fetchPopular();
        window.sessionStorage.setItem('recommended', JSON.stringify(response));
      }
  
      this.popular = response.data?.Page.media || response;
      
      const titleDiv = document.querySelector('.slide > .details > .recommended-title') as HTMLTitleElement;
      const ratingDiv = document.querySelector('.slide > .details > .rating') as HTMLDivElement;
      const description = document.querySelector('.slide > .details > .description') as HTMLDivElement;
      const watchButton = document.querySelector('.slide > .details > .btn') as HTMLAnchorElement;
  
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
      const starIcon = document.createElement('i')
      const playButton = document.createElement('i')
      const captionIcon = document.createElement('i')
      captionIcon.className = "fa-solid fa-closed-captioning"
      playButton.className = "fa-solid fa-play"
      starIcon.className = 'fa-solid fa-star'
      ratingDiv.appendChild(starIcon)
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
      details.style.visibility =''
      spinner.style.display ='none'
      this.popularFill();
    }
  
   


    async fetchLatest(){
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
    const start = performance.now()
    const response = await fetch(url, options)
    console.log(response)
    const data =  await response.json()
    const end = performance.now()
    console.log(end-start)
    return data

      // const response= await  fetch('http://localhost:3000/anime/gogoanime/top-airing')
      // return response.json()
    }


    async populateCards(){
        const cardholder = document.querySelector('.latest-card-holder') as HTMLDivElement 
        const spinner = document.querySelector('.latest-card-holder > .spinner') as HTMLElement
      
        const data = JSON.parse(window.sessionStorage.getItem('latest') as string) ? 
                      JSON.parse(window.sessionStorage.getItem('latest') as string) :  await homePage.fetchLatest() ;
        
        const media = data.data !== undefined ?  data.data.Page.media.filter((item: any) => item.idMal!== null) : data.filter((item: any) => item.idMal!== null);
        
        if(!window.sessionStorage.getItem('latest')){
          window.sessionStorage.setItem('latest', JSON.stringify(media))
        }
        homePage.releases.latest = media
        
        if(media){
            spinner.style.display = 'none'
        }


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
            playButton.classList.add('play-button')
            playButton.id = `${i}`
            blur.appendChild(link)
            blur.appendChild(title)
            animeImage.src = media[i].coverImage.extraLarge ? 
                    media[i].coverImage.extraLarge :
                    media[i].coverImage.large
            div.appendChild(animeImage)
            div2.appendChild(title)
            div.appendChild(div2)
            div.appendChild(blur)
            cardholder.appendChild(div)

            if(homePage.isOffScreen(div,cardholder.clientWidth)){
              div.classList.add('off-screen-blur')
            }
        }

  
            
  
        
        homePage.recommededFill()
      };
       
    

    

    cleanString(inputString:string) : string {
        // Replace all spaces with hyphens
        let cleanedString = inputString.replace(/\s+/g, '-');
        
        // Remove all special characters except hyphens
        cleanedString = cleanedString.replace(/[^\w-]/g, '-');
        
        return cleanedString.toLowerCase();
    }
 
    async getMediaById(index: number) {
      console.log(index)
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
      if(window.sessionStorage.getItem('anime-episode')){
        window.sessionStorage.removeItem('anime-episode')
      }
      if(window.sessionStorage.getItem('anime-data')){
        window.sessionStorage.removeItem('anime-data')
      }
      if(window.sessionStorage.getItem('anify-data')){
        window.sessionStorage.removeItem('anify-data')
      }
      if(window.sessionStorage.getItem('fetch-this')){
        window.sessionStorage.removeItem('fetch-this')
      }
      if(window.sessionStorage.getItem('episode-data')){
        window.sessionStorage.removeItem('episode-data')
      }

      const animeData = JSON.stringify(homePage.releases.latest[index])
      window.sessionStorage.setItem('anime-data', animeData)
      const url = 'anime-details.html';
      window.location.href = url;
    }
    
    
     recommededFill(){
    
      const arr = homePage.releases.latest ? homePage.releases.latest : JSON.parse(window.sessionStorage.getItem('latest') as string)
      const recommendedDIv = document.querySelector('.recommended2') as HTMLDivElement
      const animeImage = document.createElement('img')
      const randomIndex = Math.floor(Math.random()* arr.length)
      const title = document.createElement('h4')
      const titleDiv = document.querySelector('.recommended2 > .details > .recommended-title') as HTMLDivElement
      const descriptionPara =document.querySelector('.recommended2 > .details > .description') as HTMLParagraphElement
      const watchButton = document.createElement('a')
      const imageHolder = document.querySelector('.recommended2  > .image-holder') as HTMLDivElement
      const ratingDiv = document.querySelector('.recommended2 > .details > .rating') as HTMLDivElement 
      const ratingText = document.createTextNode(( arr[randomIndex].averageScore / 10).toString());
      const space  = document.createTextNode(`\u00A0\u00A0 `)
      const sub = document.createTextNode(`  SUB `)
      const tv = document.createTextNode(`TV `)
      const starIcon = document.createElement('i')
      const playButton = document.createElement('i')
      const captionIcon = document.createElement('i')
      captionIcon.className = "fa-solid fa-closed-captioning"
      playButton.className = "fa-solid fa-play"
      starIcon.className = 'fa-solid fa-star'
      ratingDiv.appendChild(starIcon)
      ratingDiv.appendChild(ratingText)
      ratingDiv.appendChild(space)
      ratingDiv.appendChild(playButton)
      ratingDiv.appendChild(tv)
      ratingDiv.appendChild(space.cloneNode())
      ratingDiv.appendChild(captionIcon)
      ratingDiv.appendChild(sub)
          
      watchButton.id = `${randomIndex}`
      watchButton.addEventListener('click', homePage.fetchById)
      
      titleDiv.textContent = arr[randomIndex].title.english ? arr[randomIndex].title.english  : arr[randomIndex].title.romaji ;
    
      descriptionPara.innerHTML = arr[randomIndex].description.length < 400 ?arr[randomIndex].description :arr[randomIndex].description.substring(0,400) + '...' 
      animeImage.src = arr[randomIndex].coverImage.extraLarge ? 
            arr[randomIndex].coverImage.extraLarge :  arr[randomIndex].coverImage.large;
            animeImage.classList.add('anime-image')
      imageHolder.appendChild(animeImage)
      title.textContent = arr[randomIndex].title.english ?
       arr[randomIndex].title.english : 
                      arr[randomIndex].title.romaji

   
    }


    popularFill(){
      const media = this.popular.length > 0 ? this.popular : JSON.parse(window.sessionStorage.getItem('recommended') as string)

      console.log(media)

      const spinner = document.querySelector('.popular > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)') as HTMLDivElement
      const cardholder = document.querySelector('.popular-card-holder') as HTMLDivElement
      if(media){
          spinner.style.display = 'none'
      }
      for(let i = 0;i<media.length;++i){
          if(media[i].mal === null)continue;
          const div = document.createElement('div')
          const div2= document.createElement('div')
          const animeImage = document.createElement('img')
          const title = document.createElement('p')
          const blur = document.createElement('div')
          const playButton = document.createElement('img')
          const link = document.createElement('a')
          div.setAttribute('data-index',  `${i}`)
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
          playButton.classList.add('play-button')
          playButton.id = `${i}`
          blur.appendChild(link)
          blur.appendChild(title)
          animeImage.src = media[i].coverImage.extraLarge ? 
                  media[i].coverImage.extraLarge :
                  media[i].coverImage.large
          div.appendChild(animeImage)
          div2.appendChild(title)
          div.appendChild(div2)
          div.appendChild(blur)
          cardholder.appendChild(div)

          if(homePage.isOffScreen(div, cardholder.clientWidth)){
            div.classList.add('off-screen-blur')
          }
    }
  }



     test(e:Event){
        
        let  index;
        
        const target = e.target as HTMLElement

        console.log( target.closest('.latest-release') !== null,  target.closest('.latest-release'))
        
        const arr = ['hover-blur', 'image-holder', 'anime-link', 'play-button']

        if(arr.indexOf(target.classList[0]) === -1)return;

        index = target.id
        
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
        
        const data = target.closest('.latest-release') !== null ?  homePage.releases.latest[Number(index)]: homePage.popular[Number(index)]
        const animeData = JSON.stringify(data)
        window.sessionStorage.setItem('anime-data', animeData)
        const url = 'anime-details.html';
        window.location.href = url;
        
    }









    isOffScreen(element:HTMLElement, parentWidth:number){
      return element.getBoundingClientRect().left <= 0 || 
                    element.getBoundingClientRect().right >= parentWidth || 
                    element.getBoundingClientRect().left >= parentWidth

    }




     scrollLatestCarousel(e:Event){
      const cardHolder = document.querySelector('.latest-card-holder') as HTMLDivElement
      const nextButton = document.querySelector('.next-btn1')  as HTMLButtonElement
      const prevButton = document.querySelector('.prev-btn1')  as HTMLButtonElement
      const nextSpan = document.querySelector('.latest-next-span')  as HTMLSpanElement
      const prevSpan = document.querySelector('.latest-prev-span')  as HTMLSpanElement
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
      cardHolder.scrollLeft+= scrollBy

      if(cardHolder.scrollLeft === 0){
        prevButton.style.display ='none'
      }
      if(cardHolder.scrollWidth - cardHolder.scrollLeft === cardHolder.clientWidth){
        nextButton.style.display ='none'
      }

      for(let i =0;i<allImages.length;i++){
        const image = (allImages[i] as HTMLDivElement)
        if(homePage.isOffScreen(image, cardHolder.clientWidth)){
            image.classList.add('off-screen-blur')
        }
        if(!homePage.isOffScreen(image, cardHolder.clientWidth) && image.classList.contains('off-screen-blur')){
          image.classList.remove('off-screen-blur')
        }
      }
     }


     scrollPopularCarousel(e:Event){
      const cardHolder = document.querySelector('.popular-card-holder') as HTMLDivElement
      const nextButton = document.querySelector('.next-btn2')  as HTMLButtonElement
      const prevButton = document.querySelector('.prev-btn2')  as HTMLButtonElement
      const prevButtonDisplay = getComputedStyle(prevButton).display
      const nextButtonDisplay = getComputedStyle(nextButton).display
      const target =  (e.target as HTMLElement)
      console.log(cardHolder.scrollLeft + cardHolder.clientWidth, cardHolder.scrollWidth)
      if(target === nextButton && prevButtonDisplay === 'none'){
        prevButton.style.display = 'inline'
      }

      if(target === prevButton && nextButtonDisplay === 'none'){
        nextButton.style.display = 'inline'
      }
      
      const isPrev = target === prevButton ? true : false;
      const imageWidth = (cardHolder.querySelector('.image-holder') as HTMLDivElement).clientWidth
      const allImages = cardHolder.querySelectorAll('.image-holder')
      const imagesOnScreen = cardHolder.querySelectorAll('.image-holder:not(.off-screen-blur)').length
      const gap = 32 * imagesOnScreen
      const calc = (imageWidth * imagesOnScreen ) + gap 
      const scrollBy = isPrev ? -calc : calc;
      cardHolder.scrollLeft+= scrollBy
      if(cardHolder.scrollLeft === 0){
        prevButton.style.display ='none'
      }
      if(cardHolder.scrollWidth - cardHolder.scrollLeft === cardHolder.clientWidth){
        nextButton.style.display ='none'
      }
      for(let i =0;i<allImages.length;i++){
        const image = (allImages[i] as HTMLDivElement)
        if(homePage.isOffScreen(image, cardHolder.clientWidth)){
            image.classList.add('off-screen-blur')
        }
        if(!homePage.isOffScreen(image, cardHolder.clientWidth) && image.classList.contains('off-screen-blur')){
          image.classList.remove('off-screen-blur')
        }
      }
     }



}
const homePage = new HomePage()
homePage.getPopular()
const nextButton = document.querySelector('.next-btn1') as HTMLButtonElement
const prevButton = document.querySelector('.prev-btn1') as HTMLButtonElement
const latestNextSpan = document.querySelector('.latest-next-span') as HTMLSpanElement
const latestPrevSpan = document.querySelector('.latest-prev-span') as HTMLSpanElement
const nextButton2 = document.querySelector('.next-btn2') as HTMLButtonElement
const prevButton2 = document.querySelector('.prev-btn2') as HTMLButtonElement
nextButton.addEventListener('click', homePage.scrollLatestCarousel)
prevButton.addEventListener('click', homePage.scrollLatestCarousel)
latestNextSpan.addEventListener('click', homePage.scrollLatestCarousel)
latestPrevSpan.addEventListener('click', homePage.scrollLatestCarousel)
nextButton2.addEventListener('click', homePage.scrollPopularCarousel)
prevButton2.addEventListener('click', homePage.scrollPopularCarousel)
homePage.populateCards()
document.addEventListener('click', homePage.test)


const latestCarousel = document.querySelector('.latest-card-holder')  as HTMLDivElement
latestCarousel.scrollLeft = 0;
const popularCarousel = document.querySelector('.popular-card-holder')  as HTMLDivElement
popularCarousel.scrollLeft = 0;


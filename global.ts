type Nav = 'popular' | 'latest' | 'home' | 'genre' | 'down';
type NavRelations = {
  [key:string]: () =>void;
};




class Global{
    carousels: NodeListOf<Element>;
    banners: any[];
    images: any[];
    queryTimer: any;
    queryData: any[];
    lastQuery:string;
    releases:any;
    timer:any;
    animeData:any;
    resultClicked:boolean;
    resultsDisplayed:boolean;
    constructor() {
        this.resultClicked=false;
        this.resultsDisplayed=false;
        this.carousels = document.querySelectorAll('.carousel');
        this.initializeCarousels();
        this.images = [];
        this.queryTimer = null;
        this.queryData = [];
        this.lastQuery = '';
        this.releases ={
            latest:[]
        }
        this.banners = []
        this.timer = null;
        this.animeData = {

        }
    }
    

   // script.ts

initializeCarousels() {
  console.log(this.carousels);
  this.carousels.forEach((carousel:  any) => {
    const nextButton = carousel.parentElement?.querySelector('.carousel-next') as HTMLButtonElement;
    const prevButton = carousel.parentElement?.querySelector('.carousel-prev') as HTMLButtonElement;
    const nextSpan = carousel.parentElement?.querySelector('.carousel-next-span') as HTMLSpanElement;
    const prevSpan = carousel.parentElement?.querySelector('.carousel-prev-span') as HTMLSpanElement;

    let latestIsScrolling = false;
    let latestScrollBy = 0;
    let limit = 0;
    

    const isOffScreen = (element: HTMLElement, containerWidth: number): boolean => {
      return element.getBoundingClientRect().left <= 0 || 
            element.getBoundingClientRect().right >= containerWidth || 
            element.getBoundingClientRect().left >= containerWidth;
    };

    const scrollCarousel = (e: Event) => {
      if (latestIsScrolling) return;
      latestIsScrolling = true;

      const target = e.target as HTMLElement;
      const nextArr = [nextButton, nextSpan];
      const prevArr = [prevButton, prevSpan];

      const prevSpanDisplay = getComputedStyle(prevSpan).display;
      const nextSpanDisplay = getComputedStyle(nextSpan).display;

      if (nextArr.includes(target) && prevSpanDisplay === 'none') {
        
        prevSpan.classList.toggle('show')
        prevSpan.classList.toggle('hide')
      }

      
      if (prevArr.includes(target) && nextSpanDisplay === 'none') {
        
        nextSpan.classList.toggle('show')
        nextSpan.classList.toggle('hide')
      }

      const isPrev = prevArr.includes(target);
      const imageWidth = (carousel.querySelector('.image-holder') as HTMLDivElement).clientWidth;
      const allImages = carousel.querySelectorAll('.image-holder') as NodeListOf<HTMLDivElement>;
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

      (carousel as HTMLElement).style.transform = `translateX(-${latestScrollBy}px)`;

      setTimeout(() => {
        allImages.forEach(image => {
          if (isOffScreen(image, carousel.clientWidth)) {
            image.classList.add('off-screen-blur');
          } else if (image.classList.contains('off-screen-blur')) {
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

    // const phoneScroll = (e:Event) => {
    //   const width  = document.documentElement.clientWidth
    //   const imagesOnScreen = carousel.querySelectorAll('.image-holder:not(.off-screen-blur)').length;
    //   const allImages = carousel.querySelectorAll('.image-holder') as NodeListOf<HTMLDivElement>;

    //   allImages.forEach(image => {
    //     if (isOffScreen(image, carousel.clientWidth) &&  !image.classList.contains('off-screen-blur')) {
    //       image.classList.add('off-screen-blur');
    //     } else if (image.classList.contains('off-screen-blur') && !isOffScreen(image, carousel.clientWidth)) {
    //       image.classList.remove('off-screen-blur');
    //     }
    //   })
    // }

    nextButton.addEventListener('click', scrollCarousel);
    prevButton.addEventListener('click', scrollCarousel);
    nextSpan.addEventListener('click', scrollCarousel);
    prevSpan.addEventListener('click', scrollCarousel);
    // carousel.addEventListener('scroll', phoneScroll)
    // carousel.addEventListener('touchstart', touchStart);
    // carousel.addEventListener('touchmove', touchMove);
    // carousel.addEventListener('touchend', touchEnd);
    // carousel.addEventListener('touchcancel', touchEnd);
  });
}

    


  async getGenres(){
    const query = `
    query{
      GenreCollection
    }
    `
    const url = 'https://graphql.anilist.co';
    
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {  
                query 
          }
        )
      };
      const response = await fetch(url, options)
      const data = await  response.json()
      console.log(data.data)
     return data.data.GenreCollection
    
  }

  async genreClick(e:Event){
    const genre = JSON.stringify((e.target as HTMLElement).textContent)
    globalScript.clearGridStorage()
    window.sessionStorage.setItem('grid-genre', genre)
    window.location.href = 'grid.html'
  }







  async resultClick(e:Event){
      
    if(e.target && (e.target as HTMLElement).classList[0] !== 'result' && (e.target as HTMLElement).parentElement?.classList[0] !== 'result')return;
    globalScript.resultClicked = true;
    console.log(globalScript.resultClicked)
    const target =  e.target as HTMLElement
    let index;
    if(target && target.classList[0] === 'result'){
        index = target.dataset.index
    }
    if(target && target.parentElement?.classList[0] === 'result'){
        index = target.parentElement?.dataset.index
    }
    await globalScript.fetchById(Number(index)) 
}

      formSubmit(e:Event){
        e.preventDefault()
        e.stopImmediatePropagation()
        console.log(e)
          if((e.target as HTMLElement).classList[0] !== 'mobile-search-form'
      && (e.target as HTMLElement).classList[0] !== 'search-bar'){
        return
      }
      
      const query = ((e.target as HTMLFormElement).querySelector('input') as HTMLInputElement).value
      console.log(query)

      window.sessionStorage.setItem('search-query', JSON.stringify(query));
    
      window.location.href = 'grid.html';
      }


    makeSearchBarBig(e:Event){
        const searchButton = e.target as HTMLElement
        console.log(searchButton)
        const input = document.querySelector('.search-input') as HTMLButtonElement
        searchButton.classList.remove('visible')
        searchButton.classList.add('hidden')
        input.classList.remove('hidden')
        input.classList.add('visible')
        input.style.marginLeft = '0rem' 
        input.style.width = '400px'
       
    }

    makeSearchBarSmall(e:Event){
        const target = e.target as HTMLElement
        console.log(target.classList[0]!=='search-input' && target.classList[0]!=='result' &&  !globalScript.resultsDisplayed && desktopInput.classList.contains('visible'))
        console.log(target.classList[0]!=='search-input' && target.classList[0]!=='result'&& globalScript.resultsDisplayed)

        const searchButton = document.querySelector('.fas.fa-search') as HTMLElement


    if(target.classList[0]!=='search-input' && target.classList[0]!=='fas' 
    && target.classList[0]!=='result' &&  !globalScript.resultsDisplayed && desktopInput.classList.contains('visible') ){
          const searchResultDiv = document.querySelector('.search-results') as HTMLDivElement
          const input = document.querySelector('.search-input') as HTMLInputElement
  
          
  
          searchResultDiv.classList.remove('active')
  
          while (searchResultDiv.firstChild) {
              searchResultDiv.removeChild(searchResultDiv.firstChild);
          }
      
          console.log(e)
          input.style.width = '220px'
          input.classList.remove('visible')
          input.classList.add('hidden')
          searchButton.classList.remove('hidden')
          searchButton.classList.add('visible')
          globalScript.resultsDisplayed = false;
          // globalScript.resultClicked =false
        }
        if(target.classList[0]!=='search-input' && target.classList[0]!=='result' &&  globalScript.resultsDisplayed  ){
          const searchResultDiv = document.querySelector('.search-results') as HTMLDivElement
          const input = document.querySelector('.search-input') as HTMLInputElement
  
          
  
          searchResultDiv.classList.remove('active')
  
          while (searchResultDiv.firstChild) {
              searchResultDiv.removeChild(searchResultDiv.firstChild);
          }
      
          console.log(e)
          input.classList.remove('visible')
          input.classList.add('hidden')
          searchButton.classList.remove('hidden')
          searchButton.classList.add('visible')
          globalScript.resultsDisplayed = false;
          // globalScript.resultClicked =false
        }
         if(target.classList[0]==='search-input' || target.classList[0]==='result' &&  globalScript.resultsDisplayed ){
          return;
        }

          
         
        
    }



    getSearchResults(e:Event){
        const query = (e.target as HTMLInputElement).value
        
        const searchResultDiv = document.querySelector('.search-results') as HTMLDivElement
        if(query === this.lastQuery)return
        if(searchResultDiv.childElementCount !== 0 ){
            searchResultDiv.classList.remove('active')
            while (searchResultDiv.firstChild) {
                searchResultDiv.removeChild(searchResultDiv.firstChild);
            }
        }
      
        
        clearTimeout(globalScript.queryTimer ); // Clear the previous timer

        // Start a new timer to detect when typing stops
        globalScript.queryTimer = setTimeout(() => {
        // Code to execute when typing stops
        globalScript.queryAfterStopTyping(query);
        }, 1000);

        console.log(globalScript.queryTimer )
        this.lastQuery =query
    }

    
    cleanString(inputString:string) : string {
        let cleanedString = inputString.replace(/\s+/g, '-');
        
        cleanedString = cleanedString.replace(/[^\w-]/g, '-');
        
        return cleanedString.toLowerCase();
    }



    async queryAnilist(query:string){
      const x = `
      query ($searchTerm: String) {
        Page(page: 1, perPage: 25) {
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
        }

        console.log(variables)

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {  
                query:x, 
            variables:variables 
        }
        )
      };
      const response = await fetch(url, options)
      const data = await  response.json()
      console.log(data.data.Page.media)
      return data.data.Page.media
    }

    async queryAfterStopTyping(query:string){
        
        console.log(query)
        const data = await globalScript.queryAnilist(query)
        globalScript.queryData = data
        globalScript.displaySearchResults()

    }


     



    clearSearchResults(){
      const searchResultDiv = document.querySelector('.search-results') as HTMLDivElement


      if(searchResultDiv.childElementCount !== 0 ){
        searchResultDiv.classList.remove('active')
        while (searchResultDiv.firstChild) {
            searchResultDiv.removeChild(searchResultDiv.firstChild);
        }
      }
    }



    displaySearchResults(){
      const searchResultDiv = document.querySelector('.search-results') as HTMLDivElement
      globalScript.resultsDisplayed = true
      for(let i =0;i<globalScript.queryData.length;++i){
          
        const resultDiv = document.createElement('div')
        const data  = this.queryData[i] 
        const image = document.createElement('img')
        const imageSrc = data.coverImage.extraLarge ?  data.coverImage.extraLarge :  data.coverImage.large ; 
        const title = data.title.english ?  data.title.english : data.title.romaji ; 
        const titleToadd = document.createElement('div')
        const detailsDiv = document.createElement('div')
        image.src = imageSrc
        titleToadd.textContent = title
        resultDiv.classList.add('result')
        resultDiv.appendChild(image)
        resultDiv.appendChild(titleToadd)
        resultDiv.dataset.index = `${i}`
        searchResultDiv.appendChild(resultDiv)
        console.log(imageSrc)
        console.log(title)
      
    }
    searchResultDiv.classList.add('active')
    }





    toggleMobileMenu(e:Event){
        const target = e.target as HTMLButtonElement
        const navHolder = document.querySelector('.sidebar') as HTMLDivElement
        const backgroundBlur = document.querySelector('.background-blur') as HTMLDivElement
        document.body.classList.toggle('scroll-block')
        target.classList.toggle('toggled')
        navHolder.classList.toggle('off-screen')
        backgroundBlur.classList.toggle('active')
      
    }
  
    



    



   async fetchById(index:number){
        const animeData = JSON.stringify(globalScript.queryData[index])
        if(window.sessionStorage.getItem('anime-episode')){
            window.sessionStorage.removeItem('anime-episode')
          }
          if(window.sessionStorage.getItem('anime-data')){
            window.sessionStorage.removeItem('anime-data')
          }
          if(window.sessionStorage.getItem('fetch-this')){
            window.sessionStorage.removeItem('fetch-this')
          }
          if(window.sessionStorage.getItem('episode-data')){
            window.sessionStorage.removeItem('episode-data')
          }
       
          window.sessionStorage.setItem('anime-data',  animeData)
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
    }

    navBarListener(e:Event){
      const target = (e.target as HTMLElement)
      const actionKey = target.classList[0]
     
      
      const actions :NavRelations= {
        'home-button': () => {
          
          globalScript.clearGridStorage()
          
          globalScript.goHome()
        },
        'popular-button':() => {
          const sortOption = JSON.stringify('popular')
          globalScript.clearGridStorage()
          window.sessionStorage.setItem('sort-by', sortOption)
          window.location.href= 'grid.html'
        },
        'genre-button':() => {
          const genreDropdown =   document.querySelector('.genres-holder') as HTMLDivElement
          // genreDropdown.classList.toggle('hidden')
          genreDropdown.classList.toggle('show')
          // lobalScript.displayGenres()g
        },
        'down-arrow':() => {
          const genreDropdown =   document.querySelector('.genres-holder') as HTMLDivElement
          // genreDropdown.classList.toggle('hidden')
          genreDropdown.classList.toggle('show')
          // lobalScript.displayGenres()g
        },
        'latest-button':() => {
          const sortOption = JSON.stringify('trending')
          globalScript.clearGridStorage()
          window.sessionStorage.setItem('sort-by', sortOption)
          window.location.href= 'grid.html'
        }
      }


      const executeAction = (actionKey: string) => {
        if (actions[actionKey]) {
          actions[actionKey]();
        } else {
          // console.log(`No action found for key: ${actionKey}`);
        }
      };
      executeAction(actionKey)
    }

    async addGenres(){
      let genres = JSON.parse(window.sessionStorage.getItem('genres') as string)

      if(!genres){
        genres = await globalScript.getGenres()
      }
      console.log(genres)
      const genreDropdown = document.querySelector('.genres-holder > .genres') as HTMLDivElement
      const mobileDropDown = document.querySelector('.sidebar >.list-of-links > li > .genre-list') as HTMLDivElement
     
      const nsfwGenre = 'Hentai'
      const  filteredGenres = genres.filter((genre:string) => genre!=='Hentai')
      for(let i =0;i<15;i++){
        const genre = filteredGenres[i]
        const genreAnchor = document.createElement('a')
        genreAnchor.textContent = genre
        genreDropdown.appendChild(genreAnchor)
        
      }
      for(let i =0;i<15;i++){
        const genre = filteredGenres[i]
        const listItem =  document.createElement('li')
        
        listItem.textContent = genre
     
        mobileDropDown.appendChild(listItem)
      }
    }

    clearGridStorage(){
      const genre = JSON.parse(window.sessionStorage.getItem('grid-genre')as string)
      const sortBy = JSON.parse(window.sessionStorage.getItem('sort-by')as string)
      const searchQuery = JSON.parse(window.sessionStorage.getItem('search-query')as string)
      
      for(let i =1;i<11;i++){
        if(window.sessionStorage.getItem(`page-${i}-data-${genre}`)){
          window.sessionStorage.removeItem(`page-${i}-data-${genre}`)
        }
        if(window.sessionStorage.getItem(`page-${i}-data-${sortBy}`)){
          window.sessionStorage.removeItem(`page-${i}-data-${sortBy}`)
        }
      }
      if(window.sessionStorage.getItem('grid-genre')){
        window.sessionStorage.removeItem('grid-genre')
      }
      if(window.sessionStorage.getItem('grid-query')){
        window.sessionStorage.removeItem('grid-query')
      }
      if(window.sessionStorage.getItem('page-num')){
        window.sessionStorage.removeItem('page-num')
      } 
      if(window.sessionStorage.getItem('search-query')){
        window.sessionStorage.removeItem('search-query')
      }
    }

    goHome(){
        globalScript.clearGridStorage()
        window.location.href = 'index.html'
    }

    

    mobileListener(e:Event){
        const target = (e.target as HTMLElement)
        const actionKey = target.classList[0]
      
        
        const actions :NavRelations= {
          'home-button': () => {
            
            globalScript.clearGridStorage()
            
            globalScript.goHome()
          },
          'popular-button':() => {
            const sortOption = JSON.stringify('popular')
            globalScript.clearGridStorage()
            window.sessionStorage.setItem('sort-by', sortOption)
            window.location.href= 'grid.html'
          },
          'genre-button':() => {
            const genreDropdown =document.querySelector('#list-of-links > li.genre-button > ul') as HTMLDivElement;
            genreDropdown.classList.toggle('hidden')
            genreDropdown.classList.toggle('active')
            // lobalScript.displayGenres()g
          },'down-arrow':() => {
            const genreDropdown =document.querySelector('#list-of-links > li.genre-button > ul') as HTMLDivElement;            
            genreDropdown.classList.toggle('hidden')
            genreDropdown.classList.toggle('active')
            // lobalScript.displayGenres()g
          },
          'latest-button':() => {
            const sortOption = JSON.stringify('trending')
            globalScript.clearGridStorage()
            window.sessionStorage.setItem('sort-by', sortOption)
            window.location.href= 'grid.html'
          }
      }

      const executeAction = (actionKey: string) => {
        if (actions[actionKey]) {
          actions[actionKey]();
        } else {
          // console.log(`No action found for key: ${actionKey}`);
        }
      };
      executeAction(actionKey)
}
}
const globalScript = new  Global()
const mobileNavbutton = document.querySelector('.mobile-nav-toggle') as HTMLButtonElement
const searchButton =document.querySelector(".fas.fa-search") as HTMLElement
const desktopInput = document.querySelector('.search-input') as HTMLInputElement
const desktopInputForm = document.querySelector('.search-bar') as HTMLInputElement

const mobileInputForm = document.querySelector('.mobile-search-form') as HTMLInputElement
const h1 = document.querySelector('.zanime')  as HTMLHeadingElement
const navBar = document.querySelector('.nav-bar') as HTMLDivElement
const searchResultDiv = document.querySelector('.search-results') as HTMLDivElement
const genreDropdown = document.querySelector('.genres-holder > .genres') as HTMLDivElement
const sideBar = document.querySelector('.sideBar')
const mobileGenreDropdown =document.querySelector('#list-of-links > li.genre-button > ul') as HTMLDivElement
genreDropdown.addEventListener('click', globalScript.genreClick)
mobileGenreDropdown.addEventListener('click', globalScript.genreClick)
document.addEventListener('click', globalScript.mobileListener)
globalScript.getGenres()
h1.addEventListener('click', globalScript.goHome)
searchButton.addEventListener('click', globalScript.makeSearchBarBig)
desktopInputForm.addEventListener('submit', globalScript.formSubmit)
mobileInputForm.addEventListener('submit', globalScript.formSubmit)
document.addEventListener('click', globalScript.makeSearchBarSmall)
desktopInput.addEventListener('input', globalScript.getSearchResults)
mobileNavbutton.addEventListener('click', globalScript.toggleMobileMenu)
searchResultDiv.addEventListener('click', globalScript.resultClick)
navBar.addEventListener('click', globalScript.navBarListener)
globalScript.initializeCarousels()
globalScript.addGenres()
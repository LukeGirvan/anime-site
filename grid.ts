

type SortOptions = 'popular' | 'trending';
type SortRelations = {
  [key in SortOptions]: string;
};
interface Title {
  english: string;
  userPreferred: string;
}


interface GridItem {
  averageScore: number;
  popularity:number;
  title:Title;
  // Add other properties if necessary
}



class  Grid{
    gridItems:any;
    page:number
    titles:string[]
    cardholder:HTMLDivElement;
    constructor(){
        this.gridItems = [];
        this.page = window.sessionStorage.getItem('page-num') ?
        JSON.parse(window.sessionStorage.getItem('page-num') as string) : 1; 
        this.titles = []
        this.cardholder = document.querySelector('.latest-release') as  HTMLDivElement
    }

    async queryForType(page: number) {
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
      let parsedOption: SortOptions | null = null;
      const genre =  JSON.parse(window.sessionStorage.getItem('grid-genre') as string)
      if( genre){
        option = JSON.stringify('popular')
      }
      if (option) {
        try {
          parsedOption = JSON.parse(option) as SortOptions;
        } catch (error) {
          console.error('Error parsing sort option from sessionStorage:', error);
        }
      }
      console.log(!option && genre)
     
      
      const sortRelations: SortRelations = {
        popular: 'POPULARITY_DESC',
        trending: 'TRENDING_DESC'
      };
      
      const sort: string | undefined = parsedOption ? sortRelations[parsedOption] : undefined;
      let variables;

      if(!genre){
         variables = {
          sort: [sort],
          page: page,
          status_not: 'NOT_YET_RELEASED',
          episodes_greater: 0,
        };
      }else{
         variables = {
          sort: [sort],
          page: page,
          status_not: 'NOT_YET_RELEASED',
          episodes_greater: 0,
          genre:[genre]
        };
      }
      
      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, variables })
      };
      
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
      return data.data;
    }
    


   async getGenres(){
      const query = `
      query {
        GenreCollection
      }
    `;
    const response = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();

     return data.data.GenreCollection
    }

    populateDropdown(genres:any[]) {
      const dropdown=  document.getElementById('genresDropdown') as  HTMLSelectElement;
      genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        dropdown.appendChild(option);
      });
    }






    isOffScreen(element:HTMLElement, parentWidth:number){
        return element.getBoundingClientRect().left <= 0 || 
                      element.getBoundingClientRect().right >= parentWidth || 
                      element.getBoundingClientRect().left >= parentWidth
  
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


      async addReleasing(element:HTMLElement,  status:string){
        const options:any  = {
          'RELEASING':() => {
            element.classList.add('green')
            element.textContent = status
          },'FINISHED':() => {
            element.classList.add('blue')
            element.textContent = status
          },'NOT_YET_RELEASED':() => {
            element.classList.add('red')
            element.textContent = 'NOT RELEASED'
          }
        }
        
          options[status]();
        
      }


      errorMessage(){
        const grid = document.querySelector('.grid') as HTMLDivElement
        const div = document.createElement('div')
        const errorMsg = 'No results found'
        const paragraph  =document.createElement('p')
        div.classList.add('error-div')
        div.style.width = `${grid.clientWidth}px`
        console.log(grid.clientWidth)
        paragraph.classList.add('error')
        paragraph.textContent = errorMsg
        div.appendChild(paragraph)
        grid.appendChild(div)
      }


      async queryAnilist(query:string){
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
        // console.log(data.data.Page.media)
        return data.data
      }



    async populateCards(){
        let data
        let nextPageCheck;
        const cardholder = document.querySelector('.grid') as HTMLDivElement
        // if(!cardholder.querySelector('.image-holder')){
        //   grid.page =1
        //   const sortOption = JSON.parse(window.sessionStorage.getItem('sort-by') as string)
        //   data = sortOption === 'popular' ? JSON.parse( window.sessionStorage.getItem('popular') as string) : JSON.parse( window.sessionStorage.getItem('latest') as string);
        //   grid.gridItems = data
        //   console.log('cached')
        // } else{
        //   data = await grid.queryForType(grid.page)
    
        // }
        const sortBy = JSON.parse(window.sessionStorage.getItem('sort-by') as string)
        const genre =  JSON.parse(window.sessionStorage.getItem('grid-genre') as string)
        const queryForSearch = JSON.parse(window.sessionStorage.getItem('search-query') as string)
        const pageNum = grid.page 

        if(!genre &&    pageNum === 1 && !queryForSearch){
          data = JSON.parse( window.sessionStorage.getItem(`${sortBy}`) as string)
        }
        else if(queryForSearch){
          nextPageCheck = await grid.queryAnilist(queryForSearch)
          data = nextPageCheck.Page.media
        
        }
        else if(genre && window.sessionStorage.getItem(`page-${pageNum}-data-${genre}`)){
          data = JSON.parse(window.sessionStorage.getItem(`page-${pageNum}-data-${genre}`)as string)
          console.log('cached')
        }
        else if(!genre && window.sessionStorage.getItem(`page-${pageNum}-data-${sortBy}`)){
          data = JSON.parse(window.sessionStorage.getItem(`page-${pageNum}-data-${sortBy}`)as string)
          console.log('cached')
        }
        else{
          nextPageCheck = await grid.queryForType(pageNum)
          data = nextPageCheck.Page.media
        }
        const gridDiv =document.querySelector('.grid') as HTMLDivElement

        console.log(data.length)
        


        for(let i =0;i<data.length;i++){
          grid.gridItems.push(data[i])
        }
        console.log(data)
       
        const media = data.data !== undefined ?  data.data.Page.media.filter((item: any) => item.idMal!== null) : data.filter((item: any) => item.idMal!== null);
        
        
        grid.fillCardHolder(cardholder, media)
       
        const dropDown = document.querySelector('#episodes') as  HTMLSelectElement
        const pagination = document.querySelector('.pagination') as  HTMLDivElement
        
        gridDiv.addEventListener('click', grid.test)
        pagination.style.display='flex'
        grid.pageNum()
        pagination.addEventListener('click', grid.pagination)
        // cardholder.addEventListener('mouseover', grid.hoverListener)
        grid.titles.sort((a,b) => a.localeCompare(b));
        console.log(grid.titles)
        dropDown.addEventListener('change', grid.sortByRating)
        const stringifiedData = JSON.stringify(data)

        if(genre && !window.sessionStorage.getItem(`page-${pageNum}-data-${genre}`) ){
          window.sessionStorage.setItem(`page-${pageNum}-data-${genre}`,stringifiedData )
        }
        if(sortBy && !window.sessionStorage.getItem(`page-${pageNum}-data-${sortBy}`) && !genre){
          window.sessionStorage.setItem(`page-${pageNum}-data-${sortBy}`,stringifiedData )

        }
      };

      test(e:Event){
        
        let  index;
        
        const target = e.target as HTMLElement
                
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
        if(window.sessionStorage.getItem('page-data')){
          window.sessionStorage.removeItem('page-data')
        }
        
        const data = grid.gridItems[index]
        const animeData = JSON.stringify(data)
        window.sessionStorage.setItem('anime-data', animeData)
        const url = 'anime-details.html';
        window.location.href = url;
        
    }



      fillCardHolder(cardholder:HTMLElement, media:any[]){
        for(let i = 0;i<media.length;++i){
          if(media[i].mal === null)continue;
          const div = document.createElement('div')
          const div2= document.createElement('div')
          const animeImage = document.createElement('img')
          const title = document.createElement('p')
          const blur = document.createElement('div')
          const playButton = document.createElement('img')
          const link = document.createElement('a')
          const metdaDataHolder = document.createElement('div')
          const year = document.createElement('div')
          const rating = document.createElement('div')
          const ratingText =  `${parseFloat(Number(media[i].averageScore)/10 as any)}`;
          const ratingTextNode = document.createTextNode(ratingText)
          const starIcon = document.createElement('i')
          const circleIcon = document.createElement('i')
          const  titleTextNode = document.createTextNode( media[i].title.userPreferred.length < 25 ?media[i].title.userPreferred:media[i].title.userPreferred.substring(0,23) + '...')
          const releasing = document.createElement('div')
          releasing.classList.add('releasing')
          grid.addReleasing(releasing, media[i].status)
          circleIcon.className = 'fa-solid fa-circle'
          circleIcon.classList.add(media[i].status === 'RELEASING' ? 'green' :  'blue')
          starIcon.className ='fa-solid fa-star'
          year.textContent = `${media[i].startDate.year} | ${media[i].format}`
          year.classList.add('year')
          metdaDataHolder.classList.add('meta-data')
          metdaDataHolder.appendChild(year)
          rating.className = 'rating-div'
          rating.appendChild(starIcon)
          rating.appendChild(ratingTextNode)
          metdaDataHolder.appendChild(rating)

          div.id= `${i}`
          link.id = `${i}`
          link.classList.add('anime-link')
          playButton.src = './images/play-button-icon-white-8.png'
          link.appendChild(playButton)
          animeImage.classList.add('anime-image')
          blur.classList.add('hover-blur')
          blur.id = `${i}`
          blur.appendChild(releasing)
          title.appendChild(circleIcon)
          title.appendChild(titleTextNode)
         
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
          div2.appendChild(metdaDataHolder)
          div.appendChild(div2)
          div.appendChild(blur)
          cardholder.appendChild(div)

      }
      const skeletons = document.querySelectorAll('.skeleton') as NodeListOf<HTMLElement>
      console.log(skeletons)
      if(media.length > 0){
        skeletons.forEach((skeleton) =>{
          skeleton.remove()
        })
    }
      media.forEach((element:GridItem) => {
        grid.titles.push(element.title.userPreferred)
      });
      
      }


      async loadMore(e:Event){
        e.preventDefault()
        grid.page +=1 
        const data = await grid.queryForType(grid.page)
        console.log(data)
        window.sessionStorage.setItem('grid-query',  JSON.stringify(data))
        await grid.populateCards()
      }


      sortByRating(e:Event){
        console.log(grid.gridItems)
        const option = (e.target as HTMLSelectElement).value
        const sortByOption: { [key: string]: () => void } = {
          'popular': () => {
              grid.gridItems.sort((a: GridItem, b: GridItem) => b.popularity  - a.popularity);
          },
          'rating': () => {
              grid.gridItems.sort((a: GridItem, b: GridItem) => b.averageScore - a.averageScore);
          },  
          'title-desc': () => {
            grid.gridItems.sort((a: GridItem, b: GridItem) => b.title.userPreferred.localeCompare(a.title.userPreferred));
        },'title-asc': () => {
          grid.gridItems.sort((a: GridItem, b: GridItem) => a.title.userPreferred.localeCompare(b.title.userPreferred));
      }
      };

      console.log("Before sorting:");
      console.log(grid.gridItems);
      
      sortByOption[option]();
      
      const media = grid.gridItems
      const cardholder = document.querySelector('.grid') as HTMLDivElement
      grid.changeCardHolder(cardholder, media)
      }

      changeCardHolder(cardholder:HTMLElement, media:any){
        cardholder.innerHTML = ''
        for(let i = 0;i<media.length;++i){
          if(media[i].mal === null)continue;
          const div = document.createElement('div')
          const div2= document.createElement('div')
          const animeImage = document.createElement('img')
          const title = document.createElement('p')
          const blur = document.createElement('div')
          const playButton = document.createElement('img')
          const link = document.createElement('a')
          const metdaDataHolder = document.createElement('div')
          const year = document.createElement('div')
          const rating = document.createElement('div')
          const ratingText =  `${parseFloat(Number(media[i].averageScore)/10 as any)}`;
          const ratingTextNode = document.createTextNode(ratingText)
          const starIcon = document.createElement('i')
          starIcon.className ='fa-solid fa-star'
          year.textContent = `${media[i].startDate.year} | ${media[i].format}`
          year.classList.add('year')
          metdaDataHolder.classList.add('meta-data')
          metdaDataHolder.appendChild(year)
          rating.className = 'rating-div'
          rating.appendChild(starIcon)
          rating.appendChild(ratingTextNode)
          metdaDataHolder.appendChild(rating)

          div.id= `${i}`
          link.id = `${i}`
          link.classList.add('anime-link')
          playButton.src = './images/play-button-icon-white-8.png'
          link.appendChild(playButton)
          animeImage.classList.add('anime-image')
          blur.classList.add('hover-blur')
          blur.id = `${i}`
          title.textContent = media[i].title.userPreferred
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
          div2.appendChild(metdaDataHolder)
          div.appendChild(div2)
          div.appendChild(blur)
          cardholder.appendChild(div)
      }
    }

    // hoverListener(e:Event){
    //   console.log(e.target)
    // }



    pageNum(){
      const active = document.querySelector('.active') as HTMLAnchorElement
      const pageNum = grid.page
     

      if(active && pageNum && Number(active.textContent) !== pageNum){
        const target =( document.querySelector('.pagination') as HTMLAnchorElement).children[Number(pageNum) -1]
        active.classList.remove('active')
        target.classList.add('active')
      }else{
        console.log('didnt enter if ststement')
      }
    }

    pagination(e:Event){
      const target  = e.target as HTMLElement
      console.log(target.textContent)
      if(target.classList.contains('active'))return;
    
      console.log(target)
      grid.page = Number(target.textContent)
      grid.changePage(Number(target.textContent))

    }


    changePage(pageNum:number){
      window.sessionStorage.setItem('page-num', JSON.stringify(grid.page))
      window.location.href = 'grid.html'
    }


    h2fill(){
      const h2 = document.querySelector('.h2-holder > h2') as HTMLHeadingElement
      const genre =  JSON.parse(window.sessionStorage.getItem('grid-genre') as string)
      const sortBy = JSON.parse(window.sessionStorage.getItem('sort-by') as string)
      const searchTerm = JSON.parse(window.sessionStorage.getItem('search-query') as string)
      if( genre){
        h2.textContent = genre
      } else if(searchTerm){
        h2.textContent = 'Results'
      }
      else{
        h2.textContent = sortBy.charAt(0).toUpperCase() + sortBy.slice(1);
      }
    }

}

const grid = new Grid()
window.addEventListener('load', grid.h2fill)
window.addEventListener('load',  grid.populateCards)
// grid.getGenres().then(genres => grid.populateDropdown(genres));

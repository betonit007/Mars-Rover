//NASA Mars Rover API
const camera = "NAVCAM";
const apiKey = `DEMO_KEY`
const apiUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=50&camera=${camera}&api_key=DEMO_KEY`
const resultsNav = document.getElementById('resultsNav')
const favoritesNav = document.getElementById('favoritesNav')
const imagesContainer = document.querySelector('.images-container')
const mainContainer = document.getElementById('container')
const saveConfirmed = document.querySelector('.save-confirmed')
const loader = document.querySelector('.loader')
const welcomeContainer = document.querySelector('.welcome-container')


let resultsArray = []
let favorites = {}
console.log(welcomeContainer)
function start() {
  welcomeContainer.classList.add('hidden')
  mainContainer.classList.remove('hidden')
}

function showContent(page) {
    window.scrollTo({ top: 0, behavior: 'instant'})
    if (page === 'results') {
        resultsNav.classList.remove('hidden')
        favoritesNav.classList.add('hidden')

    } else {
        resultsNav.classList.add('hidden')
        favoritesNav.classList.remove('hidden')
    }
    loader.classList.add('hidden')
}

function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites)
    currentArray.forEach((result) => {
        // Card Container   
        const card = document.createElement('div')
        card.classList.add('card')
        //Link
        const link = document.createElement('a')
        link.href = result.img_src
        link.title = 'View Full Image'
        link.target = '_blank'
        //Image
        const image = document.createElement('img')
        image.src = result.img_src
        image.alt = 'MARS Rover Pic of the day'
        image.loading = 'lazy'
        image.classList.add('card-img-top')
        //Card Body
        const cardBody = document.createElement('div')
        cardBody.classList.add('card-body')
        //Save Text
        const saveText = document.createElement('p')
        saveText.classList.add('clickable')
        if (page === 'results') {
            saveText.textContent = 'ADD To Favorites'
            saveText.setAttribute('onclick', `saveFavorite('${result.img_src}')`)
        } else {
            saveText.textContent = 'Remove Favorite'
            saveText.setAttribute('onclick', `removeFavorite('${result.img_src}')`)
        }
        //Card Title
        const cardTitle = document.createElement('h5')
        cardTitle.classList.add('card-title')
        cardTitle.textContent = result.camera.full_name
        //Card Text
        const cardText = document.createElement('p')
        cardText.textContent = `Rover name: ${result.rover.name}`
        //Footer Container
        const footer = document.createElement('small')
        footer.classList.add('text-muted')
        //Date
        const date = document.createElement('strong')
        date.textContent = result.camera.earth_date
        //Copyright
        const copyright = document.createElement('span')
        var timestamp = Number(new Date())
        copyright.textContent = `Date Taken: ${new Date(timestamp).toDateString()}`
        // Append
        footer.append(date, copyright);
        cardBody.append(cardTitle, cardText, saveText, footer)
        link.appendChild(image) //appendChild since only one object
        card.append(link, cardBody)
        imagesContainer.appendChild(card)
    })
}

function updateDOM(page) {
    //Get favorites from local storage
    if (localStorage.getItem('nasaRoverFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaRoverFavorites'))
    }
    imagesContainer.textContent = '';
    createDOMNodes(page)
    showContent(page)
}

// Get 10 Images from NASA Mars API
async function getMarsPhotos() {
    //Show loader
    loader.classList.remove('hidden')
    try {
        const res = await (await fetch(apiUrl)).json()
        console.log(res);
        resultsArray = res.photos
        updateDOM('results')
    } catch (err) {
        console.log(err)
    }
}

// Add result to Favorites
function saveFavorite(itemUrl) {
    //Loop through Results Array to select Favorite
    resultsArray.forEach((item) => {
        if (item.img_src.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            //Show saved confirmation for 2 seconds

            saveConfirmed.hidden = false
            setTimeout(() => {
                saveConfirmed.hidden = true
            }, 2500)
            localStorage.setItem('nasaRoverFavorites', JSON.stringify(favorites))
        }
    })
}

//Remove item from favorites
function removeFavorite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl]
        localStorage.setItem('nasaRoverFavorites', JSON.stringify(favorites))
        updateDOM('favorites')
    }
}

getMarsPhotos()
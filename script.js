//NASA Mars Rover API
const count = 10;
const apiKey = `DEMO_KEY`
const apiUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${count}&api_key=DEMO_KEY`
const resultsNav = document.getElementById('resultsNav')
const favoritesNav = document.getElementById('favoritesNav')
const imagesContainer = document.querySelector('.images-container')
const saveConfirmed = document.querySelector('.saved-confirmed')
const loader = document.querySelector('.loader')

let resultsArray = []
let favorites = {}

function updateDOM() {
    resultsArray.forEach((result)=> {
        // Card Container   
        const card = document.createElement('div')
        card.classList.add('card')
        //Link
        const link = document.createElement('a')
        link.href = result.img_src
        link.title = 'View Full Image'
        link.target='_blank'
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
        saveText.textContent = 'ADD to favorites'
        saveText.setAttribute('onclick', `saveFavorite('${result.img_src}')`)
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

// Get 10 Images from NASA Mars API
async function getMarsPhotos() {
    try {
        const res = await (await fetch(apiUrl)).json()
        resultsArray = res.photos
        updateDOM()
    } catch (err) {
        console.log(err)
    }
}

// Add result to Favorites
function saveFavorite(itemUrl) {
    console.log(itemUrl)
}

getMarsPhotos()
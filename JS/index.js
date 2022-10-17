const {currentDate, events} = data
events.forEach(e => e.date = new Date(e.date))
const refDate = new Date(currentDate)
const pastEvents = events.filter(e => e.date < refDate)
const upcomingEvents = events.filter(e => e.date >= refDate)
const categories = new Set(events.map(e => e.category).sort())
const indexGallery = document.getElementById('indexGallery')
const upcomingGallery = document.getElementById('upcomingGallery')
const pastGallery = document.getElementById('pastGallery')
const categoryContainer = document.getElementById('categoryContainer')
let filterEvents
let applied = {}
let checkedCat = []
categories.forEach(e => {
    let label = document.createElement('label')
    label.className = "form-check-label"
    label.innerHTML = `<input class="form-check-input" type="checkbox" value="${e}">${e}`
    categoryContainer.appendChild(label)
})
const checkbox = document.querySelectorAll('.form-check-input')
const search = document.getElementById('search')
indexGallery ? buildGallery(events, indexGallery) : null
indexGallery ? filterGallery(events, indexGallery) : null
pastGallery ? buildGallery(pastEvents, pastGallery) : null
pastGallery ? filterGallery(pastEvents, pastGallery) : null
upcomingGallery ? buildGallery(upcomingEvents, upcomingGallery) : null
upcomingGallery ? filterGallery(upcomingEvents, upcomingGallery) : null
function buildGallery(array, gallery){
    gallery.innerHTML = ""
    array.forEach(ev => {
        let card = document.createElement('article')
        card.className = 'card m-1'
        card.style = 'width: 18rem;'
        card.innerHTML = 
        `<img src="${ev.image}" class="card-img-top card__img mt-2" alt="Event image">
        <div class="card-body">
        <h5 class="card-title text-center">${ev.name}</h5>
        <p class="card-text text-center">${ev.description}</p>
        </div>
        <div class="d-flex justify-content-between align-items-baseline">
        <p>Price: $ ${ev.price}</p>
        <button id="${ev._id}" class="btn details__button bg-dark text-light">view details...</button>
        </div>`
        gallery.appendChild(card)
    })
    renderDetails(array, gallery)
}
function filterGallery(array, gallery){
    checkbox.forEach(el => el.addEventListener('change', e => {
        const selected = e.target.value.toLowerCase()
        const checked = e.target.checked
        filterEvents = new filterManager(array, 'isChecked', selected, checked)
        filterEvents.length === 0 ? gallery.innerHTML = `<h4 class="text-center text-light">No events match search</h4>` : buildGallery(filterEvents, gallery)
    }))
    search.addEventListener('click', e => {
        e.preventDefault()
        const searched = e.target.parentNode.children[0].value
        filterEvents = filterManager(array, 'isSearched', searched)
        filterEvents.length === 0 ? gallery.innerHTML = `<h4 class="text-center text-light">No events match search</h4>` : buildGallery(filterEvents, gallery)
    })
}
function filterManager(array, action, value, checkState){
    checkState ? checkedCat.push(value) : checkedCat = checkedCat.filter(cat => cat !== value)
    filterEvents = array.slice()
    applied[action] = value.toLowerCase()
    for(let name in applied){
        if(name === 'isChecked' && checkedCat.length > 0){
            let auxArray = []
            checkedCat.forEach(cat => auxArray = auxArray.concat(filterEvents.filter(ev => ev.category.toLowerCase().includes(cat))))
            filterEvents = auxArray
        }
        if(name === 'isSearched' && applied[name].length > 0){
            filterEvents = filterEvents.filter(ev => ev.name.toLowerCase().includes(applied[name].toLowerCase()))
        }
    }
    return filterEvents
}
function renderDetails(array, gallery){
    let detailsButtons = document.querySelectorAll('.details__button')
    detailsButtons.forEach(el => el.addEventListener('click', e => {
        let cardId = e.target.id
        let eventDetail = array.filter(ev => ev._id === parseInt(cardId))
        gallery.innerHTML = 
        `<div class="card ms-lg-5 me-lg-5 bg-dark text-light mt-5 mb-3" style="max-width: 80rem;">
         <div class="row g-0">
            <div class="col-md-6 align-self-center p-3">
                <img src="${eventDetail[0].image}" class="img-fluid rounded-start detail__img"
                    alt="product image">
            </div>
            <div class="col-md-6 p-3 d-flex flex-column align-items-center">
                <div class="card-body">
                    <h5 class="card-title text-center mb-3">${eventDetail[0].name}</h5>
                    <div class="row justify-content-center">
                        <div class="col">
                            <dl>
                                <dt>Date:</dt>
                                <dd>${eventDetail[0].date.toLocaleDateString()}</dd>
                                <dt>Description:</dt>
                                <dd>${eventDetail[0].description}</dd>
                                <dt>Category:</dt>
                                <dd>${eventDetail[0].category}</dd>
                            </dl>
                        </div>
                        <div class="col">
                            <dl>
                                <dt>Place:</dt>
                                <dd>${eventDetail[0].place}</dd>
                                <dt>Capacity:</dt>
                                <dd>${eventDetail[0].capacity}</dd>
                                <dt>Assistance</dt>
                                <dd>${eventDetail[0].assistance}</dd>
                                <dt>Price</dt>
                                <dd>$ ${eventDetail[0].price}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
                <button class="bg-transparent details__close">X</button>
            </div>
        </div>
    </div>`
    let closeDetails = document.querySelectorAll('.details__close')
    closeDetails.forEach(el=> el.addEventListener('click', () => buildGallery(array, gallery)))
    }))
}
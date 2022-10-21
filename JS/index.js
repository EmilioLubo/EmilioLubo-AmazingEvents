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
        <a href="${location.href}/pages/details.html?id=${ev._id}" 
            class="btn details__button bg-dark text-light">view details...</a>
        </div>`
        gallery.appendChild(card)
    })
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
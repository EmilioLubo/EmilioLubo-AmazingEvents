const {currentDate, events} = data

const refDate = new Date(currentDate)
events.map(e => {e.date = new Date(e.date)})
const pastEvents = events.filter(e => e.date < refDate)
const upcomingEvents = events.filter(e => e.date >= refDate)
const categories = new Set(events.map(e => e.category).sort())

const indexGallery = document.getElementById('indexGallery')
const upcomingGallery = document.getElementById('upcomingGallery')
const pastGallery = document.getElementById('pastGallery')
const categoryContainer = document.getElementById('categoryContainer')

categories.forEach(e => {
    let label = document.createElement('label')
    label.className = "form-check-label"
    label.innerHTML = `<input class="form-check-input" type="checkbox" value="">${e}`
    categoryContainer.appendChild(label)
})

indexGallery ? buildGallery(events, indexGallery) : null
pastGallery ? buildGallery(pastEvents, pastGallery) : null
upcomingGallery ? buildGallery(upcomingEvents, upcomingGallery) : null

function buildGallery(array, gallery){
    array.forEach(ev => {
        let card = document.createElement('article')
        card.className = 'card m-1'
        card.style = 'width: 18rem;'
        card.innerHTML = `  <img src="${ev.image}" class="card-img-top card__img mt-2" alt="Event image">
                            <div class="card-body">
                                <h5 class="card-title text-center">${ev.name}</h5>
                                <p class="card-text text-center">${ev.description}</p>
                            </div>
                            <div class="d-flex justify-content-between align-items-baseline">
                                <p>Price: $ ${ev.price}</p>
                                <a href="#" class="btn bg-dark text-light">view details...</a>
                            </div>`
        gallery.appendChild(card)
    })
}
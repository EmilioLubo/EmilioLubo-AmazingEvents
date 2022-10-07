const {currentDate, events} = data

const refDate = new Date(currentDate)

const indexGallery = document.getElementById('indexGallery')
const upcomingGallery = document.getElementById('upcomingGallery')
const pastGallery = document.getElementById('pastGallery')

const pastEvents = []
const upcomingEvents = []

let evDate
for(let ev of events){
    evDate = new Date(ev.date)
    if(evDate >= refDate){
        upcomingEvents.push(ev)
    } else{
        pastEvents.push(ev)
    }
}

if(indexGallery){
    buildGallery(events, indexGallery)
} else if(pastGallery){
    buildGallery(pastEvents, pastGallery)
} else if(upcomingGallery){
    buildGallery(upcomingEvents, upcomingGallery)
}

function buildGallery(array, gallery){
    for(let ev of array){
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
    }
}
const indexGallery = document.getElementById('indexGallery')
const upcomingGallery = document.getElementById('upcomingGallery')
const pastGallery = document.getElementById('pastGallery')
let filterEvents
let applied = {}
let checkedCat = []
switch(location.pathname.split('/').pop()){
    case 'index.html': getData('',indexGallery)
    break
    case 'upcoming.html': getData('time=upcoming&order=asc', upcomingGallery)
    break
    case 'past.html': getData('time=past&order=desc', pastGallery)
    break
}
async function getCategoriesData(){
    try{
        const res = await fetch('https://mind-hub.up.railway.app/amazing')
        const {events} = await res.json()
        const categories = new Set(events.map(e => e.category).sort())
        const categoryContainer = document.getElementById('categoryContainer')
        categories.forEach(e => {
            let label = document.createElement('label')
            label.className = "form-check-label"
            label.innerHTML = `<input class="form-check-input" type="checkbox" value="${e}">${e}`
            categoryContainer.appendChild(label)
        })
    } catch(err){
        console.log(`Error. ${err}`)
    }
}
async function getData(query, gallery){
    try{
        const res = await fetch(`https://mind-hub.up.railway.app/amazing?${query}`)
        const {events} = await res.json()
        await getCategoriesData()
        buildGallery(events, gallery)
        filterGallery(events, gallery)
    } catch(err){
        console.log(`Error. ${err}`)
    } 
}
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
        <a href="${(location.pathname.split('/').pop()) === 'index.html' ? './pages/details.html?id=' : './details.html?id='}${ev.id}" 
        class="btn details__button bg-dark text-light">view details...</a>
        </div>`
        gallery.appendChild(card)
    })
}
function filterGallery(array, gallery){
    const checkbox = document.querySelectorAll('.form-check-input')
    const search = document.getElementById('search')
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
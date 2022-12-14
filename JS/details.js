const detailId = location.search.slice(4)
getDetailsData(detailId)
async function getDetailsData(id){
    try{
        const res = await fetch(`https://mind-hub.up.railway.app/amazing/${id}`)
        const {event} = await res.json()
        event.date = new Date(event.date)
        const detailsContainer = document.getElementById('detailsContainer')
        buildDetails(event, detailsContainer)
    } catch(err){
        console.log(`Error. ${err}`)
    }
}
function buildDetails(anEvent, container){
container.innerHTML = `<div class="card ms-lg-5 me-lg-5 text-dark">
<div class="row g-0">
    <div class="col-md-6 align-self-center p-3">
        <img src="${anEvent.image}" class="img-fluid detail__img"
            alt="product image">
    </div>
    <div class="col-md-6 p-3">
        <div class="card-body">
            <h5 class="card-title text-center">${anEvent.name}</h5>
            <div class="row justify-content-center">
                <div class="col">
                    <dl>
                        <dt>Date:</dt>
                        <dd>${anEvent.date.toLocaleString()}</dd>
                        <dt>Description:</dt>
                        <dd>${anEvent.description}</dd>
                        <dt>Category:</dt>
                        <dd>${anEvent.category}</dd>
                    </dl>
                </div>
                <div class="col">
                    <dl>
                        <dt>Place:</dt>
                        <dd>${anEvent.place}</dd>
                        <dt>Capacity:</dt>
                        <dd>${anEvent.capacity}</dd>
                        <dt>Assistance:</dt>
                        <dd>${anEvent.assistance || anEvent.estimate + '(estimated)'}</dd>
                        <dt>Price</dt>
                        <dd>$ ${anEvent.price}</dd>
                    </dl>
                </div>
            </div>
        </div>
    </div>
</div>
</div>`
}
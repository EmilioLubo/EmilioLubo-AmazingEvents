const statsTable = document.getElementById('statsTable')
const upcomingTable = document.getElementById('upcomingTable')
const pastTable = document.getElementById('pastTable')
getStatsData()
getStatsCatData('upcoming', 'estimate', upcomingTable)
getStatsCatData('past', 'assistance', pastTable)
async function getStatsData(){
    try{
        const res = await fetch(`https://mind-hub.up.railway.app/amazing?time=past`)
        const {events} = await res.json()
        events.forEach(e => e.perOfAtt = ((e.assistance / e.capacity) * 100).toFixed(2))
        const highPerc = events.sort((ev1, ev2) => ev2.perOfAtt - ev1.perOfAtt)[0]
        const lowPerc = events[events.length - 1]
        const highCapacity = events.sort((ev1, ev2) => ev2.capacity - ev1.capacity)[0]
        statsTable.innerHTML += 
                                `<tr class="text-center">
                                    <td>${highPerc.name} (${highPerc.perOfAtt} %)</td>
                                    <td>${lowPerc.name} (${lowPerc.perOfAtt} %)</td>
                                    <td>${highCapacity.name} (${new Intl.NumberFormat().format(highCapacity.capacity)})</td>                        
                                </tr>`
    } catch(err){
        console.log(`Error. ${err}`)
    }
}
async function getStatsCatData(query, attendance, table){
    try{
        const res = await fetch(`https://mind-hub.up.railway.app/amazing?time=${query}`)
        const {events} = await res.json()
        events.forEach(ev => ev.revenues = ev.price * ev[attendance])
        const categories = new Set(events.map(e => e.category).sort())
        categories.forEach(cat => {
            let auxObj = {category: '', revenues: 0, capacity: 0, [attendance]: 0,}
            auxObj = events.filter(ev => ev.category === cat).reduce((ev1, ev2) => {
                return {
                    category: ev2.category,
                    revenues: ev1.revenues + ev2.revenues,
                    capacity: ev1.capacity + ev2.capacity,
                    [attendance]: ev1[attendance] + ev2[attendance],
                }
            }, auxObj)
            auxObj.perOfAtt = ((auxObj[attendance] / auxObj.capacity) * 100).toFixed(2)
            table.innerHTML += 
            `<tr class="text-center">
                <th scope="row">${auxObj.category.toUpperCase()}</th>
                <td>$ ${new Intl.NumberFormat().format(auxObj.revenues)}</td>
                <td>${auxObj.perOfAtt} %</td>
            </tr>`
        })
    } catch(err){
        console.log(`Error. ${err}`)
    }
}
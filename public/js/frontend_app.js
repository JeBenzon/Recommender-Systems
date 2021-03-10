const weatherForm = document.querySelector('form')
const search = document.querySelector('input')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const idValue = search.value

    fetch('http://localhost:3000/search?id=' + idValue).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                console.log(data.location)
                console.log(data.forecast)
            }
        })
    })
})
document.addEventListener('DOMContentLoaded', () => {
    sendRequest('/pups', renderDogBar);

    document.getElementById('good-dog-filter').addEventListener('click', handleFilterClick);
});

let FILTERED = false;

function renderDogBar(dogs) {
    const dogBar = document.getElementById('dog-bar');
    dogBar.replaceChildren();
    dogs.forEach(dog => {
        const dogSpan = document.createElement('span');
        dogSpan.id = `dog-span-${dog.id}`;
        dogSpan.className = dog.isGoodDog ? 'good-dog' : 'bad-dog';
        dogSpan.textContent = dog.name;
        dogSpan.addEventListener('click', () => handleDogBarClick(dog.id));
        dogBar.append(dogSpan);
    })
}

function showDogDetails(dog) {
    const dogInfo = document.getElementById('dog-info');
    dogInfo.replaceChildren();
    
    const dogImage = document.createElement('img');
    const dogName = document.createElement('h2');
    const dogBttn = document.createElement('button');

    dogImage.src = dog.image;
    dogName.textContent = dog.name;
    dogBttn.textContent = dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!';
    const options = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({
            isGoodDog: dog.isGoodDog ? false : true
        })
    }
    const cbSendRequest = () => {
        const cbPatchResults = (dog) => {
            showDogDetails(dog);
            sendRequest('/pups', renderDogBar);
        };
        sendRequest(`/pups/${dog.id}`, cbPatchResults, options);
    };
    dogBttn.addEventListener('click', cbSendRequest)

    dogInfo.append(dogImage, dogName, dogBttn);
}

function handleDogBarClick(dogId) {
    sendRequest(`/pups/${dogId}`, showDogDetails);
}

function handleFilterClick(e) {
    FILTERED = !FILTERED;
    sendRequest('/pups', renderDogBar);
    e.target.textContent = FILTERED ? 'Filter good dogs: ON' : 'Filter good dogs: OFF';
}

function sendRequest(endpoint, callback, options={}) {
    const parameters = FILTERED ? '?isGoodDog=true' : '';
    fetch(`http://localhost:3000${endpoint}${parameters}`, options)
        .then(resp => resp.json())
        .then(callback)
        .catch(error => {
            console.error(error);
            console.error(`Endpoint: ${endpoint}`);
            console.table(options);
        });
}
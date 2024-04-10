const api_key = "live_C3HkZwg9OxYFwRnEsJykvtEWhGRxChodU8Q7cjyYcsTTGbfk88wS79G2pdza9E8G";
let url = `https://api.thecatapi.com/v1/`;
const imageGrid = document.getElementById('grid');
let breed = "";
let imageNum;
let breedId = "";

// Create a new worker, giving it the code in "generate_favorites.js"
const worker = new Worker("./generate-favorites.js");

// When the user clicks "Generate favorites", send a message to the worker.
// The message command is "generate", and the message also contains "limit",
// which is the number of favorites to generate.
document.querySelector("#generate").addEventListener("click", () => {
    const limit = document.querySelector("#limit").value;
    worker.postMessage({
        command: "generate",
        limit,
    });
    
});

// When the worker sends a message back to the main thread,
// update the output box with a message for the user, including the number of
// primes that were generated, taken from the message data.
worker.addEventListener("message", (message) => {
    document.querySelector("#output").textContent =
        `Finished generating ${message.data[0]} favorites!`;
    //remove all existing rendered images if there are any, so that only favorite images can be made visible
    if(imageGrid.childNodes.length !== 0) {
        while(imageGrid.firstChild){
            imageGrid.removeChild(imageGrid.firstChild);
        }
    }
    //render only favorite images
    //console.log(message.data[1])
    for(let favURL of message.data[1]){
        let image = document.createElement('img');
        image.src = `${favURL}`;
        let cell = document.createElement('div');
        cell.classList.add('col');
        cell.classList.add('col-lg');
        cell.appendChild(image);
        document.getElementById('grid').appendChild(cell);
    }
});


//fetches images from TheCatAPI
async function getImages() {
    url = `https://api.thecatapi.com/v1/`;
    if(imageGrid.childNodes.length !== 0) {
        while(imageGrid.firstChild){
            imageGrid.removeChild(imageGrid.firstChild);
        }
    }
    imageNum = document.getElementById('imageNum').value;
    if(imageNum > 20 || imageNum <= 0) {
        throw new Error("Error: try a different number of images to render.");
    } else {
        url += `images/search?limit=${imageNum}`;
    }
    if(document.getElementById('breed').value != ""){
        url += `&breed_ids=${await toBreedId()}`;
        //console.log(url);
    }

    // console.log(url + `&api_key=${api_key}`)

    const fetchPromise = fetch(url + `&api_key=${api_key}`)
    let jsonPromise = null;
    fetchPromise.then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        jsonPromise = response.json();
        jsonPromise.then((data) => {
            data.map(function (dataItem) {
                let image = document.createElement('img');
                image.src = `${dataItem.url}`;
                let cell = document.createElement('div');
                cell.classList.add('col');
                cell.classList.add('col-lg');
                cell.appendChild(image);
                document.getElementById('grid').appendChild(cell);
                
                //code below adds event listeners to all images in the grid. They detect clicks and add clicked images to favorites
                image.addEventListener('click', () => {
                    image.classList.add('gold');
                    postAndGetFavorite(dataItem.id);
                    //console.log(dataItem.id);
                });

            })
        })
    })
    Promise.all([fetchPromise, jsonPromise]).catch(function(error) {
        console.log("Error fetching request: " + error);
    })
}

//converts name of cat breed that the user entered into a 4-letter breed ID to use for fetching from API
async function toBreedId() {
    breed = document.getElementById('breed').value;
    try {
        breedResponse = await fetch(`https://api.thecatapi.com/v1/breeds`);
        if (!breedResponse.ok) {
            throw new Error(`HTTP error: ${breedResponse.status}`);
        }
        let breedData = await breedResponse.json();
        //console.log(breedData)
        breedId = breedData.find(br => 
            br['name'].toLowerCase() == breed.toLowerCase()
        );
        //console.log(breedId.id)
        return breedId.id;
        // console.log(breedId)
        // console.log(breedId.id);
        // console.log(url)
        // console.log(breedData[0]['name']);
        // console.log(breedData[0]);
    } catch (error) {
        console.error(`Error while fetching cat breed: ${error}`);
    }
}

async function postAndGetFavorite(imgId) {
    //test code: finds and fetches a random image from the server
    // const url = `https://api.thecatapi.com/v1/images/search`;
    // let imgId = "";
    // await fetch(url,{headers: {
    //   'x-api-key': api_key
    // }})
    // .then((response) => {
    //   return response.json();
    // })
    // .then((data) => {
    //     imgId = data[0].id;
    // });
    //console.log(imgId)

    //creating a JSON object with image_id and subscriber id to reference the image that will be sent as new favorite
    var rawBody = JSON.stringify({ 
        "image_id": `${imgId}`,
        "sub_id":"kiki"
    });
    //console.log(rawBody);
    
    //making a new favorite and posting it to list of favorites
    const newFavorite = await fetch("https://api.thecatapi.com/v1/favourites", 
        {
            method: 'POST',
            headers: { 'x-api-key': 'live_C3HkZwg9OxYFwRnEsJykvtEWhGRxChodU8Q7cjyYcsTTGbfk88wS79G2pdza9E8G',
                       'Content-Type': 'application/json'} ,
            body: rawBody
        }
    )
    //console.log(newFavorite);
}
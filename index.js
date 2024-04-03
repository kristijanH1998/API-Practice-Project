const api_key = "live_C3HkZwg9OxYFwRnEsJykvtEWhGRxChodU8Q7cjyYcsTTGbfk88wS79G2pdza9E8G";
let url = `https://api.thecatapi.com/v1/`;
const imageGrid = document.getElementById('grid');
let breed = "";
let imageNum;
let breedId = "";

//fetches images from TheCatAPI
function getImages() {
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
    if(document.getElementById('breed').value){
        toBreedId();
    }
    const fetchPromise = fetch(url + `&api_key=${api_key}`)
    let jsonPromise = null;
    fetchPromise.then((response) => {
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
        breedId = breedData.find(br => 
            br['name'].toLowerCase() == breed.toLowerCase()
        ).id;
        url += `&breed_ids=${breedId}`;
        console.log(breedId)
        console.log(url)
        // console.log(breedData[0]['name']);
        // console.log(breedData[0]);
    } catch (error) {
        console.error(`Error while fetching cat breed: ${error}`);
    }
}
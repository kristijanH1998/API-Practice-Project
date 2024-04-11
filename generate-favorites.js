addEventListener("message", (message) => {
    if (message.data.command === "generate") {
        renderFavorites(message.data.limit, message.data.key);
        //console.log("finished rendering")
    }
});

function renderFavorites(limit, key) {
    const fav_urls = [];
    //fetching at most [limit] favorites
    const fetchPromise = fetch(`https://api.thecatapi.com/v1/favourites?limit=${limit}&sub_id=kiki&order=DESC`,{
        headers:{
            'content-type':'application/json',
            'x-api-key': key
        }
    });
    
    //console.log(fetchPromise)
    let jsonPromise = null;
    fetchPromise
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then((favorites) => {
            //console.log(favorites);
            for(let fav of favorites) {
                fav_urls.push(fav.image.url);
                //console.log(fav.url);
            }
            return fav_urls;
        }).then(output => sendResponse(limit, output));
    
    Promise.any([fetchPromise, jsonPromise]).catch(function(error) {
        console.log("Error rendering favorites: " + error);
    });

    //console.log(fav_urls)
}

function sendResponse(limit, output) {
    //console.log(output)
    postMessage([limit, output]);
}
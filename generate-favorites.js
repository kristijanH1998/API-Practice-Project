addEventListener("message", (message) => {
    if (message.data.command === "generate") {
        renderFavorites(message.data.limit);
        //console.log("finished rendering")
    }
});

function renderFavorites(limit) {
    //fetching at most [limit] favorites
    const fetchPromise = fetch(`https://api.thecatapi.com/v1/favourites?limit=${limit}&sub_id=kiki&order=DESC`,{
        headers:{
            'content-type':'application/json',
            'x-api-key': 'live_C3HkZwg9OxYFwRnEsJykvtEWhGRxChodU8Q7cjyYcsTTGbfk88wS79G2pdza9E8G'
        }
    });
    
    //console.log(fetchPromise)

    let jsonPromise = null;
    fetchPromise.then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        jsonPromise = response.json();
        //console.log(jsonPromise)
        jsonPromise.then(favorites => {
            console.log(favorites);
        });
    });

    Promise.any([fetchPromise, jsonPromise]).catch(function(error) {
        console.log("Error rendering favorites: " + error);
    });

    postMessage(limit);
}
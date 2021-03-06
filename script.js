'use strict';

//variables to store api keys
const nytApiKey = 'dNg2AMPOcHV2AxyYGAzIAtAVbIKLXVis';
const youTubeApiKey = 'AIzaSyCo5BSuKddPPzcISMFrjosVnxodyBbm2FI';

//variables to store base urls
const nytBookBaseUrl = 'https://api.nytimes.com/svc/books/v3/lists/current/';
const youTubeBaseUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&type=video&videoEmbeddable=true&key=';

function displayVideos(responseJson, targetTitleId) {
    //make variable to make access to json data easier
    const jsonVideoBase = responseJson.items;
    //make targetTitleId variable into useable format to access id in li element 
    targetTitleId = '#' + targetTitleId;
    //use loop to sort through items
    for(let i=0; i<jsonVideoBase.length; i++){
        const videoEmbedUrl = "https://www.youtube.com/embed/" + jsonVideoBase[i].id.videoId; 
        $(targetTitleId).append(`
            <iframe class="video" allowfullscreen src="${videoEmbedUrl}"></iframe>
        `)
    }
}

//call on YouTube API to get videos
function getVideos(targetTitle, targetAuthor) {
    //set up url for YouTube API and 
    targetTitle = targetTitle.toLowerCase();
    let targetTitleId = targetTitle;
    targetTitleId = targetTitleId.replace(/'/g, ""); 
    targetTitleId = targetTitleId.replace(/:/g, "");
    targetTitleId = targetTitleId.replace(/,/g, "");
    targetTitleId = targetTitleId.split('.').join("");
    targetTitleId = targetTitleId.split(' ').join('-');
    targetTitle = targetTitle.split(' ').join('%20');
    targetAuthor = targetAuthor.toLowerCase();
    targetAuthor = targetAuthor.split(' ').join('%20');
    const searchQuery = targetTitle + '%20' + targetAuthor + '%20book';
    const youTubeRequestUrl = youTubeBaseUrl + youTubeApiKey + '&q=' + searchQuery;
    //api request
    fetch(youTubeRequestUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error (response.statusText);
        })
        .then(responseJson => displayVideos(responseJson, targetTitleId))
        .catch(err => {
            alert(`Something went wrong trying to retrieve the videos, please try again later. ${err.message}`);
        });
}

//watch for video requests
function watchForVideoRequest(bookInfo) {
    $(".get-videos").click(function() {
        const bookRank = (this.id);
        let targetTitle = "";
        let targetAuthor = "";
        for(let i=0; i<Object.keys(bookInfo).length; i++) {
            if(bookRank === bookInfo[i+1].rank.toString()) {
                let selectorClassIdVideo = ".get-videos#" + bookInfo[i+1].rank.toString();
                let selectorClassIdPurchase = ".purchase#" + bookInfo[i+1].rank.toString();
                targetTitle = bookInfo[i+1].title;
                targetAuthor = bookInfo[i+1].author;
                $(selectorClassIdVideo).addClass("hide-video-button");
            }
        }
        getVideos(targetTitle, targetAuthor);
    });
}

function watchForPurchaseRequest(bookInfo) {
    $(".purchase").click(function() {
        let bookRank = (this.id);
        bookRank = bookRank.slice(9);
        for(let i=0; i<Object.keys(bookInfo).length; i++) {
            if(bookRank === bookInfo[i+1].rank.toString()) {
                window.open(bookInfo[i+1].buyLink, "_blank");
            }
        }
    })
}

//displayBooks function
function displayBooks(responseJson) {
    //clear out previous results
    $('#results').empty();
    //use for loop to sort through items
    const jsonBookBase = responseJson.results.books;
    const bookInfo = {};
    for (let i=0; i<jsonBookBase.length; i++){
        let bookTitleForId = jsonBookBase[i].title;
        bookTitleForId = bookTitleForId.toLowerCase();
        bookTitleForId = bookTitleForId.replace(/'/g, "");
        bookTitleForId = bookTitleForId.replace(/:/g, "");
        bookTitleForId = bookTitleForId.replace(/,/g, "");
        bookTitleForId = bookTitleForId.split('.').join("");
        bookTitleForId = bookTitleForId.split(' ').join('-');
        let purchaseId = "purchase-" + jsonBookBase[i].rank;
        $('#results').append(`
            <div class="result">
                <div class="img" style="background-image: url(${jsonBookBase[i].book_image})"></div>
                <section class="details">
                    <p class="title">${jsonBookBase[i].title}</p>
                    <p class="author">${jsonBookBase[i].contributor}</p>
                    <p class="description">${jsonBookBase[i].description}</p>
                    <p class="buttons">
                        <button class="get-videos" id="${jsonBookBase[i].rank}">Videos</button>
                        <button class="purchase" id="${purchaseId}">Purchase</button>
                    </p>
                    <div class="video-display" id="${bookTitleForId}">
                    </div>
                </section>
            </div>
        `);
        //add to object to use to access information later
        bookInfo[jsonBookBase[i].rank] = {};
        bookInfo[jsonBookBase[i].rank].title = jsonBookBase[i].title;
        bookInfo[jsonBookBase[i].rank].author = jsonBookBase[i].author;
        bookInfo[jsonBookBase[i].rank].rank = jsonBookBase[i].rank;
        bookInfo[jsonBookBase[i].rank].buyLink = jsonBookBase[i].amazon_product_url;
    }
    //call watchForVideoRequest function calling on dictionary holding author and title info for each book
    watchForVideoRequest(bookInfo);
    watchForPurchaseRequest(bookInfo);
}

//getBooks function
function getBooks(bookListCategory) {
    const nytBooksUrl = nytBookBaseUrl + bookListCategory + '.json?api-key=' + nytApiKey;
    //api request
    fetch(nytBooksUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error (response.statusText);
        })
        .then(responseJson => displayBooks(responseJson))
        .catch(err => {
            alert(`Something went wrong: ${err.message}`);
        });
}

//watchForm function
function watchForm() {
    //listen for submission
    $('#book-form').submit(event => {
        //prevent default form behavior
        event.preventDefault();
        const bookListCategory = $('#list-name').val();
        getBooks(bookListCategory);
    });
}

$(watchForm);
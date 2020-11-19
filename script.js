'use strict';

//variables to store api keys
const nytApiKey = 'dNg2AMPOcHV2AxyYGAzIAtAVbIKLXVis'

//variables to store base urls
const nytBookBaseUrl = 'https://api.nytimes.com/svc/books/v3/lists/current/'

//displayBooks function
function displayBooks(responseJson) {
    console.log(responseJson)
    //clear out previous results
    $('#results-list').empty();
    //use for loop to sort through items
    const jsonBookBase = responseJson.results.books;
    for (let i=0; i<jsonBookBase.length; i++){
        $('#results-list').append(`
            <li>
                <h3><a href=${jsonBookBase[i].amazon_product_url} target="_blank">${jsonBookBase[i].title}</a></h3>
                <h5>${jsonBookBase[i].contributor}</h5>
                <p>${jsonBookBase[i].description}</p>
                <img src=${jsonBookBase[i].book_image} alt="book image">
            </li>
        `)
    }
    //remove the hidden class
    $('#results').removeClass('hidden');
}

//getBooks function
function getBooks(bookListCategory) {
    const nytBooksUrl = nytBookBaseUrl + bookListCategory + '.json?api-key=' + nytApiKey;
    console.log(nytBooksUrl);
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
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

//watchForm function
function watchForm() {
    //listen for submission
    $('#book-form').submit(event => {
        //prevent default form behavior
        event.preventDefault();
        const bookListCategory = $('#list-name').val();
        console.log(bookListCategory);
        getBooks(bookListCategory);
    });
}

$(watchForm);
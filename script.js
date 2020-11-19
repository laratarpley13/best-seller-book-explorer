'use strict';

//variables to store api keys
const nytApiKey = 'dNg2AMPOcHV2AxyYGAzIAtAVbIKLXVis'

//variables to store base urls
const nytBookBaseUrl = 'https://api.nytimes.com/svc/books/v3/lists/current/'

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
        .then(responseJson => console.log(responseJson))
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
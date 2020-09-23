// Load a book up
function loadBook(filename, bookName) {

    let currentBook = "";
    let url = "app/books/" + filename;

    // reset the UI
    document.getElementById("filename").innerHTML = bookName;
    document.getElementById("search-stat").innerHTML = "";
    document.getElementById("search-term").value = "";

    // server request to load the book
    
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        // is request done (4) and good (200)
        if(xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("book-content").innerHTML = xhr.responseText;
            document.getElementById("book-content").scrollTop = 0;
        }
    };

    

}
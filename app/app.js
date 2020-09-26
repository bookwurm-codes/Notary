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
            currentBook = xhr.responseText;

            // replace line breaks and carriage returns with a <br>
            currentBook = currentBook.replace(/(?:\r\n|\n|\r)/g,"<br>");

            // replace underscores with italics
            currentBook = currentBook.replace(/_(?=[A-Za-z])/g,"<i>");
            currentBook = currentBook.replace(/(?<=[A-Za-z.])_/g,"</i>");
            
            console.log("underscores squashed");
            
            document.getElementById("book-content").innerHTML = currentBook;

            document.getElementById("book-content").scrollTop = 0;
        }
    };

    

}
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
        if (xhr.readyState == 4 && xhr.status == 200) {
            currentBook = xhr.responseText;

            getWordStats(currentBook);
            // replace line breaks and carriage returns with a <br>
            currentBook = currentBook.replace(/(?:\r\n|\n|\r)/g, "<br>");

            // replace underscores with italics
            currentBook = currentBook.replace(/_(?=[A-Za-z])/g, "<i>");
            currentBook = currentBook.replace(/(?<=[A-Za-z.])_/g, "</i>");

            document.getElementById("book-content").innerHTML = currentBook;

            document.getElementById("book-content").scrollTop = 0;
        }
    };
}

// Get the book word stats
function getWordStats(fileContent) {
    
    let bookLength = document.getElementById("book-length");
    let wordCount = document.getElementById("word-count");
    let charCount = document.getElementById("char-count");

    let text = fileContent.toLowerCase();
    let wordArray = text.match(/\b\S+\b/g);
    let wordDict = {};

    // Count up words
    for (const index in wordArray) {
        if  (wordArray.hasOwnProperty(index)) {
            const word = wordArray[index];
            if (wordDict[word] > 0) {
                wordDict[word]++;
            } else {
                wordDict[word] = 1;
            }
        }
    }
    let sortedWords = sortProperties(wordDict);
    let commonWords = sortedWords.slice(0,6);
    let leastWords = sortedWords.slice(-6,sortedWords.length);

    ULTemplate(commonWords,document.getElementById("most-common"));
}

function ULTemplate(items,element) {
    let templateHTML = document.getElementById("template-ul-items").innerHTML;

    let resultsHTML = "";

    for (let index = 0; index < items.length-1; index++) {
        resultsHTML += templateHTML.replace("{{val}}",items[index][0] + " : " + items[index][1] + " time(s)");        
    }

    element.innerHTML = resultsHTML;
}

// sort dictionary properties and return as array
function sortProperties(obj) {
    let result = Object.entries(obj);
    return result.sort((a, b) => b[1] - a[1]);
}
// Load a book up
function loadBook(filename, bookName, author) {

    let currentBook = "";
    let url = "app/books/" + filename;

    // reset the UI
    document.getElementById("filename").innerHTML = bookName;
    document.getElementById("author").innerHTML = `By ${author}`;
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


// Mark the searched word
function markWords() {
    const keyword = document.getElementById("search-term").value;
    let window = document.getElementById("book-content");
    

    let spans = document.querySelectorAll('mark');
    spans.forEach(element => {
        element.outerHTML = element.innerHTML;
    });

    // regular expression, global and case-insensitive
    const re = new RegExp(keyword, "gi");
    const markTemplate = "<mark id='markme'>$&</mark>";

    let bookContent = window.innerHTML;    
    let markedContent = bookContent.replace(re, markTemplate);
    window.innerHTML = markedContent;

    const markCount = document.querySelectorAll('mark').length;
    document.getElementById("search-stat").innerHTML = `Found ${markCount} matches`;

    if (markCount > 0) {
        element = document.getElementById("markme");
        element.scrollIntoView();
    }
}


// Get the book word stats
function getWordStats(fileContent) {
    
    let wordCount = document.getElementById("word-count");
    let charCount = document.getElementById("char-count");

    let text = fileContent.toLowerCase();
    let wordArray = text.match(/\b\S+\b/g);
    wordArray = filterOutStopWords("Eng", wordArray);

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

    // Stats!
    let sortedWords = sortProperties(wordDict);
    let commonWords = sortedWords.slice(0,6);
    let rarestWords = sortedWords.slice(-6,sortedWords.length);

    ULTemplate(commonWords,document.getElementById("most-common"));
    ULTemplate(rarestWords,document.getElementById("rarest"));
    wordCount.innerText = `Word Count: ${wordArray.length}`;
    charCount.innerText = `Character Count: ${text.length}`;
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


// Supported Lang arguments
//  "Eng" - English
function filterOutStopWords(lang, wordArray) {
    const stopWords = getStopWordsDict(lang);
    let indexedWords = [];

    wordArray.forEach(word => {
        if(!stopWords[word]) {
            indexedWords.push(word);
        }
    });

    return indexedWords;
}


// return dictionary of stop words
// Supported Lang arguments
//  "Eng" - English
function getStopWordsDict(lang) {
    let stopWordsDict = {};
    let stopWordArray = [];

    if (lang = "Eng") {
        stopWordArray = ["a", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also","although","always","am","among", "amongst", "amoungst", "amount", "an", "and", "another", "any","anyhow","anyone","anything","anyway", "anywhere", "are", "around", "as",  "at", "back","be","became", "because","become","becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom","but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven","else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "i", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own","part", "per", "perhaps", "please", "put", "rather", "re", "said", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thick", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves"];
    }

    stopWordArray.forEach(word => {
        if(!stopWordsDict[word]) {
            stopWordsDict[word] = true;
        }
    });

    return stopWordsDict;
}
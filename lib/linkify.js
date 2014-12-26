// module that given text, turns all individual works into hyperlinks
// to an online dictionary

// poor man's module
Linkify = {
    
    anchor: function (href, word) {
        var lastChar = word.charAt(word.length-1);
        switch (lastChar) {
            case '.':
            case ',':
            case '!':
            case '?':
                word = word.slice(0,-1)
                break;
            default:
                lastChar = '';
        }
        return "<a href=\""+href+word+"\" target=\"dictionary\" onclick=\"Interface.addWord('"+word+"')\">"+word+"</a>"+lastChar;
    },
    
    anchorSentences: function(href, text) {
        var words = text.split(' ');
        var anchoredWords = _.map(words, _.curry(Linkify.anchor)(href));
        return anchoredWords.join(' ');
    },
    
    process: function(href, text) {
        var paragraphs = text.split('\n');
        var anchoredParagraphs = _.map(paragraphs, _.curry(Linkify.anchorSentences)(href));
        return anchoredParagraphs.join("<br />");
    }
}
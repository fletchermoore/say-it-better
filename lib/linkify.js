// module that given text, turns all individual works into hyperlinks
// to an online dictionary

// poor man's module
Linkify = {
    
    anchor: function (href, word) {
        return "<a href=\""+href+word+"\" target=\"dictionary\" onclick=\"Interface.addWord('"+word+"')\">"+word+"</a>";
    },
    
    process: function(href, text) {
        var lineBreaksRemoved = text.split('\n').join(' ');
        var words = text.split(' ');
        var anchoredWords = _.map(words, _.curry(Linkify.anchor)(href));
        return anchoredWords.join(' ');
    }
}
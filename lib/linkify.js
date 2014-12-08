// module that given text, turns all individual works into hyperlinks
// to an online dictionary

// poor man's module
Linkify = {
    
    href: function(word) {
        return "http://www.wordreference.com/es/translation.asp?tranword="+word;
    },
    
    anchor: function (word) {
        return "<a href=\""+Linkify.href(word)+"\">"+word+"</a>";
    },
    
    lines: function(text) {
        return text.split('\n');
    },
    
    unlines: function(lines) {
        return lines.join('\n');
    },
    
    words: function(line) {
        return line.split(' ');
    },
    
    unwords: function (wordList) {
        return wordList.join(' ');
    },
    
    anchorWords: function(words) {
        return _.map(words, Linkify.anchor);
    },
    
    anchorLine: function(line) {
        return Linkify.unwords(Linkify.anchorWords(Linkify.words(line)));
    },
    
    process: function(text) {
        return Linkify.unlines(_.map(Linkify.lines(text), Linkify.anchorLine));
    }
}
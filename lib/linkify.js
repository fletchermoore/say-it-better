// module that given text, turns all individual works into hyperlinks
// to an online dictionary

// poor man's module
Linkify = {
    
    href: function(word) {
        return "http://www.wordreference.com/es/translation.asp?tranword="+word;
    },
    
    anchor: function (word) {
        return "<a href=\""+this.href(word)+"\">"+word+"</a>";
    },
    
    lines: function(text) {
        return text.split('\n');
    },
    
    words: function(line) {
        return line.split(' ');
    },
    
    process: function(text) {
      return this.anchor(text);
    }
}
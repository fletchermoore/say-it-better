Interface = {

    addWord: function(word) {
        var front = document.getElementById('frontTextarea')
        front.value = word;
        console.log(word);
    
        return true;
    }

}
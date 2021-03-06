Interface = {

    addWord: function(word) {
        var frontArea = document.getElementById('frontTextarea');
        frontArea.value = word;
        
        var results = Dictionary.find({front: word, owner: Meteor.userId()}).fetch();
        if (results.length > 0) {
            var entry = results[0];
            var backArea = document.getElementById('backTextarea')
            backArea.value = entry.back;
            
        } else {
    
        }
        
        return true;
    },
    
    truncate: function(str, limit) {
        if (str.length <= limit) {
            return str;
        } else {
            return str.slice(0,limit) + '...';
        }
    }

}
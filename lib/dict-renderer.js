DictRenderer = {
    render: function(entries) {
        var output = "";
        
        for (var i = 0; i < entries.length; i++) {
            output += entries[i].front + "\t" + entries[i].back + "\n";
        }
        
        return output;
    }
}
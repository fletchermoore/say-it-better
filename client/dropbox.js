
Template.dropboxLogin.helpers({
    hasAccessToken: function() {
        var user = Meteor.users.findOne({_id: Meteor.userId()});
        console.log(user);
        console.log(user.profile.dropboxToken)
        if (user.profile && user.profile.dropboxToken) {
            return true;
        } else {
            return false;
        }
    },
    
    accessToken: function() {
        return Meteor.user().profile.dropboxToken;
    }
})

Template.dropboxLogin.events({
    "click #exportButton": function() {
        console.log('begin export');
        
        var apiHref = 'https://api-content.dropbox.com/1/files_put/auto/'+Config.exportFilename;
        
        Meteor.http.put(apiHref, {
            headers: {
                'Authorization': 'Bearer '+Meteor.user().profile.dropboxToken
            },
            
            content: DictRenderer.render(Dictionary.find({owner: Meteor.userId()}).fetch())
            
        }, function(error, response) {
            if (error) {
                alert("problem w/ export. check console");
                console.log(error)
            } else {
                console.log(response);
                alert("Export successful");
            }
        })
        return false;
    }
})
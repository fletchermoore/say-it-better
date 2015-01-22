
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
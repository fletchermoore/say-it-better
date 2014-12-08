Texts = new Mongo.Collection("texts");

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.body.helpers({
    texts: function () {
      return Texts.find({});
    }
  });
  
  Template.body.events({
    "submit #add-text-form": function(event) {
      var text = event.target.addTextarea.value;
      Texts.insert({
        text: text,
        createdAt: new Date()
      });
      event.target.addTextarea.value = "";
      return false;
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

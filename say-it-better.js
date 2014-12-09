Texts = new Mongo.Collection("texts");

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.body.helpers({
    texts: function () {
      return _.chain(Texts.find({}).fetch())
      .pluck("text")
      .map(_.curry(Linkify.process)(Config.href))
      .map(function (x) {
        return { "text":x };
      })
      .value();
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
    },
    
    "click #emptyButton": function(event) {
      Meteor.call("emptyTexts");
      return false;
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    return Meteor.methods({
      emptyTexts: function() {
        Texts.remove({});
      }
    });
  });
}

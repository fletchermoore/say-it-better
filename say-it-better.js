Texts = new Mongo.Collection("texts");
Dictionary = new Mongo.Collection("dict");

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
    },
    
    dict: function() {
      return DictRenderer.render(Dictionary.find({}).fetch());
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
    
    "submit #save-word-form": function(event) {
      var front = event.target.frontTextarea.value;
      event.target.frontTextarea.value = "";
      var back = event.target.backTextarea.value;
      event.target.backTextarea.value = "";
      
      if (front.length > 0 && back.length > 0) {
        Dictionary.insert({
          front: front,
          back: back,
          createdAt: new Date()
        });
      }
      
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

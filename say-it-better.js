Texts = new Mongo.Collection("texts");
Dictionary = new Mongo.Collection("dict");

if (Meteor.isClient) {
  
  
  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.body.helpers({
    texts: function () {
      return _.chain(Texts.find({owner: Meteor.userId()}).fetch())
      .pluck("text")
      .map(_.curry(Linkify.process)(Config.href))
      .map(function (x) {
        return { "text":x };
      })
      .value();
    },
    
    dict: function() {
      return DictRenderer.render(Dictionary.find({owner: Meteor.userId()}).fetch());
    }
  });
  
  Template.body.events({
    "submit #add-text-form": function(event) {
      var text = event.target.addTextarea.value;
      Meteor.call("addText", text);
      event.target.addTextarea.value = "";
      return false;
    },
    
    "submit #save-word-form": function(event) {
      var front = event.target.frontTextarea.value;
      event.target.frontTextarea.value = "";
      var back = event.target.backTextarea.value;
      event.target.backTextarea.value = "";
      
      Meteor.call("addOrUpdate", front, back);
      
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
        if (! Meteor.userId()) {
          throw new Meteor.Error("not-authorized: please create an account");
        }
        
        Texts.remove({owner: Meteor.userId()});
      },
      
      addText: function(text) {
        
        if (! Meteor.userId()) {
          throw new Meteor.Error("not-authorized: please create an account");
        }
        
        Texts.insert({
          text: text,
          createdAt: new Date(),
          owner: Meteor.userId()
        });
      },
      
      addOrUpdate: function(front, back) {
          if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized: please create an account");
          }
      
          if (front.length > 0 && back.length > 0) {
            Dictionary.update({
              front: front
            }, {
              front: front,
              back: back,
              updatedAt: new Date(),
              owner: Meteor.userId()
            }, {
              upsert: true
            });      
            
          }
      }
    });
  });
}

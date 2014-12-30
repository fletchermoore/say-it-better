Texts = new Mongo.Collection("texts");
Dictionary = new Mongo.Collection("dict");

if (Meteor.isClient) {
  
  
  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.textListView.helpers({
    
    texts: function() {
      var texts = Texts.find({owner: Meteor.userId()}).fetch();
      texts = 
        _.map(texts, function(textObj) {
          
          if (textObj.textTitle) {
            var title = textObj.textTitle;
          } else {
            var title = Interface.truncate(textObj.text, Config.textTitleLength);
          }
          
          return { "id": textObj._id, "title": title };
          
        });
      return texts;
    },
    
    textsOld: function () {
      return _.chain(Texts.find({owner: Meteor.userId()}).fetch())
      .pluck("text")
      .map(_.curry(Linkify.process)(Config.href))
      .map(function (x) {
        return { "text":x };
      })
      .value();
    },
    
    
  });
  
  
  
  Template.body.helpers({
    isPage: function(page) {
      return Session.equals('view', page);
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
    
    "keyup #frontTextarea": function(event) {
      var text = event.target.value;
      var results = Dictionary.find({owner: Meteor.userId(), front: text}).fetch();
      if (results.length > 0) {
        document.getElementById('backTextarea').value = results[0].back;
      }
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
    },
    
    "click #backToTextListLink": function(event) {
      Session.set('view', 'text-list')
      return false;
    }
  });
  
  Template.textListView.events({
    "click .textTitleLink": function(event) {
      var id = event.target.getAttribute("data-title-id");
      Session.set('view', 'text-entry');
      Session.set('current-text-id', id)
      return false;
    }
  });
  
  Template.textEntryView.helpers({
    textEntry: function() {
      var textArray = Texts.find({_id: Session.get('current-text-id')}).fetch();
      var textObj = textArray[0];
      textObj.text = Linkify.process(Config.href, textObj.text);
      return textObj;
    },
  
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

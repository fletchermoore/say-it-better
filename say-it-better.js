Texts = new Mongo.Collection("texts");
Dictionary = new Mongo.Collection("dict");

//FS.HTTP.setBaseUrl('/public/uploads');

Audio = new FS.Collection("audio", {
  stores: [new FS.Store.FileSystem("audio")]
});

Audio.allow({
    insert: function() { return true; },
    update: function() { return true; },
    download: function() { return true; }
});

if (Meteor.isClient) {
  
  
  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.textListView.helpers({
    
    texts: function() {
      var texts = Texts.find({owner: Meteor.userId()}, {sort: { lastStudied: 1}}).fetch();
      texts = 
        _.map(texts, function(textObj) {
          
          if (textObj.textTitle) {
            var title = textObj.textTitle;
          } else {
            var title = Interface.truncate(textObj.text, Config.textTitleLength);
          }
          
          if (textObj.lastStudied) {
            var time = textObj.lastStudied
          } else {
            var time = "(NEW)";
          }
          
          return { "id": textObj._id, "title": title, "lastStudied": time };
          
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
  
  
  Template.textListView.events({
    "submit #add-text-form": function(event) {
      var title = event.target.addTextTitleInput.value;
      var text = event.target.addTextarea.value;
      Meteor.call("addText", title, text);
      event.target.addTextarea.value = "";
      event.target.addTextTitleInput.value = "";
      return false;
    }
  });
  
  
  
  Template.body.helpers({
    isPage: function(page) {
      return Session.equals('view', page);
    },
    
    dict: function() {
      return DictRenderer.render(Dictionary.find({owner: Meteor.userId()}).fetch());
    },
    
    dictCount: function() {
      return Dictionary.find({owner: Meteor.userId()}).fetch().length;
    }
  });
  
  Template.body.events({
    
    
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
  
  Template.textEntryView.events({
    "click #editTextLink": function(event) {
      Session.set('view', 'text-entry-edit');
      return false;
    },
    
    "click #markStudiedButton": function(event) {
      Meteor.call('updateLastStudied', Session.get('current-text-id'), function(err, time) {
        document.getElementById('lastStudiedValue').text = time;
      })
      
      
    }
  });
  
  Template.textEntryEditView.helpers({
    textEntry: function() {
      var results = Texts.find({_id: Session.get('current-text-id')}).fetch();
      console.log(results);
      return results[0];
    }
  })
  
  Template.textEntryEditView.events({
    "click #cancelButton": function(event) {
      Session.set('view', 'text-entry');
      return false;
    },
    
    "submit #edit-text-form": function(event) {
      var id = Session.get('current-text-id');
      var title = event.target.textTitleInput.value;
      var body = event.target.textBodyTextarea.value;
      Meteor.call("updateText", id, title, body);
      Session.set('view', 'text-entry');
      return false;
    }
  })
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
      
      addText: function(title, body) {
        
        if (! Meteor.userId()) {
          throw new Meteor.Error("not-authorized: please create an account");
        }
        
        Texts.insert({
          textTitle: title,
          text: body,
          createdAt: new Date(),
          owner: Meteor.userId()
        });
      },
      
      updateText: function(id, title, body) {
        if (! Meteor.userId()) {
          throw new Meteor.Error("not-authorized: please create an account");
        }
        
        Texts.update({
          _id: id
        },
        {
          $set: { 
            textTitle: title,
            text: body
          }
        });
        
      },
      
      updateLastStudied: function(id) {
        var time = new Date();
        Texts.update({_id: id},
        {$set: {
          lastStudied: time
        }});
        return time;
      },
      
      attachAudio: function(id, audio) {
        if (! Meteor.userId()) {
          throw new Meteor.Error("not-authorized: please create an account");
        }
        
        console.log('attaching audio')
        console.log(id)
        console.log(audio)
        
        Texts.update({
          _id: id
        },
        {
          $set: {
            audio: audio._id
          }
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

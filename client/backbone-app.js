
var Chatroom = Backbone.Model.extend({
  url: 'http://127.0.0.1:8080/classes/rooms'
});

var newMessage = Backbone.Model.extend({
  url: 'http://127.0.0.1:8080/classes/messages'
});

var Message = newMessage.extend({
  // reads the message object's "objectId" attribute and saves ID as that
  idAttribute :'messageid',

  initialize: function(){
    // makes date readable
    // need to comment out since Date is now epoch time
    // var date = new Date((this.get('createdAt') || "")
    //   .replace(/-/g,"/")
    //   .replace(/[TZ]/g," "))
    // date = date.getMonth().toString()+'/'
    //   +date.getDate().toString()+ ' @ '
    //   +date.getHours().toString()+':'
    //   +date.getMinutes().toString();
    // this.set('createdAt',date);
  },

  render : function(){
    return _.template('<div class ="<%- messageid %>"><%- roomname %> - <%- createdAt %> -- <%- username %>: <%- text %></div>',this.attributes);
  }

});

var AllMessages = Backbone.Collection.extend({

  model: Message, // no parens because Message is a class
  url: 'http://127.0.0.1:8080/classes/messages',
  maximumMessagesAllowed: 10,

  initialize: function(){
    var that = this;
    this.fetchMessages();
    setInterval(function(){that.fetchMessages();},1000);
  },

  fetchMessages: function(){
    var that = this;
    this.fetch({
      // need to comment out unless we can accept limits
      // data: {
      //   'order': '-createdAt',
      //   'limit': this.maximumMessagesAllowed
      // },
      success: function(model, data){
      }
    });
  }
});

var MessageViewer = Backbone.View.extend({

  initialize: function(){
    // this.collection.on('remove',this.remove,this);
    this.collection.on('add',this.add,this);
    this.countMessages = 0;
    this.roomname = 'lobby';

    var that = this;

    $('.inputbutton').on('click',function(){
      that.sendMessage();
    });
    $('.roombutton').on('click',function(){
      that.changeRoom();
    });

  },

  add: function(e){
    console.log('add');

    // if(this.countMessages > this.collection.maximumMessagesAllowed){
    //   this.$el.first().remove();
    // }
    this.$el.append(this.collection.get(e).render());
    this.countMessages++;
  },

  change: function(e){
    console.log('change');
  },

  changeRoom: function(){
    this.roomname = $('.roombox').val() || 'lobby';
    $('.roombox').val('');
    this.render(this.roomname);
    var newRoom = new Chatroom({roomname:this.roomname});
    newRoom.save();
  },

  merge: function(e){
    console.log('merge');
  },

  remove: function(e){
    console.log('remove');
    $('.'+e.get('objectId')).remove();
  },

  render: function(roomname){
    this.$el.empty();
    var allRoomMessage = this.collection.models.map(function(item){
      if (item.get('roomname') === roomname) {
        return item.render();
      }
    });
    for (var i = 0; i<allRoomMessage.length; i++){
      this.$el.append(allRoomMessage[i]);
    }
  },

  sendMessage: function(){
    var model = new newMessage({
      text:$('.inputbox').val(),
      username: window.location.search.slice(window.location.search.indexOf('=')+1) || 'Guest',
      roomname: this.roomname
    });
    $('.inputbox').val('');
    model.save();
  }
});




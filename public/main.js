$(function(){ 

// Create a new Firebase reference, and a new instance of the Login client
var ref = new Firebase('https://burning-torch-2543.firebaseio.com/lobby');

app.login = function() {
  ref.authWithCustomToken(localStorage.firebaseToken, function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Login Succeeded!", authData);
      makeChat(authData);
    }
  });
}

function makeChat(authData) { 
  var chat = new Firechat(ref);
  chat.setUser(authData.auth.uid, authData.auth.username, function(user) {
    chat.resumeSession();
  });
}

app.getTokenFromServer = function() {
  $.ajax({
    method: 'GET',
    url: './gettoken',
    success: saveToken,
    error: function(err) {
      console.log('error =', err);
    }
  })
}

function saveToken(token) {
  window.localStorage['firebaseToken'] = token; 
}





// REGISTER DOM ELEMENTS
var messageField = $('#messageInput');
var nameField = $('#nameInput');
var messageList = $('#example-messages');

// LISTEN FOR KEYPRESS EVENT
messageField.keypress(function (e) {
  if (e.keyCode == 13) {
    //FIELD VALUES
    var username = nameField.val();
    var message = messageField.val();
    console.log('username =', username);
    console.log('message =', message);    

    //SAVE DATA TO FIREBASE AND EMPTY FIELD
    ref.push({name:username, text:message});
    messageField.val('');
  }
});

// Add a callback that is triggered for each chat message.
ref.limitToLast(10).on('child_added', function (snapshot) {
  //GET DATA
  var data = snapshot.val();
  var username = data.name || "anonymous";
  var message = data.text;

  //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
  var messageElement = $("<li>");
  var nameElement = $("<strong class='example-chat-username'></strong>:")
  nameElement.text(username + ": ");
  messageElement.text(message).prepend(nameElement);

  //ADD MESSAGE
  messageList.append(messageElement)

  //SCROLL TO BOTTOM OF MESSAGE LIST
  messageList[0].scrollTop = messageList[0].scrollHeight;
});
});

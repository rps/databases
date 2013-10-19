//IGNORE THIS
//
if (!/(&|\?)username=/.test(window.location.search)) {
  var newSearch = window.location.search;
  if (newSearch !== '' & newSearch !== '?') {
    newSearch += '&';
  }
  var inputName = (prompt('What is your name?') || 'anonymous');
  newSearch += 'username=' + inputName;
  window.location.search = newSearch;
  $.ajax({
    url:'http://127.0.0.1:8080/createUser',
    data: {name:inputName},
    type:'POST',
    success: function(data, status, dataObject){
      console.log(data, '\n\n\n\n\n\n\n', status, '\n\n\n\n\n\n\n\n', dataObject);
    }
  });

  //if the name isn't in the DB, ask for a new password

  //if it IS in the DB
}


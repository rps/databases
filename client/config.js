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
  $.ajax({url:'http://127.0.0.1:8080/createUser', data: {name:inputName}, type:'POST'});
}

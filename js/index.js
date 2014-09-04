var React = require('react/addons');

var immutable = require('immutable');
var TodosApp = require('./todos_app');

var state = immutable.fromJS({
  filter: 'All',
  todos: [
    {id: 1, description: 'A todo', completed: true},
    {id: 2, description: 'Another todo', editing: true},
    {id: 3, description: 'Yet another todo'},
  ]
});

var states = [];
window.undo = undo;
function undo() {
  if (states.length == 1) return;
  states.pop();
  var prevState = states.pop();
  render(prevState);
}

function render(state) {
  states.push(state);
  var component = TodosApp({
    state: state.cursor(render)
  });
  React.renderComponent(component, root);
}

var root = document.getElementById('todoapp');
render(state);

var React = require('react');
var D = React.DOM;
var immutable = require('immutable');

var Header = require('./header');
var Main = require('./main');
var Footer = require('./footer');

var states = [];
var initialState = immutable.fromJS({
  todos: [
    {id: 1, description: 'A todo', completed: true},
    {id: 2, description: 'Another todo', editing: true},
    {id: 3, description: 'Yet another todo'},
  ]
});
states.push(initialState);

module.exports = React.createClass({
  displayName: 'TodosApp',

  getInitialState: function() {
    return {
      appState: initialState.cursor(this.setAppState)
    }
  },

  undo: function() {
    if (states.length <= 1) return;
    states.pop();
    var prevState = states.pop();
    this.setAppState(prevState);
  },

  setAppState: function(state) {
    states.push(state);
    this.setState({ appState: state.cursor(this.setAppState) });
  },

  getAppState: function() {
    return this.state.appState;
  },

  render: function() {
    var state = this.getAppState();

    return D.div({},
      D.input({onClick: this.undo, type: 'button', value: 'Undo', style: {position: 'absolute', top: '-25px'}}),
      Header({onNewTodo: this.handleNewTodo}),
      Main({todos: state.get('todos'), filter: this.props.filter}),
      Footer({state: state, filter: this.props.filter})
    );
  },

  handleNewTodo: function(description) {
    this.getAppState().get('todos').update(function(todos) {
      return todos.unshift(immutable.fromJS({id: nextId(todos), description: description}));
    });
  }
});

function nextId(todos) {
  return todos.reduce(function(maxId, todo) {
    return Math.max(maxId, todo.get('id'));
  }, 0) + 1;
}

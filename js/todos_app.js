var React = require('react/addons');
var D = React.DOM;
var immutable = require('immutable');

var Header = require('./header');
var Main = require('./main');
var Footer = require('./footer');

module.exports = React.createClass({
  render: function() {
    var state = this.props.state;

    return D.div({},
      Header({onNewTodo: this.handleNewTodo}),
      Main({todos: state.get('todos'), filter: state.get('filter')}),
      Footer({state: this.props.state})
    );
  },

  handleNewTodo: function(description) {
    this.props.state.get('todos').update(function(todos) {
      return todos.unshift(immutable.fromJS({id: this.nextId(), description: description}));
    }.bind(this));
  },

  nextId: function() {
    this.props.state.get('todos').reduce(function(maxId, todo) {
      return Math.max(maxId, todo.get('id'));
    }, 0) + 1;
  }
});

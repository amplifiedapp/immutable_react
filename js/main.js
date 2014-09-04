var React = require('react/addons');
var D = React.DOM;
var TodoRow = require('./todo_row');

function filterFn(filter) {
  switch(filter) {
    case 'Active':
      return function(todo) { return !todo.get('completed'); }
    case 'Completed':
      return function(todo) { return todo.get('completed'); }
    case 'All':
      return function(todo) { return true; }
    default:
      throw new Error('Unknown filter: ' + filter);
  }
}

function filterTodos(filter, todos) {
  return todos.filter(filterFn(filter));
}

module.exports = React.createClass({
  render: function() {
    var todos = this.props.todos;
    var filteredTodos = filterTodos(this.props.filter, todos);
    var allCompleted = filteredTodos.filter(function(todo) {
      return !todo.get('completed');
    }).length == 0;
    var todoRows = filteredTodos.map(function(todo, index) {
      return TodoRow({
        key: todo.get('id'),
        todo: todo,
        onDestroy: this.handleDestroy
      });
    }.bind(this));
    return D.section({id: 'main'},
      D.input({id: 'toggle-all', type: 'checkbox', checked: allCompleted, onChange: this.handleToggleAll}),
      D.label({htmlFor: 'toggle-all'}, 'Mark all as complete'),
      D.ul({id: 'todo-list'}, todoRows.toArray())
    );
  },

  handleDestroy: function(todo) {
    this.props.todos.update(function(todos) {
      return todos.filter(function(item) {return !item.equals(todo)}).toVector();
    })
  },

  handleToggleAll: function() {
    var filteredTodos = filterTodos(this.props.filter, this.props.todos);
    var allCompleted = filteredTodos.filter(function(todo) {
      return !todo.get('completed');
    }).count() == 0;

    this.props.todos.update(function(todos) {
      return todos.map(function(todo) {
        return filteredTodos.contains(todo) ? todo.set('completed', !allCompleted) : todo;
      }).toVector();
    });
  }
});

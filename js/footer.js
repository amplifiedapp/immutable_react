var React = require('react');
var D = React.DOM;
var cx = require('react/lib/cx');
var Link = require('react-router').Link;

module.exports = React.createClass({
  render: function() {
    var todos = this.props.state.get('todos');
    var completedTodosCount = todos.filter(function(todo) {
      return todo.get('completed') === true;
    }).count();

    return D.footer({id: 'footer'},
      D.span({id: 'todo-count'},
        D.strong({},
          (todos.count() - completedTodosCount),
          ' items left'
        )
      ),
      D.ul({id: 'filters'},
        D.li({},
          Link({to: 'all', className: cx({selected: !this.props.filter})}, 'All')
        ),
        D.li({},
          Link({to: 'active', className: cx({selected: this.props.filter === 'active'})}, 'Active')
        ),
        D.li({},
          Link({to: 'completed', className: cx({selected: this.props.filter === 'completed'})}, 'Completed')
        )
      ),
      completedTodosCount > 0
        ? D.button({id: 'clear-completed', onClick: this.handleClearCompleted}, 'Clear completed ('+ completedTodosCount +')')
        : null
    );
  },

  handleClearCompleted: function() {
    this.props.state.get('todos').update(function(todos) {
      return todos.filter(function(todo) {
        return !todo.get('completed');
      }).toVector();
    });
  }
});

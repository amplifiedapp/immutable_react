var React = require('react/addons');
var D = React.DOM;
var cx = React.addons.classSet;

module.exports = React.createClass({
  render: function() {
    var todos = this.props.state.get('todos');
    var currentFilter = this.props.state.get('filter');
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
          D.a({className: cx({selected: currentFilter === 'All'}), href: '#/', onClick: this.handleFilter('All')}, 'All')
        ),
        D.li({},
          D.a({className: cx({selected: currentFilter === 'Active'}), href: '#/active', onClick: this.handleFilter('Active')}, 'Active')
        ),
        D.li({},
          D.a({className: cx({selected: currentFilter === 'Completed'}), href: '#/', onClick: this.handleFilter('Completed')}, 'Completed')
        )
      ),
      completedTodosCount > 0
        ? D.button({id: 'clear-completed', onClick: this.handleClearCompleted}, 'Clear completed ('+ completedTodosCount +')')
        : null
    );
  },

  handleClearCompleted: function() {
    this.props.state.get('todos').update(function(todos) {
      return todos.map(function(todo) {
        return todo.set('completed', false);
      });
    });
  },

  handleFilter: function(filter) {
    return function(ev) {
      ev.preventDefault();

      this.props.state.update(function(state) {
        return state.set('filter', filter);
      });
    }.bind(this);
  }
});

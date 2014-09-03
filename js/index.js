var React = require('react/addons');
var D = React.DOM;
var cx = React.addons.classSet;
var immutable = require('immutable');

var nextId = 4;
var state = immutable.fromJS({
  filter: 'All',
  todos: [
    {id: 1, description: 'A todo', completed: true},
    {id: 2, description: 'Another todo', editing: true},
    {id: 3, description: 'Yet another todo'},
  ]
});
var states = [];

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

var Header = React.createClass({
  render: function() {
    return D.header({id: 'header'},
      D.h1({}, 'todos'),
      D.button({type: 'button', onClick: undo}, 'Undo'),
      D.input({id: 'new-todo', placeholder: 'What needs to be done?', onKeyPress: this.handleKeyPress})
    );
  },

  handleKeyPress: function(ev) {
    var desc = ev.target.value;
    if (desc !== '' && ev.charCode == 13) {
      ev.target.value = '';
      this.props.onNewTodo(desc);
    }
  }
});

var TodoRow = React.createClass({
  render: function() {
    var todo = this.props.todo.toObject();
    var classes = cx({
      'completed': todo.completed,
        'editing': todo.editing
    });
    return D.li({className: classes},
      D.div({className: 'view'},
        D.input({className: 'toggle', type: 'checkbox', checked: todo.completed, onChange: this.handleCheck}),
        D.label({onClick: this.handleClick}, todo.description),
        D.button({className: 'destroy', onClick: this.handleDestroy})
      ),
      D.input({className: 'edit', value: todo.description, onChange: this.handleChange, onKeyPress: this.handleKeyPress})
    );
  },

  handleClick: function() {
    if (!this.props.todo.get('editing')) {
      this.props.todo.update(function(todo) {
        return todo.set('editing', true);
      });
    }
  },

  handleCheck: function() {
    this.props.todo.update(function(todo) {
      return todo.set('completed', !todo.get('completed'));
    });
  },

  handleDestroy: function() {
    this.props.onDestroy(this.props.todo);
  },

  handleChange: function(ev) {
    this.props.todo.update(function(todo) {
      return todo.set('description', ev.target.value);
    });
  },

  handleKeyPress: function(ev) {
    var desc = ev.target.value;
    if (desc !== '' && ev.charCode == 13) {
      ev.target.value = '';
      this.props.todo.update(function(todo) {
        return todo.set('editing', false);
      });
    }
  }
});

var Main = React.createClass({
  render: function() {
    var todos = this.props.todos;
    var allCompleted = todos.filter(function(todo) {
      return !todo.get('completed');
    }).length == 0;
    var todoRows = todos.map(function(todo, index) {
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
    var allCompleted = this.props.todos.filter(function(todo) {
      return !todo.get('completed');
    }).length == 0;

    this.props.todos.update(function(todos) {
      return todos.map(function(todo) {
        return todo.set('completed', !allCompleted);
      });
    });
  }
});

var Footer = React.createClass({
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

var TodosApp = React.createClass({
  render: function() {
    var state = this.props.state;

    return D.div({},
      Header({onNewTodo: this.handleNewTodo}),
      Main({todos: filterTodos(state.get('filter'), state.get('todos'))}),
      Footer({state: this.props.state})
    );
  },

  handleNewTodo: function(description) {
    this.props.state.get('todos').update(function(todos) {
      return todos.unshift(immutable.fromJS({id: nextId++, description: description}));
    });
  }
});

var root = document.getElementById('todoapp');
render(state);

var React = require('react/addons');
var D = React.DOM;
var immutable = require('immutable');

var state = immutable.fromJS({
  todos: [
    {id: 1, description: 'A todo', completed: true},
    {id: 2, description: 'Another todo', editing: true},
    {id: 3, description: 'Yet another todo', selected: true},
  ]
});

var nextId = 4;

var Header = React.createClass({
  render: function() {
    return D.header({id: 'header'},
      D.h1({}, 'todos'),
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
    return D.li({className: todo.complete ? 'completed' : todo.editing ? 'editing' : ''},
      D.div({className: 'view'},
        D.input({className: 'toggle', type: 'checkbox', checked: todo.selected, onChange: this.handleCheck}),
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
      return todo.set('selected', !todo.get('selected'));
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
    var todoRows = todos.map(function(todo, index) {
      return TodoRow({
        key: todo.get('id'),
        todo: todos.cursor(index),
        onDestroy: this.handleDestroy
      });
    }.bind(this));
    return D.section({id: 'main'},
      D.input({id: 'toggle-all', type: 'checkbox'}),
      D.label({htmlFor: 'toggle-all'}, 'Mark all as complete'),
      D.ul({id: 'todo-list'}, todoRows.toArray())
    );
  },

  handleDestroy: function(todo) {
    this.props.todos.update(function(todos) {
      return todos.remove(todos.indexOf(todo));
    })
  }
});

var Footer = React.createClass({
  render: function() {
    return D.footer({id: 'footer'},
      D.span({id: 'todo-count'},
        D.strong({}, this.props.todos.length),
        ' items left'
      )
    );
  }
})

var TodosApp = React.createClass({
  render: function() {
    return D.div({},
      Header({onNewTodo: this.handleNewTodo}),
      Main({todos: this.props.todos}),
      Footer({todos: this.props.todos})
    );
  },

  handleNewTodo: function(description) {
    this.props.todos.update(function(todos) {
      return todos.unshift(immutable.fromJS({id: nextId++, description: description}));
    });
  }
});


var root = document.getElementById('todoapp');
var states = [];
function render(state) {
  states.push(state);
  var component = TodosApp({
    todos: state.cursor('todos', render)
  });
  React.renderComponent(component, root);
}

render(state);

window.undo = function() {
  if (states.length == 1) return;
  states.pop();
  var prevState = states.pop();
  render(prevState);
};

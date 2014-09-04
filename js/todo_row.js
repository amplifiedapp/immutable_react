var React = require('react/addons');
var D = React.DOM;
var cx = React.addons.classSet;

module.exports = React.createClass({
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

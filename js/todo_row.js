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
        D.label({onDoubleClick: this.handleDoubleClick}, todo.description),
        D.button({className: 'destroy', onClick: this.handleDestroy})
      ),
      D.input({
        className: 'edit',
        ref: 'editInput',
        value: todo.description,
        onChange: this.handleChange,
        onKeyPress: this.handleKeyPress,
        onBlur: this.handleBlur})
    );
  },

  componentDidUpdate: function(prevProps, prevState) {
    // Set focus when going from not editing to editing
    if (this.props.todo.get('editing') && !prevProps.todo.get('editing')) {
      this.refs.editInput.getDOMNode().focus();
    }
  },

  handleDoubleClick: function() {
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
  },

  handleBlur: function() {
    this.props.todo.update(function(todo) {
      return todo.set('editing', false);
    });
  }
});

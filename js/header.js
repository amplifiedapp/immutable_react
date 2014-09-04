var React = require('react/addons');
var D = React.DOM;

module.exports = React.createClass({
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

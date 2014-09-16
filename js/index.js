var React = require('react');
var Router = require('react-router');
var Routes = Router.Routes,
    Route = Router.Route;

var TodosApp = require('./todos_app');

function App() {
  return Routes(null,
    Route({name: 'all', handler: TodosApp, path: '/', filter: undefined}),
    Route({name: 'completed', handler: TodosApp, path: '/completed', filter: 'completed'}),
    Route({name: 'active', handler: TodosApp, path: '/active', filter: 'active'})
  );
}

var root = document.getElementById('todoapp');
React.renderComponent(App(), root);

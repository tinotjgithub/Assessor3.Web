import flux = require('flux');
import Action = require('../actions/base/action');

/**
 * The provided Flux Dispatcher is used 'as is' except that
 * it expects actions extending the Action class
 */
class Dispatcher extends flux.Dispatcher<Action> {}

//Export the singleton dispatcher
let dispatcher = new Dispatcher();

export = dispatcher;

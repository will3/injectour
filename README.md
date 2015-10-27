# Injectour

A lightweight dependency injector

### Usage:

bind(type, [dependencies, func]||func||value, cache=false);

**type**  
type/name of object

**depedencies, function||func||object**  
list of dependencies and constructor/factory func.  
optionally, pass in just the constructor/factory func to declare dependencies implictly using argument names.  
passing in an object will declare the binding as value.

**cache**  
Pass true to cache the result, effectively binding the dependency as a singleton. Defaults to false.

### Examples:

```javascript
var injector = require('injectour')();

//bind depedencies
injector.bind('dep1', ...);
injector.bind('dep2', ...);

//use dep1 and dep2
injector.bind('type', ['dep1', 'dep2', function(dep1, dep2){
	this.dep1 = dep1;
	this.dep2 = dep2;
}]);

//optionally, declare dep1 and dep2 implictly,
//but default, the injector uses argument names
//Note: this won't work if your code is minified!!
injector.bind('type', function(dep1, dep2){
	this.dep1 = dep1;
	this.dep2 = dep2;
});

//get instance
var object = injector.get('type');

//bind value
injector.bind('foo', 'bar');
injector.get('foo') === 'bar'	//true

//bind as singleton
injector.bind('type', function(){ 
	...
}, true);

//only one instance will be created
var instance1 = injector.get('type');
var instance2 = injector.get('type');

instance1 === instance2 	//true
```
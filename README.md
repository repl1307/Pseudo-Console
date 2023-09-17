# Pseudo-Console
An in-browser pseudo-console made with JavaScript. 

## Usage
Copy the `console.js` file and add it to your web project. To actually use the console add one of the following options to the beginning of your first `.js` file:
```javascript
//create a new Console attached to the window object as 'window.debug'
new Console();
//create a new Console and attach it to a variable
const debug = new Console();

//usage (works with either of the above implementations)
debug.log("Hello world");
debug.warn("Uh oh!");
debug.error("Mistakes have been made...");
debug.clear();

```

# Pseudo-Console
An in-browser pseudo-console made with JavaScript. There is no real reason to use this over a browser's built-in DevTools.

## Usage
Copy the `console.js` file and add it as file to your web project. Then in the head of the main `.html` file add:
```html
<script src="<Add/Path/To/console.js>"></script>
```

To actually use the console add one of the following options to the beginning of your first `.js` file:
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
The console is able to parse and output **objects**, **arrays**, and **HTML**.
## Demo
Go to https://repl1307.github.io/Pseudo-Console/

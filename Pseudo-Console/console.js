/* 
  Must include script in head of html file
   <script src = "console.js"></script>
   
  Example Usage:
    const debug = new Console();
    debug.log('This is a cool message!');
    debug.error(new Error('Uh oh! An error occurred!'));
  Or:
    new Console();
    debug.log('This is a cool message!');
    debug.warn('Uh oh! Warning!');
    debug.clear();
*/
//icon handling
let iconScript = document.createElement('script');
iconScript.src = 'https://kit.fontawesome.com/7a8d9e0b6f.js';
iconScript.crossorigin = 'anonymous';
document.head.appendChild(iconScript);
//custom console
class Console {
  constructor() {
    this.console = document.createElement('div');
    this.console.id = 'debugger';
    this.console.style = `
      border: 1px solid white;
      overflow-y: scroll;
      height: auto;
      flex: 5;
    `;
    this.consoleContainer = document.createElement('div');
    this.consoleContainer.style = `
      display: flex;
      justify-content: flex-start;
      flex-flow: column;
      position: fixed;
      padding: 5px;
      color: white;
      border: 1px solid white;
      top: 30px;
      right: 30px;
      background-color: rgba(0, 0, 0, 0.9);
      min-width: max(20vw, 300px);
      width: max(35vw, 400px);
      max-width: 95vw;
      overflow-x: hidden;
      overflow-y: no-scroll;
      min-height: 20vh;
      max-height: 95vh;
      height: max(50vh, 300px);
      resize: both;
      font-size: 1.25rem;
      user-select: none;
    `;
    this.consoleContainer.addEventListener('contextmenu', e => {
      e.preventDefault();
      return false;
    });
    //automatic error logging
    window.onerror = (message, url, line, col, error) => {
      try {
        this.error(message, url, line, col, error);
      }
      catch (e) {
        console.log(e)
      }
    };
    //title
    let title = document.createElement('h1');
    title.innerHTML = 'CONSOLE';
    title.style = `
      display: block;
      position: relative;
      border: 1px solid white;
      text-align: center;
      padding: 0 5px;
      margin: 0;
    `;
    //input handling
    this.vars = {};
    this.queue = [];
    //refers to current item in queue
    this.queueTotal = 0;
    this.queueCompleted = 1;
    this.continueQueue = false;
    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.style = `
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      padding: 5px;
      border: 1px solid white;
      outline: none;
      box-shadow: none;
      font-size: 1em;
    `;
    this.input.placeholder = 'Commands';
    this.input.addEventListener('keyup', async (e) => {
      if (e.key != 'Enter') { return; }
      try {
        let command = this.input.value;
        let parsed = await this.parse.plainText(command);
        console.log(parsed);
        this.log(parsed);
        if (command.replaceAll(' ', '') == 'log(this)' ||
          command.replaceAll(' ', '') == 'log(this);') {
          command = 'log(debug)';
        }
        //accepting multiple forms of input for logging
        ['this.log(', 'console.log('].forEach(term => {
          command = command.replaceAll(term, 'debug.log(');
        });
        ['this.error(', 'console.error('].forEach(term => {
          command = command.replaceAll(term, 'debug.error(');
        });
        ['this.warn(', 'console.warn('].forEach(term => {
          command = command.replaceAll(term, 'debug.warn(');
        });
        ['this.clear(', 'console.clear(', 'clear('].forEach(term => {
          command = command.replaceAll(term, 'debug.clear(');
        });
        ['let ', 'const ', 'var '].forEach(term => {
          command = command.replaceAll(term, 'window.');
        });
        while (command.includes('function ')) {
          command = command.replace('function ', 'window.');
          command = command.replace('(', '= function(');
        }
        new Function(command)();
        this.input.value = '';
      }
      catch (err) {
        this.error(err);
        console.log(err);
      }
    });
    //minimize 
    let minimize = document.createElement('p');
    let styleElem = document.createElement('style');
    let minimizeAnimation = `
      @keyframes rotateUp {
        from { rotate: 360deg; }
        to { rotate: 180deg; }
      }
      @keyframes rotateDown {
        from { rotate: 180deg; }
        to { rotate: 360deg; }
      }
      @keyframes fadeOut {
        from { flex: 5; }
        to { flex: 1; }
      }
    `;
    let placeholderStyling = `
      input::placeholder {
        color: rgba(255,255,255,0.75);
      }
      input:disabled{
        cursor: not-allowed;
      }
    `;
    styleElem.innerHTML += placeholderStyling;
    styleElem.innerHTML += minimizeAnimation;
    document.head.appendChild(styleElem);
    minimize.style = `
      padding: 5px;
      margin: 30px 0;
      background-color: rgba(0,0,0,0);
      position: absolute;
      font-size: 0.65em;
      top: -30px;
      right: 5px;
      rotate: 180deg;
      animation-name: rotateUp;
      animation-duration: 0.5s;
      animation-iteration-count: 1;
      animation-fill-mode: forwards;
    `;
    minimize.innerHTML = '<i class="fa-solid fa-caret-up"></i>';
    title.appendChild(minimize);
    //implementing animation on click
    this.isConsoleHidden = false;
    minimize.addEventListener('click', e => {
      let m = getComputedStyle(minimize);
      if (m.animationName == 'rotateUp')
        minimize.style.animationName = 'rotateDown';
      else
        minimize.style.animationName = 'rotateUp';

      minimize.style.animationIterationCount = 1;
      if (!this.isConsoleHidden) {
        this.isConsoleHidden = getComputedStyle(this.consoleContainer).height;
        this.console.style.display = 'none';
        this.input.style.display = 'none';
        this.consoleContainer.style.minHeight = '0';
        this.consoleContainer.style.height = 'fit-content';
        this.consoleContainer.style.minHeight = getComputedStyle(this.consoleContainer).height;
      }
      else {
        this.consoleContainer.style.height = this.isConsoleHidden;
        this.console.style.display = 'block';
        this.input.style.display = 'block';
        this.consoleContainer.style.minHeight = '20vh';
        this.isConsoleHidden = false;
      }
    });
    //adding to global object
    window.debug = this;
    window.log = (message) => { window.debug.log(message) };
    window.warn = (message) => { window.debug.warn(message) };
    window.error = (message) => { window.debug.error(message)};
    window.clear = () => { this.clear() };
    //don't display console if on mobile
    if (this.isMobile()) {
        return;
    }
    //appends
    this.consoleContainer.appendChild(title);
    this.consoleContainer.appendChild(this.console);
    this.consoleContainer.appendChild(this.input);
    document.body.appendChild(this.consoleContainer);

    this.draggable();

    //queue handling
    this.executingQueue = false
    setInterval(() => {
      if(this.queue.length > 0 && !this.executingQueue){
        this.executingQueue = true;
        this.executeQueue(this.queue).then(res => {
          this.queue = [];
          this.executingQueue = false;
        });
      }
    }, 100);
  }
  //check if is mobile
  isMobile = function() {
    let check = false;
    (function(a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  };
  //create log count
  createLogCount = function() {
    let logCount = document.createElement('p');
    logCount.style = `
      display: none;
      font-size: 0.8em;
      margin: 0;
      margin-left: auto;
      width: min-content;
      padding: 5px;
      border: 1px solid white;
      border-radius: 5px;
    `;
    logCount.innerHTML = '';
    return logCount;
  }
  appendErrors = async (message, url, line, col, error,stack) => {
    if (this.duplicateLog(message)) {
      return;
    }
    let messageDiv = this.createMessage();
    let messageP = this.createMessageText(message);
    messageDiv.style.backgroundColor = '#a10018'
    messageP.style.backgroundColor = 'rgba(0,0,0,0)';
    //line containing url and line where error occurred
    let lineP = document.createElement('p');
    lineP.style = ' margin: 0; padding: 0 5px; color: lightgrey; font-size: 0.75em; width: fit-content';
    if (url) { lineP.innerHTML += url; }
    if (line) { lineP.innerHTML += ' Line:' + line + ':' + col; }
    else {
      lineP.innerHTML = stack;
    }
    //error count tracker
    let errCount = this.createLogCount();
    //appends
    messageDiv.appendChild(messageP);
    messageDiv.appendChild(lineP);
    messageDiv.appendChild(errCount);
    this.console.appendChild(messageDiv);
    messageDiv.scrollIntoView(false);
  };
  //append logs to console
  appendLogs = async (message, stack) => {
    if (this.duplicateLog(message)) {
      return;
    }
    let messageDiv = this.createMessage();
    let messageP = this.createMessageText(message);
    messageP.style.backgroundColor = 'rgba(0,0,0,0)';

    let lineP = document.createElement('p');
    lineP.style = 'background-color: rgba(255,255,255,0.15); margin: 0; padding: 0 5px; color: lightgrey; font-size: 0.75em; width: fit-content';
    lineP.innerHTML = stack;

    let logCount = this.createLogCount();
    messageDiv.appendChild(messageP);
    messageDiv.appendChild(lineP);
    messageDiv.appendChild(logCount);
    this.console.appendChild(messageDiv);
    messageDiv.scrollIntoView(false);
    this.input.placeholder = '';
    this.input.disabled = false;
  }
  //append warning to console
  appendWarns = async (message, stack) => {
    if (this.duplicateLog(message)) {
      return;
    }
    let messageDiv = this.createMessage();
    let messageP = this.createMessageText( message);
    messageP.style.backgroundColor = 'rgba(0,0,0,0)';
    messageDiv.style.backgroundColor = 'rgba(255, 255, 0, 0.5)';
    let lineP = document.createElement('p');
    lineP.style = ' margin: 0; padding: 0 5px; color: lightgrey; font-size: 0.75em; width: fit-content';
    lineP.innerHTML = stack;
    let logCount = this.createLogCount();

    messageDiv.appendChild(messageP);
    messageDiv.appendChild(lineP);
    messageDiv.appendChild(logCount);
    this.console.appendChild(messageDiv);
    messageDiv.scrollIntoView(false);
  };
  //execute messages in order
  executeQueue = async (messages) => {
    let parsedMessages = [];
    //loop through message queue
    for(let message of messages){
      this.queueCompleted = 1;
      this.queueTotal = 0;
      if(Array.isArray(message.message)){
        this.queueTotal = message.message.length;
      }
      else if(typeof message.message == 'object'){
        this.queueTotal = Object.keys(message.message).length;
      }
      //if message is error
      if(message.type == 'error'){
        message.message = '<i class="fa-solid fa-circle-exclamation"></i> '+message.message;
        await this.appendErrors(message.message, message.url, message.line, 
          message.col, message.error, message.stack );
      }
      //if message is log
      else if(message.type == 'log'){
        //if message is referring to an html element
        if (typeof message.message == 'object' && message.message instanceof Element) {
          message.message = message.message.cloneNode(true);
          parsedMessages.push(message.message);
        }
        else {
          parsedMessages.push(await this.parse.message(message.message));
        }
        await this.appendLogs(parsedMessages[parsedMessages.length-1], message.stack);
      }
      else if(message.type == 'warn'){
        message.message = '<i class="fa-solid fa-triangle-exclamation"></i> '+message.message;
        await this.appendWarns(message.message, message.stack);
      }
    }
    
    return parsedMessages;
  }
  //check if log is a duplicate
  duplicateLog = (message) => {
    if (this.console.lastChild) {
      const child = this.console.lastChild.children[0];
      if (child.textContent == message.textContent || child.innerHTML == message) {
        let logCount = this.console.lastChild.lastChild;
        if (logCount.innerHTML == '' || logCount.innerHTML == '1') {
          logCount.innerHTML = 2;
          logCount.style.display = "block";
        }
        else {
          logCount.innerHTML = Number(logCount.innerHTML) + 1;
        }
        this.console.lastChild.scrollIntoView(false);
        return true;
      }
      return false;
    }
    return false;
  }

  //create message html element
  createMessage = function() {
    let newMessage = document.createElement('div');
    newMessage.style = `
      position: relative; 
      margin: 0; padding: 10px; 
      border: 1px solid white; 
      color: white;
      max-width; 100%;`;
    return newMessage;
  }

  //create message text html element
  createMessageText = function(message, color = 'white') {
    let messageText = document.createElement('p');
    messageText.style = ` 
    margin: 0; padding: 5px 0; color: ${color}; word-wrap: break-word; height: auto; overflow: hidden;`;
    //message = message.replaceAll('\n','<br>');
    if (message instanceof Element) {
      messageText.appendChild(message);
    }
    else {
      messageText.innerHTML = message;
    }
    messageText.addEventListener('contextmenu', e => {
      e.preventDefault();
      navigator.clipboard.writeText(messageText.textContent);
      if (document.getElementById('copy-alert')) { return; }
      let copyAlert = document.createElement('div');
      copyAlert.id = 'copy-alert';
      copyAlert.style = `
          position: fixed;
          top: 10px;
          left: 43%;
          background-color: lightgrey;
          color: black;
          padding: 15px 25px;
        `;
      copyAlert.innerHTML = 'Text copied to clipboard';
      setTimeout(() => { copyAlert.remove(); }, 1000)
      document.body.appendChild(copyAlert);
      return false;
    });
    return messageText;
  }
  //create span for styling message text
  createSpan = async (text, color = "white") => {
    text = text.toString().replaceAll('<br>', '\r\n');
    text = text.toString().replaceAll('&nbsp;', ' ');
    const span = document.createElement('span');
    span.style = `color: ${color}; white-space: pre-line;`;
    span.textContent = text;
    return span;
  }
  //parsing functions
  parse = {
    message: async (message) => {
      let parsedMessage = message;
      //check if message is object
      if (Array.isArray(message)) {
        parsedMessage = await this.parse.array(message);
      }
      else if (typeof message == 'object') {
        parsedMessage = await this.parse.object(message);
      }
      else if (typeof message == 'string') {
        parsedMessage = await this.parse.string(message);
      }
      else if (typeof message == 'number') {
        parsedMessage = await this.parse.number(message);
      }
      else if (typeof message == 'boolean') {
        parsedMessage = await this.parse.bool(message);
      }
      else {
        parsedMessage = await this.parse.plainText(message);
      }

      return parsedMessage;
    },
    //parse object as formatted console string
    object: async (obj, indentCount = 1, separator = '&nbsp;&nbsp;&nbsp;') => {
      const mainSpan = await this.createSpan('{<br>');
      let total = Object.keys(obj).length;
      let completed = 0;
      for (const [key, value] of Object.entries(obj)) {
        for (let i = 0; i < indentCount; i++) {
          mainSpan.innerHTML += separator;
        }
        await new Promise(res => setTimeout(res, 0));
        if(indentCount == 2){
          completed++;
          this.input.placeholder = 'Loading... '+completed+'/'+total+' Total: '+this.queueCompleted+'/'+(this.queueTotal);
          this.input.disabled = true;
          if(completed >= total){
            console.log(completed+'ads');
          }
        }
        mainSpan.appendChild(await this.createSpan(key, '#10ad5c'));
        mainSpan.innerHTML += ':&nbsp;';
        //check type of value and display accordingly
        if (Array.isArray(value)) {
          mainSpan.appendChild(await this.parse.array(value, indentCount + 1));
        }
        else if (typeof value == 'object') {
          mainSpan.appendChild(await this.parse.object(value, indentCount + 1));
        }
        else if (typeof value == 'string') {
          mainSpan.appendChild(await this.parse.string(value));
        }
        else if (typeof value == 'number') {
          mainSpan.appendChild(await this.parse.number(value));
        }
        else if (typeof value == 'boolean') {
          mainSpan.appendChild(await this.parse.bool(value));
        }
        else {
          mainSpan.appendChild(await this.parse.plainText(value));
        }
        if (!Array.isArray(value))
          mainSpan.innerHTML += ',<br>';
        else
          mainSpan.innerHTML += '<br>';

        if(indentCount == 1){
          this.queueCompleted++;
        }
      }
      for (let i = 0; i < indentCount - 1; i++) {
        mainSpan.innerHTML += separator;
      }
      mainSpan.innerHTML += '}';
      return mainSpan;
    },
    //parse array as formatted console string
    array: async (array, indentCount = 1, separator = '&nbsp;&nbsp;&nbsp;') => {
      const mainSpan = await this.createSpan('[');
      let total = array.length;
      let completed = 0;
      if (indentCount > 1) {
        for (let i = 0; i < indentCount - 1; i++) {
          mainSpan.innerHTML = separator + mainSpan.innerHTML;
        }
        mainSpan.innerHTML = '<br>' + mainSpan.innerHTML;
      }
      let count = 0;
      for (const item of array) {
        await new Promise(res => setTimeout(res, 0));
        if(indentCount == 2){
          completed++
          this.input.placeholder = 'Loading... '+completed+'/'+total+' Total: '+this.queueCompleted+'/'+this.queueTotal;
          this.input.disabled = true;
        }
        //check type of item in array and handle accordingly
        if (Array.isArray(item)) {
          mainSpan.appendChild(await this.parse.array(item, indentCount + 1));
        }
        else if (typeof item == 'object') {
          mainSpan.appendChild(await this.parse.object(item, indentCount + 1));
          mainSpan.innerHTML += ',<br>';
        }
        else if (typeof item == 'string') {
          mainSpan.appendChild(await this.parse.string(item));
        }
        else if (typeof item == 'number') {
          mainSpan.appendChild(await this.parse.number(item));
        }
        else if (typeof item == 'boolean') {
          mainSpan.appendChild(await this.parse.bool(item));
        }
        else {
          mainSpan.appendChild(await this.parse.plainText(item));
        }
        count++;
        if (count < array.length && typeof item != 'object') {
          mainSpan.innerHTML += ',&nbsp;&nbsp;';
        }
        if(indentCount == 1){
          this.queueCompleted++;
        }
      }
      //handling end of array formatting
      if (indentCount > 1) {
        if (!Array.isArray(array[array.length - 1])) {
          mainSpan.innerHTML += '],&nbsp;&nbsp;';
        }
        else {
          mainSpan.innerHTML += '<br>'
          for (let i = 0; i < indentCount - 1; i++) {
            mainSpan.innerHTML += separator;
          }
          mainSpan.innerHTML += '],';
        }
      }
      else {
        mainSpan.innerHTML += '<br>]';
      }


      return mainSpan;
    },
    //parse string as formatted console string
    string: async (str) => {
      let returnVal = ``;
      if (!str.includes('"')) {
        returnVal += `"${str}"`;
      }
      else {
        returnVal += `${str}`;
      }

      return await this.createSpan(returnVal, 'yellow');
    },
    //parse number as formatted console string
    number: async (num) => {
      return await this.createSpan(num, '#e336e0');
    },
    //parse bool as formatted console string
    bool: async (boolean) => {
      return await this.createSpan(boolean, '#5b6bf5');
    },
    // parse everything else as plain text
    plainText: async (text) => {
      if(!text[0]){ return await this.createSpan('Uh oh')}
      if (text[0] == '"' && text[text.length - 1] == '"' && text.length >= 3) {
        text = text.substring(1, text.length - 2);
      }
      return await this.createSpan(text);
    },
  };
  //print message
  log = (message) => {
    let stack = Error().stack;
    stack = stack.replace(stack.substring(0, stack.indexOf(')')), '');
    stack = stack.substring(stack.indexOf('at'), stack.length - 1);
    stack = stack.replace('a', 'A');
    this.queue.push({message, stack, type:'log'});
  }
  //print error
  error = function(message, url, line, col, error) {
    if (this.duplicateLog('<i class="fa-solid fa-circle-exclamation"></i> ' + message)) {return;}
    let stack = Error().stack;
    stack = stack.replace(stack.substring(0, stack.indexOf(')')), '');
    stack = stack.substring(stack.indexOf('at'), stack.length - 1);
    stack = stack.replace('a', 'A');
    this.queue.push({message, url, line, col, error, stack, type: 'error' });
  };
  //clear console
  clear = () => { this.console.textContent = ''; };
  warn = (message) => {
    if (this.duplicateLog('<i class="fa-solid fa-triangle-exclamation"></i> ' + message)) {
      return;
    }
    let stack = Error().stack;
    stack = stack.replace(stack.substring(0, stack.indexOf(')')), '');
    stack = stack.substring(stack.indexOf('at'), stack.length - 1);
    stack = stack.replace('a', 'A');
    this.queue.push({message, stack, type: 'warn'});
  };
  //make element draggable
  draggable = () => {
    let el = this.consoleContainer;
    el.addEventListener('mousedown', function(e) {
      if (e.clientX > Number(el.getBoundingClientRect().x) + el.offsetWidth - 20 || e.clientY > Number(el.getBoundingClientRect().y) + el.offsetHeight - 20) {
        return;
      }
      let offsetX = e.clientX - parseInt(window.getComputedStyle(this).left);
      let offsetY = e.clientY - parseInt(window.getComputedStyle(this).top);
      function mouseMoveHandler(e) {
        //check if mouse is not in bottom right 20 x 20 coords
        if (e.clientX + 20 < Number(el.getBoundingClientRect().x) + el.offsetWidth
          || e.clientY + 20 < Number(el.getBoundingClientRect().y) + el.offsetHeight) {
          el.style.top = (e.clientY - offsetY) + 'px';
          el.style.left = (e.clientX - offsetX) + 'px';
        }
      }
      function reset() {
        window.removeEventListener('mousemove', mouseMoveHandler);
        window.removeEventListener('mouseup', reset);
      }
      window.addEventListener('mousemove', mouseMoveHandler);
      window.addEventListener('mouseup', reset);
    });
  };

}
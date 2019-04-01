# Customizing the Console Output in Node

###### Keywords: Javascript, Node, Console, console.log

Working with Node, the ``console.log`` command is never far away. Be it either for debugging purposes or user interaction, the ``console`` module provides a simple way of outputting a string to the terminal.

For the most part, the boring, plain output is all we need. Sometimes, however, we want our output to make more of an impact and catch the users eye, for example when displaying a warning message, by using a different color or style.

Luckily for us, there is a simple way to do just that.

#### Customizing the output from Console.log

Customizing the output of the ``console`` module can be done using the escape sequence ``\x1b``, followed by a style code and the string we want to print.

For example, the following line colors the string ``Hello (colorful) world`` green in the console:

```javascript
console.log("\x1b[32m%s", "Hello (colorful) World!");
console.log("This should not be in color!");
```

The style code ``[32m`` colors everything that precedes it green. The problem is, it doesn't stop with the string immediately following. The string ``This should not be in color`` is painted green as well.

To prevent this, it is recommended to always use the reset code ``[0m``.

A better example would be:

```javascript
console.log("\x1b[32m%s\x1b[0m", "Hello (colorful) World!");
console.log("This should not be the same color!");
```

Now, only the first string is colorized.

#### Not only colors

Apart from other colors, you can also apply other styles, such as underscores or making the text bold or blink.

Below follows a complete list of style codes:

**Foreground colors:**
* Black: ``\x1b[30m``
* Red: ``\x1b[31m``
* Green: ``\x1b[32m``
* Yellow: ``\x1b[33m``
* Blue: ``\x1b[34m``
* Magenta: ``\x1b[35m``
* Cyan: ``\x1b[36m``
* White: ``\x1b[37m``

**Background colors:**
* Black: ``\x1b[40m``
* Red: ``\x1b[41m``
* Green: ``\x1b[42m``
* Yellow: ``\x1b[43m``
* Blue: ``\x1b[44m``
* Magenta: ``\x1b[45m``
* Cyan: ``\x1b[46m``
* White: ``\x1b[47m``

**Styles:**
* Reset: ``\x1b[0m``
* Bright: ``\x1b[1m``
* Dim: ``\x1b[2m``
* Underscore: ``\x1b[4m``
* Blink: ``\x1b[5m``
* Reverse: ``\x1b[7m``
* Hidden: ``\x1b[8m``

#### Using packages (or writing your own)

Remembering the escape sequence and style codes can be cumbersome. There are several packages out there that simplifies this for you, such as ``chalk``.

But if you're anything like me and do not like to install a bunch of dependencies for simple tasks such as this, you could just write your own module. (I opted out of using background colors, but you could easily add them.)

```javascript
// color.js
module.exports = function () {

  this.colors = {
    black: "\x1b[30m",
      red: "\x1b[31m",
    green: "\x1b[32m",
   yellow: "\x1b[33m",
     blue: "\x1b[34m",
  magenta: "\x1b[35m",
     cyan: "\x1b[36m",
   normal: "\x1b[0m"
 };

 this.styles = {
        reset: "\x1b[0m",
       bright: "\x1b[1m",
          dim: "\x1b[2m",
   underscore: "\x1b[4m",
        blink: "\x1b[5m",
      reverse: "\x1b[7m",
       hidden: "\x1b[8m"
};

 this.print = function (output, color = this.colors.normal, style = this.styles.reset) {
   console.log("%s%s%s\x1b[0m", style, color, output);
 };

 return this;
};
```

If we want to output a blinking, green string, we can just call the ``color`` module in the following way:

```javascript
const color = require('color.js')();
color.print("Hello (colorful) world!", color.colors.green, color.styles.blink);
```

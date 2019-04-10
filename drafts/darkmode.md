# Enable Dark Mode on the Web

![cover](../static/images/darkmode.png)

###### Keywords: macOS, web development, CSS, Mojave, Dark Mode

Last year, Apple introduced support for the ``prefers-color-scheme`` media query with the Safari Technology Preview Release 68, making it possible to add a dark mode styling to a website.

With the release of macOS Mojave 10.14.4, this feature is now supported in Safari.

Here's how to 


```css
@media (prefers-color-scheme: dark) {

  body {
    background: rgb(0, 0, 0);
    color:      rgb(250, 250, 250);
  }

}
```

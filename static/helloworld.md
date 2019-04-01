# Hello World

This is a test

# flurrypotato

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam bibendum, purus eu aliquam dapibus, eros ligula facilisis orci, sed porta mauris arcu ut dui. Duis blandit dolor quam, ac sollicitudin erat placerat fermentum. Vestibulum luctus dapibus nunc, eget iaculis nulla blandit eu. Praesent accumsan viverra elit. Donec urna sapien, bibendum in pretium at, fringilla at ipsum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed in gravida dolor. Etiam elementum arcu a augue pharetra, et consequat lorem dapibus. Pellentesque id congue massa. Etiam id erat ultricies, condimentum ipsum fermentum, dapibus dolor. Phasellus libero lorem, blandit id malesuada sed, ultrices vel dolor.

## Lorem

Nulla ac ultricies nulla, at tempus enim. In tempor elit quis elit maximus, nec sagittis ipsum dictum. *Curabitur* sit amet ligula sed diam tempus auctor. Vivamus rhoncus sem erat, vitae fringilla sapien congue a. Vivamus vel blandit turpis. Pellentesque venenatis dignissim ligula ut lacinia. Pellentesque quis enim vel risus egestas rutrum ut ut lectus. Vestibulum porttitor mauris id leo cursus condimentum. Duis laoreet lacus dolor, congue cursus libero commodo eget. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla placerat volutpat porta.

## Ipsum

Curabitur non fermentum arcu. Pellentesque aliquet velit pellentesque, dapibus odio eget, ullamcorper ante. Cras non nisi rhoncus, imperdiet ex in, convallis urna. Maecenas tristique lectus est, non fermentum arcu viverra non. Suspendisse volutpat diam quis nunc dictum, id gravida purus **malesuada**. ``Cras`` nunc tortor, rhoncus quis lacinia in, tempor eget ipsum. Donec nec aliquam mi. Vestibulum pretium nunc eu cursus malesuada. Nam tempor metus sit amet felis iaculis, sed mollis purus lobortis. Proin et congue justo. Suspendisse et ligula dui. Maecenas venenatis semper risus, eu accumsan mauris consequat laoreet. Sed eget tempor elit, sed aliquam mi. Morbi eget malesuada erat, at hendrerit arcu. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

Aliquam erat volutpat. Pellentesque volutpat cursus nisl et tempor. Aenean vitae lectus ac sem vulputate tempor. Cras sollicitudin, sem vel eleifend accumsan, justo nisl luctus nisi, sed laoreet metus ligula quis magna. Phasellus lectus risus, lacinia et purus eu, sollicitudin consectetur neque. Morbi auctor viverra massa quis suscipit. Nullam quis ante vestibulum, scelerisque velit id, ullamcorper justo. Sed non arcu fermentum, ultricies ante et, bibendum justo. Sed at consectetur sapien, eget ullamcorper odio. Nulla vestibulum at magna ac dapibus. Sed ullamcorper congue venenatis. In a libero magna. Vestibulum ullamcorper elementum vehicula.

```javascript
import marked from 'marked';
import posts from "@/assets/posts.md"
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/gruvbox-dark.css';

hljs.registerLanguage('javascript', javascript);

export default {
  name: 'Blog',
  data: function() {
    return {
      html: posts.html,
      blogs: {}
    }
  },
  created: function() {
    fetch("https://raw.githubusercontent.com/pkrll/furry-potato/master/index.json")
          .then(r => r.json())
          .then(t => this.blogs = t.posts)
          .catch(e => console.log(e));
  },
  mounted: function() {
    hljs.initHighlightingOnLoad();
  },
  computed: {
    markdownText() {
      return marked(posts.body);
    }
  }
}
```

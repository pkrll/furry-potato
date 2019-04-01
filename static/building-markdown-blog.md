# Building a Markdown-based blog with Vue + Github

###### Keywords: Vue, Github, Markdown

When I recently re-did my site (the result of which you are seeing now!), I held off adding a blog section. The reason being, I wasn't sure how to do it. In the past, I would have built a small CMS from scratch with an SQL database connection along with a backend tool for creating, editing and removing posts.

However, introducing that much complexity on top of a basically static site, seemed just... well, idiotic. Beside a dashboard, a text editor and an actual database, I would also need some form of auth system.

I wanted something much simpler.

As markdown-based blogs seems to be a big trend today, I decided to hack together my own solution using Github flavored markdown.

#### Why markdown?

I find markdown a perfect fit for writing tech articles, especially for developers as it really simplifies including code blocks. There's no need to add HTML tags, or spending time on a parser for self-defined modifiers.

#### The setup

Inspired by Github Pages, the content is hosted on a [Github repository](https://github.com/pkrll/furry-potato) (as opposed to a database), along with a metadata file, called ``index.json``, which holds current information on all posts published. This includes the title, a summary and the name of the markdown file:

```json
{
	"posts": [
		{
			"title": "Example post",
			"summary": "Example summary",
			"path": "example.md"
		},
		{
			"title": "Another post",
			"summary": "Another summary",
			"path": "foobar.md"
		}
	]
}
```

#### Creating the blog

So, how do we display that content in our Vue SPA? The simplest method is to just fetch it directly from Github and parse the markdown using a parser (``marked`` in my case).

We will first need to create two Vue components: **Blog** and **Post**.

While the **Post** component will display an individual post, the **Blog** component will list all the published posts.

Let's start with **Blog**. As the metadata is stored in the ``index.json`` file in the root directory of my content repository, we can get a list of all posts by simply fetching that JSON file, like this:

```javascript
// Blog.vue
export default {
	name: 'Blog',
	data: function() {
		return {
			posts: [] // Holds all posts
		}
	},
	//...
	created: function() {
		fetch("https://.../master/index.json")
		     .then(response => response.json())
		     .then(response => this.posts = response.posts)
		     .catch(e => this.didGetError(e));
	},
	//...
}
```

Assuming there are no errors, the above code fetches and stores the data (an array of JSON objects) in the property ``posts``.

We can then display them one-by-one, by iterating over the array:

```html
<div v-for="post in posts">
	<div class="heading">{{post.title}}</div>
	<div class="summary">{{post.summary}}</div>
</div>
```

#### Rendering individual posts

Now, we want the visitor to be able to actually click and read a post, so we need to add a link, and for that we can use the ``router-link`` component which allows us to pass along a parameter to the **Post** component. In this case, we want the name of the markdown file, stored in ``post.path``.

```html
<div v-for="post in posts">
	<router-link :to="{ name: 'Post', params: { path: post.path } }">
		<div class="heading">{{post.title}}</div>
		<div class="summary">{{post.summary}}</div>
	</router-link>
</div>
```

As with the **Blog** component, we similarly need to make an HTTP request in the **Post** component and fetch the requested post from the repository:

```javascript
// Post.vue
export default {
	name: 'Post',
	data: function() {
		return {
			markdown: "" // Holds the markdown text
		}
	},
	//...
	created: function() {
		let path = this.$route.params.path;
		if (path) {
			fetch("https://.../master/static/" + path)
			     .then(response => response.json())
			     .then(response => this.markdown = response)
			     .catch(e => this.didGetError(e));
		}
	},
	//...
}
```

The content downloaded is stored in the ``markdown`` property. Before we can actually display it, we need to parse it. Using the ``marked`` package, this is pretty simple.

In the ``computed`` property of the **Post** component, add the following lines (don't forget to import ``marked``) to convert the markdown text:

```javascript
import marked from 'marked';

export default {
	name: 'Post',
	//...
	computed: {
		markdownText() {
			return marked(this.markdown);
		}
	}
}
```

(For proper syntax highlight, see [Bonus: syntax highlight](#bonus-syntax-highlight).)

Now, we can display the markdown content using the ``v-html`` directive:

```html
<!-- Post.vue -->
<section id="post">
	<div v-html="markdownText"></div>
</section>
```

#### Last step: routing

Finally, the last step is to make sure that the Vue Router correctly redirects visitors to the requested post. We want to use the same component for this, so we add a dynamic segment.

```javascript
// Vue-router
{
	path: '/blog',
	name: 'Blog',
	component: Blog
},
{
	path: '/blog/:path',
	name: 'Post',
	component: Post
},
```

Now, the URLs ``/blog/example.md`` and ``/blog/another.md`` both map to the same component.

#### Easy, peasy, lemon squeazy

And that is pretty much it. With this setup, I can just write up a post in Atom and directly push it to Github. (See the [furry-potato](https://github.com/pkrll/furry-potato) repository for more information on this.)

So, with the following keystrokes, I just published this post:

```bash
$ make INPUT=static/building-markdown-blog.md
```

#### Bonus: Syntax highlighting

To get proper syntax highlight for code blocks, I needed to add the ``highlight.js`` package.

In the ``created`` property of the **Post** component, add the following lines:

```javascript
import marked, { Renderer } from 'marked';

export default {
	name: 'Post',
	created: function() {
		const renderer = new Renderer();

		renderer.code = (code, language) => {
			const validLang = !!(language && hljs.getLanguage(language));
			const highlighted = validLang ? hljs.highlight(language, code).value : code;
			return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
		};

		marked.setOptions({ renderer });

		let path = this.$route.params.path;
		if (path) {
			fetch("https://.../master/static/" + path)
			     .then(response => response.json())
			     .then(response => this.markdown = response)
			     .catch(e => this.didGetError(e));
		}
	},
	//...
}
```

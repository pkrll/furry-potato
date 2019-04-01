# Publisher.js

A tool for publishing posts. This script is used for my Markdown-based [blog](https://saturnfive.se/blog).

#### Usage

To save a draft (but not publish it) of an article in the ``drafts`` directory, type the following command:

```bash
$ make save push
```

To publish an draft, type the following command:

```bash
$ make publish push
```

This will move the file from the ``drafts`` directory to ``static`` and update ``index.json``.

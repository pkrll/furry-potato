# Scripting on the Mac with Javascript

![cover](images/jxa.jpg)

###### Keywords: macOS, Javascript, JXA, Applescript

App scripting is one of those neat features of the Mac that I feel often gets overlooked. Although somewhat limited, it's a relatively simple way of automating applications and creating a more efficient workflow. While Applescript has long been the de facto language for Mac scripting, it is not the only one. In 2015, Apple introduced Javascript for Automation (JXA), bringing the popular front-end language into a whole new context.

#### Getting started with JXA

If you've ever done any Mac scripting, then you're probably familiar with the Script Editor application. In this guide, however, we're gonna use the ``osascript`` command to run our JXA scripts.

Let's start with a simple example, opening the Home folder with Finder.

```js
const app = Application("Finder")
app.home.open()
app.activate()
```

Before running this script, let us take a look at what we just wrote.

The first line invokes the ``Application`` method, which is arguably one of the most important methods to know about. It returns a JXA object for an application, enabling us to call any of its script methods. In our case, we create an instance of the ``Finder`` application.

The second line opens the home folder of the user in ``Finder`` by calling the ``open`` method on the ``home`` property of the object. The third line calls the ``activate`` method on the ``Finder`` object, bringing the window to the front.

We can run the above script either in the Script Editor or, as I prefer, directly in the terminal with the following command:

```bash
$ osascript finderScript.js
```

Of course, this is only a taste of what we can do.

#### Diving in

Not every application is scriptable. To see which ones, we can open the Script Dictionary through the Script Editor (File -> Open Dictionary...). For example, the entry for Spotify gives us the following (don't forget to change the language to Javascript):

**Spotify Suite:**

| Method  | Description  |
|---------|--------------|
| nextTrack |  Skip to the next track. |
| previousTrack |  Skip to the previous track. |
| playpause |  Toggle play/pause. |
| pause |  Pause playback. |
| ... |  ... |

These are just a few of the available methods we can call on the ``Spotify`` instance using JXA.

#### Scripting Spotify

Let's create a small script that outputs some basic information on the current playing track.

```js
#!/usr/bin/env osascript -l JavaScript

function getLength(duration) {
	const minutes = Math.floor(duration / (1000 * 60));
	const seconds = Math.floor(duration / 1000 % 60);

	return minutes + ":" + seconds;
}

function run(argv) {
	const Spotify = Application("Spotify");
	const track   = Spotify.currentTrack();

	console.log("Artist:\t\t " + track.artist());
	console.log("Song:\t\t " + track.name());
	console.log("Album:\t\t " + track.album());
	console.log("Length:\t\t " + getLength(track.duration()));
	console.log("Number of plays: " + track.playedCount());
	console.log("Popularity:\t " + track.popularity());
}
```

Running this script gives us the output:

```bash
❯ osascript test.js
Artist:          Bugseed
Song:            chapter
Album:           Fresh Jive
Length:          1:38
Number of plays: 0
Popularity:      59
```

We can even use macOS' notification system to display this information:

```js
#!/usr/bin/env osascript -l JavaScript

function displayNotification(title, subtitle, message) {
	const app = Application.currentApplication();
	app.includeStandardAdditions = true
	app.displayNotification(message, {
		withTitle: title,
		subtitle: subtitle
	});
}

function run(argv) {
	const Spotify = Application("Spotify");
	const track   = Spotify.currentTrack();
	const artist = track.artist();
	const song   = track.name();

	displayNotification(Spotify.name(), artist, song);
}
```

Here we introduce the new method ``currentApplication`` and the property ``includeStandardAdditions``. The ``currentApplication`` method just returns the app calling the script. The ``includeStandardAdditions`` property adds some extra stuff, like dialogs or notifications, to the application object if set true. The third line just creates a new notification.

#### JXA and ObjC

Like Applescript, JXA comes with a built-in Objective-C bridge allowing you to access native frameworks using Javascript. Basically, the bridge enables you to import any Cocoa framework. In essence, you could build Cocoa apps with JXA. Pretty neat, huh?

As I have never personally done that, I'm sticking to the basics here. For more information on creating actual apps, read <a href="https://tylergaw.com/articles/building-osx-apps-with-js/" target="_blank">__Tyler Gaw's excellent post__</a> on that.

Keeping with the Spotify theme, let's use ObjC to copy the current track's Spotify URL to the pasteboard.

The first thing we need to do, is to import the ``AppKit`` framework, which includes the ``NSPasteboard`` class. This can be done by invoking ``import`` method on the ``ObjC`` object:

```js
ObjC.import("AppKit");
```

With that, we have access to the ``AppKit`` framework, through the ``$`` object.

For example, if we want to create an ``NSData`` object from the string ``Foo``, we could do the following:

```js
ObjC.import("AppKit");
const string = $.NSString.alloc.initWithUTF8String("Foo")
               .dataUsingEncoding($.NSUTF8StringEncoding);
```

which is equivalent to the Objective-C code:

```objective-c
NSData *string = [[[NSString alloc] initWithUTF8String: "Foo"]
                                    dataUsingEncoding:NSUTF8StringEncoding];
```

Getting back to our Spotify example, we can in a similar way access the ``NSPasteboard`` object to copy a string to the clipboard:

```js
ObjC.import('AppKit');

function run(argv) {
	const track = Application("Spotify").currentTrack();

	$.NSPasteboard.generalPasteboard.clearContents
	$.NSPasteboard.generalPasteboard.setStringForType(
		track.spotifyUrl(),
		"public.utf8-plain-text"
	);
}
```

The first line imports ``AppKit``. In the ``run`` function, we first set the ``track`` constant to the current track. The next line clears the contents of the pasteboard (which we must do to be able to copy new contents to it), and the final line basically copies the return value of the ``spotifyUrl`` method of the track object, which is the URL to the current track.

As you might have noticed, manipulating the ``NSPasteboard`` is pretty similar to how we do it in ``Swift``, with the exception of ``$``, which we must use in JXA to access the pasteboard object.

#### More resources

And that's it. Obviously, there are a lot more to cover here, and perhaps I'll do a more in-depth post in the future. For now, if you're interested, there are a lot more resources out there. I recommend starting with the <a href="https://github.com/JXA-Cookbook/JXA-Cookbook" target="_blank">__JXA Cookbook__</a>.

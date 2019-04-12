# A Beginner's Guide to DTrace

###### Keywords: DTrace, macOS, DevOps, kernel tracing

There are a lot of tools for troubleshooting, debugging and profiling out there that we as software developers need to learn to master. Tools such as ``Instruments``, ``lldb`` or ``valgrind`` help us understand what's going on during the execution of our applications.

Perhaps we want to determine how much resources they use, follow the evolution of some data structure or just find and squash a bug. For the most part, this is all we need. Sometimes, though, we want to dig a bit deeper. We might need a better low level-view of how our app interacts with the operating system.

Unfortunately, most of these tools operate in user space, and therefore offer a process-centric view only.

Enter: DTrace. A powerful tool used to trace and probe running applications, DTrace allows us to examine the entire software stack and gain insights into the behaviour of both a user program and the operating system. This includes, for example, which system calls are made or which system files the process accesses.

In this post, I'll give a small introduction into the wondrous world of this diagnostics tool and showcase some of its strengths.

#### What is DTrace, really?

DTrace stands for Dynamic Tracing and is both a framework and an interpreter for the ``D`` language (not to be confused with the other ``D`` programming language). While it was first created for the Sun Solaris in 2005, it has since been ported to a number of other operating systems. Apart from Solaris, DTrace is available for BSD, some Linux distributions and macOS, which it comes shipped with by default. DTrace is even available for the Playstation Vita!

Today, efforts are being made to create a cross-platform tool through the <a href="https://github.com/opendtrace" target="_blank">__OpenDTrace__</a> project.

DTrace relies on so called *probes*. These probes are dynamically inserted into a process and can be thought of as sensors that triggers whenever a certain event occurs, for example a system call or entry into a kernel function. If an *action* is bound to a probe, DTrace will perform it when that probe activates (or *fires*).

DTrace can be invoked in two ways. Either as a one-liner directly in the Terminal, or with a script passed to it:

```bash
$ sudo dtrace -n 'dtrace:::BEGIN { printf("Hello World!\n"); }'
$ sudo dtrace -s script.d
```

#### The anatomy of a DTrace script

The structure of a DTrace script is pretty simple. It consists of clauses that describe a probe. These clauses can contain a predicate and in the body we can define a number of statements to be evaluated when the probe fires.

```c
provider:module:function:name
/predicate/
{
  action statements
}
```

The first line is the probe description. This is a 4-tuple that identifies a probe.


<div class="sidebox" style="width: 50%; margin: 20px 0px 20px 20px; float: right; border: 1px solid #000; border-radius: 8px; padding: 10px; background: rgb(250, 250, 250);">
<h5 style="margin: 0;">Beware, macOS users!</h5><p>As of macOS 10.11 (El Capitan), Apple introduced the security feature System Integrity Protection (SIP), that aims to protect system files and processes. Unfortunately, this also severely cripples DTrace functionality. In order for us to be able to get the full benefit of DTrace, we need to disable SIP.</p>
<h5 style="margin: 0;">Disabling SIP</h5><p>This can be done by rebooting into recovery mode, and running the following commands in the Terminal:</p>
<pre><code>$ csrutil clear
$ csrutil enable --without dtrace</code></pre>
<p>Upon restart, we can run DTrace normally!</p>
</div>

The first part of the description is the ``provider``, an entity (e.g. ``syscall`` or ``lockstat``) that makes probes available to DTrace for instrumentation. The ``module`` field lets us limit our scope to a library, while ``function`` is the function we want to probe. ``name`` is the name of the probe. We can omit one or more of these components of the description.

The ``predicate`` is an expression that allows us to only execute the action when certain conditions (described in the predicate) are met. For example, the predicate ``/execname == "foo"/``, ensures that the probe body is executed only if the process triggering the probe is named ``foo``. The predicate is optional, as well.

The action statements, the actual code to be run, are placed between the curly-braces. If you're already familiar with ``C``, then you should be able to pick up the ``D`` pretty fast.

#### Our first script

Let's start with a small script that lists all processes that launches. For this, we can use the ``proc`` provider that gives us access to the probe named ``exec-success``. This probe is fired after a process image has been loaded, that is, after the ``exec()`` system call has finished replacing the forked processes memory with the new program.

For now, we just want to print the name of the process that has successfully launched. We can retrieve the name through a special, built-in variable called ``execname``.

We'll do this as a one-liner in the Terminal. Type the following command. While running, open a few processes and return to the Terminal. Abort the script with ``CTRL+C``. You should be met with a similar output:

```bash
$ sudo dtrace -n 'proc:::exec-success { printf("%s", execname); }'
dtrace: description 'proc:::exec-success ' matched 1 probe
CPU     ID                    FUNCTION:NAME
  3   1264 dtrace_thread_bootstrap:exec-success python3.7
  0   1264 dtrace_thread_bootstrap:exec-success Python
  1   1264 dtrace_thread_bootstrap:exec-success sh
  0   1264 dtrace_thread_bootstrap:exec-success uname
  0   1264 dtrace_thread_bootstrap:exec-success file
  1   1264 dtrace_thread_bootstrap:exec-success git
  1   1264 dtrace_thread_bootstrap:exec-success sh
  2   1264 dtrace_thread_bootstrap:exec-success systemsetup
  0   1264 dtrace_thread_bootstrap:exec-success xpcproxy
  0   1264 dtrace_thread_bootstrap:exec-success nginx
^C
```

In my case, saving a file in ``Atom`` is apparently dependent on some ``Python`` script, as well as the processes ``sh``, ``uname``, ``file`` and ``git``.

Of course, we could've also created a script, by defining the probe as described above:

```c
proc:::exec-success {
	printf("%s", execname);
}
```

To run this in the Terminal, we would just supply DTrace with the ``-s`` flag and the path to the script:

```bash
$ sudo dtrace -s trace.d
```

DTrace probes can also provide up to ten arguments, accessible by the built-in variables ``arg0``, ``arg1``, ... ``arg9``.

As an example, we can use the ``exec`` probe, which fires whenever the ``exec()`` system call is made. This probe provides the path of the new process image as its first argument. To print this, we can just modify the previous script.

Replace the ``exec-success`` probe with ``exec``, and add ``arg0`` as an argument to the ``printf`` method, and you should be met with a similar output:

```bash
$ sudo dtrace -n 'proc:::exec { printf("%s at %s", execname, stringof(arg0)); }'
dtrace: description 'proc:::exec ' matched 1 probe
CPU     ID      FUNCTION:NAME
  0   2133   posix_spawn:exec Atom Helper at /usr/local/sbin/python3
  0   2133   posix_spawn:exec Atom Helper at /Users/ardalansamimi/Public/Git/encore/release/python3
...
```

You might wonder why we needded to use the weird ``stringof`` function? The ``arg0`` argument is merely a pointer to the string that contains the path of the image. To convert it to an actual string, we need to use the built-in function ``stringof``. This function will convert a pointer in the kernel space into a string. There are several other built-in functions and variables that we can use, for example ``copyinstr`` that is the user space-counterpart of ``stringof``.



#### Tip of the iceberg

This was just the tip of the iceberg. More resources available...

I recently had the pleasure (after weeks of displeasure, of course, getting to know the tool) of working with DTrace, during a project where we wrote a toolset for the <a href="https://github.com/parapluu/encore" target="_blank">__Encore compiler__</a>.

Feel free to check <a href="https://github.com" target="_blank">__that__</a> out to see how to work with custom probes.

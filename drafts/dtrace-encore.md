# A Quick Start Guide to DTrace

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

The first part of the description is the ``provider``, an entity (e.g. ``syscall`` or ``lockstat``) that makes probes available to DTrace for instrumentation. The ``module`` field lets us limit our scope to a library, while ``function`` is the function we want to probe. ``name`` is the name of the probe.

We can omit one or more of these components of the description.

The ``predicate`` is an expression that allows us to only execute the action when certain conditions (described in the predicate) are met. For example, the predicate ``/execname == "foo"/``, ensures us that the action statements are performed only if the process triggering the probe is named ``foo``. The predicate is optional.

The action statements, the actual code to be run, are placed between the curly-braces.

Before we get started, we need to make sure we can run DTrace (if you are not a macOS user, you can skip this next part).

#### First things first

As of macOS 10.11 (El Capitan), Apple introduced the security feature System Integrity Protection (SIP), that aims to protect system files and processes. Unfortunately, this also severely cripples DTrace functionality. In order for us to be able to get the full benefit of DTrace, we need to disable SIP.

#### Disabling SIP

This can be done by rebooting into recovery mode, and running the following commands in the Terminal:

```bash
$ csrutil clear
$ csrutil enable --without dtrace
```

Upon restart, we can run DTrace normally! Let's try it out.

#### Our first script

Let's start with a small script that lists all processes that launches. Write the following probe and save it as a file ``trace.d``:

```c
proc:::exec-success {
	printf("%s", execname);
}
```

Here, we specify the probe ``exec-success`` of the ``proc`` provider. This probe fires whenever a process image has been loaded. The only action we perform is to print the name of the process being launched.

Run it in the Terminal:

```bash
$ sudo dtrace -s trace.d
```

While running, open a few processes and return to the Terminal. Abort the script the ``CTRL+C``. You should be met with a similar output:

```bash
dtrace: script 'trace.d' matched 1 probe
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

DTrace probes can also provide up to ten arguments, accessible by the ``arg0``, ``arg1``, ... ``arg9`` built-in variables.

As an example, we can use the ``exec`` probe, which provides the path of the new process image as its first argument, to print the name of a process being launched along with the path to its image.

```c
proc:::exec {
	printf("%s at %s", execname, stringof(arg0));
}
```

Running the above script gives me the following output:

```bash
$ sudo dtrace -s trace.d
dtrace: script 'trace.d' matched 2 probes
CPU     ID      FUNCTION:NAME
  0   2133   posix_spawn:exec Atom Helper at /usr/local/sbin/python3
  0   2133   posix_spawn:exec Atom Helper at /Users/ardalansamimi/Public/Git/encore/release/python3
...
```

You might have notice that we used a weird function, ``stringof``. This is a built-in function that converts a pointer in the kernel space into a string. There are several other built-in functions and variables that we can use, for example ``copyinstr`` that is the user space-counterpart of ``stringof``.

There are

#### Tip of the iceberg

This was just the tip of the iceberg. More resources available...

I recently had the pleasure (after weeks of displeasure, of course, getting to know the tool) of working with DTrace, during a project where we wrote a toolset for the <a href="https://github.com/parapluu/encore" target="_blank">__Encore compiler__</a>.

Feel free to check <a href="https://github.com" target="_blank">__that__</a> out to see how to work with custom probes.

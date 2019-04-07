# A Quick Start Guide to DTrace

###### Keywords: DTrace, macOS, DevOps, kernel tracing

These days, there are a lot of tools for troubleshooting, debugging and profiling out there, that we as software developers need to learn to master. Tools such as XCode/Instruments, ``lldb`` or ``valgrind`` help us understand what's going on during the execution of our applications. Perhaps we want to determine how much resources they use, follow the evolution of some data structure or just find and squash a bug.

However, as most of these tool operate in user space, we're usually left in the dark when it comes to measuring how they interact with the operating system.

Enter: DTrace. A powerful tool used to trace and probe running applications, DTrace allows us to examine the entire software stack and gain insights into the behaviour of both a user program and the operating system. This includes, for example, which system calls are made or which system files the process accesses.

In this post, I'm gonna give a small introduction into the wondrous world of this diagnostics tool and showcase some of its strengths.

#### What is DTrace, really?

DTrace stands for Dynamic Tracing and is both a framework and an interpreter for the D language (not to be confused with the other D programming language). While it was first created for the Sun Solaris in 2005, it has since been ported to a number of other operating systems. Apart from Solaris, DTrace is available for BSD, some Linux distros and even macOS, which it comes shipped with by default. Today, efforts are being made to create a cross-platform tool through the <a href="https://github.com/opendtrace" target="_blank">__OpenDTrace__</a> project.

DTrace relies on so called *probes*, that it dynamically inserts into a process. These probes can be thought of as sensors that triggers whenever a certain event happens, for example a system call or entry into a kernel function. If an action is bound to a probe, DTrace will perform it when that probe activates (or *fires*).



#### The anatomy of a DTrace script

DTrace can be invoked in

```c
provider:module:function:name
/predicate/
{
  //action statements
}
```

#### First things first

As of macOS 10.11 (El Capitan), Apple introduced the security feature System Integrity Protection (SIP), that aims to protect system files and processes. Unfortunately, this also severely cripples DTrace functionality. In order for us to be able to get the full benefit of DTrace, we need to disable SIP.

#### Disabling SIP

This can be done by rebooting into recovery mode, and running the following commands in the Terminal:

```bash
$ csrutil clear
$ csrutil enable --without dtrace
```

Upon restart, we can run DTrace normally!


#### Tip of the iceberg

This was just the tip of the iceberg. More resources available...

I recently had the pleasure (after weeks of displeasure, of course, getting to know the tool) of working with DTrace, during a project where we wrote a toolset for the <a href="https://github.com/parapluu/encore" target="_blank">__Encore compiler__</a>.

Feel free to check <a href="https://github.com" target="_blank">__that__</a> out to see how to work with custom probes.

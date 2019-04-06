# A Quick Start Guide to DTrace

###### keywords: DTrace, macOS, DevOps, kernel tracing

There are a lot of tools for troubleshooting, debugging and profiling out there these days, that we as software developers need to learn to master. Tools such as LLDB, Valgrind or Instruments helps us understand what's going on during the execution of our applications and makes it possible to, for example, determine how much resources they use, follow the evolution of some data structure or just find and squash bugs.

However, as most of these tool operate in user space, we're usually left in the dark when it comes to measuring how they interact with the operating system.

Enter: DTrace. A powerful tool used to trace and probe running applications, DTrace allows us to gain insights into the behaviour of both a user program and the operating system itself.
DTrace is a powerful tool used to trace and probe running applications to gain insights into the behaviour of both a user program and the operating system. I recently had the pleasure (after weeks of displeasure, of course, getting to learn the tool) of working with DTrace, during a project where we wrote a toolset for the <a href="https://github.com/parapluu/encore" target="_blank">__Encore compiler__</a>, which is being developed at Uppsala university as part of the EU FP7 UpScale project.



#### The anatomy of a DTrace script

DTrace

```c
provider:module:function:name
/predicate/
{
  //action statements
}
```

#### First things first

As of macOS 10.11 (El Capitan), Apple introduced the security feature System Integrity Protection (SIP), that aims to protect system files and processes. However, this also severely cripples DTrace functionality. In order for us to be able to get the full benefit of DTrace, we need to disable SIP for DTrace.

#### Disabling SIP

To disable the SIP feature, we need to restart in recovery mode and run the following command in the Terminal:

```bash
$ csrutil clear
$ csrutil enable --without dtrace
```

Upon restart, we can run DTrace normally!

#### Our first script

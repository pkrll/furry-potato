# Using DTrace to probe a process

###### keywords: DTrace, macOS, Encore



#### The anatomy of a DTrace script

```c
provider:module:function:name
/predicate/
{
  //action statements
}
```

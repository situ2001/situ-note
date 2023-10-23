---
title: 解决运行时插桩的示例代码运行错误的问题
comments: true
date: 2022-02-27 15:10:00
description: 好好的代码怎么就Segmentation fault了呢
categories: CS:APP
---

## 出错

CS:APP 的第七章 Linking，书上给出了许多的示例代码

众所周知，我们可以利用 `<dlfcn.h>` 这个库进行运行时的代码插桩

在介绍 Run-time interposing 的时候，书本给出了如下的代码，文件名为 `mymalloc.c`

注：代码在书本的第712页（机工出版社的《深入理解计算机系统》英文版第三版）

下面为 `RUNTIME` 部分，其他部分已略去

```c
#ifdef RUNTIME
#define _GNU_SOURCE
#include <stdio.h>
#include <stdlib.h>
#include <dlfcn.h>

/* malloc wrapper function */
void *malloc(size_t size)
{
    void *(*mallocp)(size_t size);
    char *error;

    mallocp = dlsym(RTLD_NEXT, "malloc"); /* Get address of libc malloc */
    if ((error = dlerror()) != NULL) {
        fputs(error, stderr);
        exit(1);
    }
    char *ptr = mallocp(size); /* Call libc malloc */
    printf("malloc(%d) = %p\n", (int)size, ptr);
    return ptr;
}

/* free wrapper function */
void free(void *ptr)
{
    void (*freep)(void *) = NULL;
    char *error;

    if (!ptr)
        return;

    freep = dlsym(RTLD_NEXT, "free"); /* Get address of libc free */
    if ((error = dlerror()) != NULL) {
        fputs(error, stderr);
        exit(1);
    }
    freep(ptr); /* Call libc free */
    printf("free(%p)\n", ptr);
}
#endif
```

测试用的代码 `int.c` 如下

```c
#include <stdio.h>
#include <malloc.h>

int main()
{
    int *p = malloc(32);
    free(p);
    return(0); 
}
```

读过书的人都知道，测试用代码的 `malloc()` 和 `free()` ，实际调用的是 `mymalloc.c` 上的 `malloc()` 和 `free()`

在执行前，先编译和链接吧，根据书上的说法，我们要这样进行操作

先把 `mymalloc.c` 编译为 Shared Object

```shell
gcc -Wall -DRUNTIME -shared -fpic -o mymalloc.so mymalloc.c -ldl
```

把 `int.c` 编译为可执行目标文件 `intr`

```shell
gcc -o intr int.c
```

若要运行，要指定动态链接器要优先搜索的共享库，即设置环境变量 `LD_PRELOAD`

```shell
LD_PRELOAD="./mymalloc.so" ./intr
```

而当我们“顺利”地来到最后一步的时候，终端却把一个 Segmentation fault 狠狠地甩在了你脸上！

```shell
situ@ubuntu:~/Desktop/solutions-csapp/chapter7/interpose$ LD_PRELOAD="./mymalloc.so" ./intr
Segmentation fault (core dumped)
```

## 调试

哎呀，怎么我跟着书本好好操作，结果就错了呢？是爆栈了呢还是访问到了不允许访问的内存区域呢还是其他玄学问题呢？

提前猜猜可以是可以，但是，先辈告诉我们，出错的时候不要瞎猜，要好好地动起自己的双手，利用现有的工具(`gdb`)，来进行调试排错

想到这里，我立即进行调试

```shell
gdb ./intr
```

在 gdb 中，指定环境变量 `LD_PRELOAD`

```shell
(gdb) set exec-wrapper env 'LD_PRELOAD=./mymalloc.so'
```

运行，果不其然，我们得到了 Segmentation fault 错误

```shell
(gdb) run
Starting program: /home/situ/Desktop/solutions-csapp/chapter7/interpose/intr 

Program received signal SIGSEGV, Segmentation fault.
0x00007ffff7f20844 in __GI__dl_catch_exception (exception=exception@entry=0x7fffff7ff0c0, operate=0x7ffff7db8490 <dlsym_doit>, args=0x7fffff7ff130)
    at dl-error-skeleton.c:175
175     dl-error-skeleton.c: No such file or directory.
```

不多哔哔，先看看 stack trace

```shell
(gdb) info stack
#0  0x00007ffff7f20844 in __GI__dl_catch_exception (exception=exception@entry=0x7fffff7ff0c0, operate=0x7ffff7db8490 <dlsym_doit>, 
    args=0x7fffff7ff130) at dl-error-skeleton.c:175
#1  0x00007ffff7f20983 in __GI__dl_catch_error (objname=0x7ffff7dbc0f0 <last_result+16>, errstring=0x7ffff7dbc0f8 <last_result+24>, 
    mallocedp=0x7ffff7dbc0e8 <last_result+8>, operate=<optimized out>, args=<optimized out>) at dl-error-skeleton.c:227
#2  0x00007ffff7db8b59 in _dlerror_run (operate=operate@entry=0x7ffff7db8490 <dlsym_doit>, args=args@entry=0x7fffff7ff130) at dlerror.c:170
#3  0x00007ffff7db8525 in __dlsym (handle=<optimized out>, name=0x7ffff7fc4000 "malloc") at dlsym.c:70
#4  0x00007ffff7fc31bc in malloc () from ./mymalloc.so
#5  0x00007ffff7e41e84 in __GI__IO_file_doallocate (fp=0x7ffff7fa96a0 <_IO_2_1_stdout_>) at filedoalloc.c:101
#6  0x00007ffff7e52050 in __GI__IO_doallocbuf (fp=fp@entry=0x7ffff7fa96a0 <_IO_2_1_stdout_>) at libioP.h:948
#7  0x00007ffff7e510b0 in _IO_new_file_overflow (f=0x7ffff7fa96a0 <_IO_2_1_stdout_>, ch=-1) at fileops.c:745
#8  0x00007ffff7e4f835 in _IO_new_file_xsputn (n=7, data=<optimized out>, f=<optimized out>) at libioP.h:948
#9  _IO_new_file_xsputn (f=0x7ffff7fa96a0 <_IO_2_1_stdout_>, data=<optimized out>, n=7) at fileops.c:1197
#10 0x00007ffff7e36af2 in __vfprintf_internal (s=0x7ffff7fa96a0 <_IO_2_1_stdout_>, format=0x7ffff7fc4007 "malloc(%d) = %p\n", 
    ap=ap@entry=0x7fffff7ff890, mode_flags=mode_flags@entry=0) at ../libio/libioP.h:948
#11 0x00007ffff7e21ebf in __printf (format=<optimized out>) at printf.c:33
#12 0x00007ffff7fc3224 in malloc () from ./mymalloc.so
#13 0x00007ffff7e41e84 in __GI__IO_file_doallocate (fp=0x7ffff7fa96a0 <_IO_2_1_stdout_>) at filedoalloc.c:101
#14 0x00007ffff7e52050 in __GI__IO_doallocbuf (fp=fp@entry=0x7ffff7fa96a0 <_IO_2_1_stdout_>) at libioP.h:948
#15 0x00007ffff7e510b0 in _IO_new_file_overflow (f=0x7ffff7fa96a0 <_IO_2_1_stdout_>, ch=-1) at fileops.c:745
#16 0x00007ffff7e4f835 in _IO_new_file_xsputn (n=7, data=<optimized out>, f=<optimized out>) at libioP.h:948
#17 _IO_new_file_xsputn (f=0x7ffff7fa96a0 <_IO_2_1_stdout_>, data=<optimized out>, n=7) at fileops.c:1197
#18 0x00007ffff7e36af2 in __vfprintf_internal (s=0x7ffff7fa96a0 <_IO_2_1_stdout_>, format=0x7ffff7fc4007 "malloc(%d) = %p\n", 
    ap=ap@entry=0x7fffff800080, mode_flags=mode_flags@entry=0) at ../libio/libioP.h:948
#19 0x00007ffff7e21ebf in __printf (format=<optimized out>) at printf.c:33
#20 0x00007ffff7fc3224 in malloc () from ./mymalloc.so
#21 0x00007ffff7e41e84 in __GI__IO_file_doallocate (fp=0x7ffff7fa96a0 <_IO_2_1_stdout_>) at filedoalloc.c:101
#22 0x00007ffff7e52050 in __GI__IO_doallocbuf (fp=fp@entry=0x7ffff7fa96a0 <_IO_2_1_stdout_>) at libioP.h:948
#23 0x00007ffff7e510b0 in _IO_new_file_overflow (f=0x7ffff7fa96a0 <_IO_2_1_stdout_>, ch=-1) at fileops.c:745
```

好长的的 trace，经过一番观察，发现了这么一个情况：malloc在不断地被递归调用！最后一次调用的时候，可以看出，爆栈了

```shell
#0  0x00007ffff7f20844 in __GI__dl_catch_exception (exception=exception@entry=0x7fffff7ff0c0, operate=0x7ffff7db8490 <dlsym_doit>, 
    args=0x7fffff7ff130) at dl-error-skeleton.c:175
#1  0x00007ffff7f20983 in __GI__dl_catch_error (objname=0x7ffff7dbc0f0 <last_result+16>, errstring=0x7ffff7dbc0f8 <last_result+24>, 
    mallocedp=0x7ffff7dbc0e8 <last_result+8>, operate=<optimized out>, args=<optimized out>) at dl-error-skeleton.c:227
#2  0x00007ffff7db8b59 in _dlerror_run (operate=operate@entry=0x7ffff7db8490 <dlsym_doit>, args=args@entry=0x7fffff7ff130) at dlerror.c:170
#3  0x00007ffff7db8525 in __dlsym (handle=<optimized out>, name=0x7ffff7fc4000 "malloc") at dlsym.c:70
#4  0x00007ffff7fc31bc in malloc () from ./mymalloc.so
```

我们先去栈底看看吧

```shell
(gdb) info stack -20
#32994 0x00007ffff7e36af2 in __vfprintf_internal (s=0x7ffff7fa96a0 <_IO_2_1_stdout_>, format=0x7ffff7fc4007 "malloc(%d) = %p\n", 
    ap=ap@entry=0x7fffffffcee0, mode_flags=mode_flags@entry=0) at ../libio/libioP.h:948
#32995 0x00007ffff7e21ebf in __printf (format=<optimized out>) at printf.c:33
#32996 0x00007ffff7fc3224 in malloc () from ./mymalloc.so
#32997 0x00007ffff7e41e84 in __GI__IO_file_doallocate (fp=0x7ffff7fa96a0 <_IO_2_1_stdout_>) at filedoalloc.c:101
#32998 0x00007ffff7e52050 in __GI__IO_doallocbuf (fp=fp@entry=0x7ffff7fa96a0 <_IO_2_1_stdout_>) at libioP.h:948
#32999 0x00007ffff7e510b0 in _IO_new_file_overflow (f=0x7ffff7fa96a0 <_IO_2_1_stdout_>, ch=-1) at fileops.c:745
#33000 0x00007ffff7e4f835 in _IO_new_file_xsputn (n=7, data=<optimized out>, f=<optimized out>) at libioP.h:948
#33001 _IO_new_file_xsputn (f=0x7ffff7fa96a0 <_IO_2_1_stdout_>, data=<optimized out>, n=7) at fileops.c:1197
#33002 0x00007ffff7e36af2 in __vfprintf_internal (s=0x7ffff7fa96a0 <_IO_2_1_stdout_>, format=0x7ffff7fc4007 "malloc(%d) = %p\n", 
    ap=ap@entry=0x7fffffffd6d0, mode_flags=mode_flags@entry=0) at ../libio/libioP.h:948
#33003 0x00007ffff7e21ebf in __printf (format=<optimized out>) at printf.c:33
#33004 0x00007ffff7fc3224 in malloc () from ./mymalloc.so
#33005 0x00007ffff7e41e84 in __GI__IO_file_doallocate (fp=0x7ffff7fa96a0 <_IO_2_1_stdout_>) at filedoalloc.c:101
#33006 0x00007ffff7e52050 in __GI__IO_doallocbuf (fp=fp@entry=0x7ffff7fa96a0 <_IO_2_1_stdout_>) at libioP.h:948
#33007 0x00007ffff7e510b0 in _IO_new_file_overflow (f=0x7ffff7fa96a0 <_IO_2_1_stdout_>, ch=-1) at fileops.c:745
#33008 0x00007ffff7e4f835 in _IO_new_file_xsputn (n=7, data=<optimized out>, f=<optimized out>) at libioP.h:948
#33009 _IO_new_file_xsputn (f=0x7ffff7fa96a0 <_IO_2_1_stdout_>, data=<optimized out>, n=7) at fileops.c:1197
#33010 0x00007ffff7e36af2 in __vfprintf_internal (s=0x7ffff7fa96a0 <_IO_2_1_stdout_>, format=0x7ffff7fc4007 "malloc(%d) = %p\n", 
    ap=ap@entry=0x7fffffffdec0, mode_flags=mode_flags@entry=0) at ../libio/libioP.h:948
#33011 0x00007ffff7e21ebf in __printf (format=<optimized out>) at printf.c:33
#33012 0x00007ffff7fc3224 in malloc () from ./mymalloc.so
#33013 0x000055555555517f in main ()
```

## 分析

从上面的调试结果，我们从栈上截取一部分，下面是 `malloc()` 被调用一次的时候，栈上的内容

```shell
#33005 0x00007ffff7e41e84 in __GI__IO_file_doallocate (fp=0x7ffff7fa96a0 <_IO_2_1_stdout_>) at filedoalloc.c:101
#33006 0x00007ffff7e52050 in __GI__IO_doallocbuf (fp=fp@entry=0x7ffff7fa96a0 <_IO_2_1_stdout_>) at libioP.h:948
#33007 0x00007ffff7e510b0 in _IO_new_file_overflow (f=0x7ffff7fa96a0 <_IO_2_1_stdout_>, ch=-1) at fileops.c:745
#33008 0x00007ffff7e4f835 in _IO_new_file_xsputn (n=7, data=<optimized out>, f=<optimized out>) at libioP.h:948
#33009 _IO_new_file_xsputn (f=0x7ffff7fa96a0 <_IO_2_1_stdout_>, data=<optimized out>, n=7) at fileops.c:1197
#33010 0x00007ffff7e36af2 in __vfprintf_internal (s=0x7ffff7fa96a0 <_IO_2_1_stdout_>, format=0x7ffff7fc4007 "malloc(%d) = %p\n", 
    ap=ap@entry=0x7fffffffdec0, mode_flags=mode_flags@entry=0) at ../libio/libioP.h:948
#33011 0x00007ffff7e21ebf in __printf (format=<optimized out>) at printf.c:33
#33012 0x00007ffff7fc3224 in malloc () from ./mymalloc.so
```

可以很明显地看出 `printf` 函数的内部调用中，`__GI__IO_file_doallocate()` 也调用了 `malloc()` 这个函数！

很好，我们找到了导致 `malloc()` 被递归调用的源头，就是我们的定义的 `malloc()` 里头的 `printf()`

## 解决

要解决这个问题，关键就是：只让 `printf()` 被调用一次，打印出我们要的信息就行了。

也就是说，`malloc()` 里头的 `printf()` 的内部函数调用我们的 `malloc()` 的时候，我们的 `malloc()` 里头的 `printf()` 不能再次被调用

想一想，这不是很像一个递归函数的结束条件吗？

有方向了，立即上手进行修改

给

```c
printf("malloc(%d) = %p\n", (int)size, ptr);
```

加个 `flag` 和条件判断

```c
static char flag = 0;
if (flag == 0)
{
    flag = 1;
    printf("malloc(%d) = %p\n", (int)size, ptr);
    flag = 0;
}
```

修改后再次编译。接着运行 `intr`

```shell
situ@ubuntu:~/Desktop/solutions-csapp/chapter7/interpose$ LD_PRELOAD="./mymalloc.so" ./intr
malloc(32) = 0x555604a602a0
free(0x555604a602a0)
```

YES 问题解决！

## 最后

问题解决是解决了，但我很好奇，为什么会出现这种错误呢？

虽然人无完人，物无完物，但我还想再想多一步，，，

其实吧，这本书的作者这么厉害，那我认为，这个错误不是无意犯下的，它应该只是作者为了减少读者的思想负担，才写成这个样子吧 ~~强行解释~~

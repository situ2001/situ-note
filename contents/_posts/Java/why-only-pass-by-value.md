---
title: 为什么Java只能按值传递
comments: true
date: 2021-04-08 22:00:00
tags:
permalink: contents/f72c0c28b1d9/
categories: Java
---

为什么我会突然想写一篇毫无卵用的文章...

<!-- more -->

众所周知，在学习Java或者JavaScript（亦或者更多其他的OOP语言）的时候，到面向对象部分，一定会碰到reference variable吧。即是对对象的引用变量。

然后来到调用方法传参的时候，会有这种东西

``` java
void test(Foo foo) {}

// main
Foo foo = new Foo();
test(foo);
```

书上告诉我，这种属于pass-by-value，并且在Java里头也只能以值传参。

之前的我：这不是传对对象的引用变量吗，怎么是按值传递呢？

现在的我：噢...之前的我太naive了

首先，大家都知道Java的对象都是new在堆上的（除了一些wrapper type比如Integer、Boolean这些会有一部分存在stack上）。

那`new`之后的具体流程是什么呢？

## 字节码

当然还是要靠`javap`来得到字节码。比如下面这段代码

``` java
class Foo {}

public class Test {
    public static void main(String[] args) {
        Foo foo = new Foo();
    }
}
```

`javap`后得到

``` java
0: new           #7                  // class test/Foo
3: dup
4: invokespecial #9                  // Method test/Foo."<init>":()V
7: astore_1
```

那么短短的一句`Foo foo = new Foo()`就出现了。这么几条

1. 在堆上开辟一段未初始化的空间，并把object（应该是这块空间的内存地址）压入栈
2. 使用dup来复制多一份这个object
3. 使用invokespecial来调用`Foo.<init>`，初始化这个对象，栈顶object被消耗，出栈
4. 把此时栈顶的object赋值给局部变量

那如果不把这个栈上的值赋值给一个局部变量呢？我们把原代码中的新建对象并赋值给干掉，只剩`new Foo()`。就会得到如下

``` java
0: new           #7                  // class test/Foo
3: dup
4: invokespecial #9                  // Method test/Foo."<init>":()V
7: pop
```

直接pop掉了。

## 总结

类类型的变量上存的估计就是一个具体对象的地址的值了，而在赋值给其他变量或者传参时，传的就是这个值。

所以Java只能`pass-by-value`是很合理的

~~所以我为什么会写这篇文章...是为了水吗~~
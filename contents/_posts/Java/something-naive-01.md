---
title: 反思之概念理解不可粗糙
date: 2020-10-09 20:01:45
tags:
permalink: contents/5a4f09596a4e/
categories: Java
---

粗糙的学习与理解 必然会带来日后的隐患

这不 咱最近就出现了一个问题

<!-- more -->

## 危险想法

我原来认为：包装类与基本数据类型可以相互转化，而数组是对象，所以 `int[]` 和 `Integer[]` 初始化出来的数组一定都是对象

## 咱被迷惑

前些天太浪了，导致咱最近在赶Java学习进度，一路高歌赶到多态~~以集齐OOP三件套~~

直到~~在水职业指导课的时候~~碰到一道自己难以回答的Check Point之后，才发觉暴力拔苗助长不可取，就好似人不可能一口吃下一个胖子一样

这个问题是这样的

``` java
What is wrong with in the following code?

public class Test {
  public static void main(String[] args) {
    Integer[] list1 = {12, 24, 55, 1};
    Double[] list2 = {12.4, 24.0, 55.2, 1.0};
    int[] list3 = {1, 2, 3};
    printArray(list1);
    printArray(list2);
    printArray(list3);
  }

  public static void printArray(Object[] object) {
    for (object: o)
      System.out.print(o + " ");
    System.out.println();
  }
}
```

上题来自Java教材 **Introduction to Java Programming and Data Structures Comprehensive Version** 的 Page.427 **Check Point 11.8.4**

## 绞尽脑汁

看到这道题的时候我只想到 pass 到 method printArray 的是对象的reference，而数组都是对象啊，这题目，哪里有错误啊

“一定是粗心的坏习惯犯了！” 我想

然而不管我怎么看，~~左看右看正看倒看反复观看~~都看不出来

此时水课过了一半，响起了下课铃 ~~吓得我吃了几个好丽友蛋黄派~~

## 一瞬报错

而最后中午回到宿舍，马上把代码码了上去，发现报错如下

``` bash
Exception in thread "main" java.lang.Error: Unresolved compilation problem:
    The method printArray(Object[]) in the type Test is not applicable for the arguments (int[])
```

阅读这报错内容，基本可以得知, int[] type 竟然不是对象类型???

震惊，难道数组在Java中不是属于对象吗？

挺秃然的.jpg

## 开始混乱

~~迷惑行为开始了~~

我对比了一下这两行代码

``` java
  Integer[] list1 = {12, 24, 55, 1};
  int[] list3 = {1, 2, 3};
```

不就一个用的 Integer[] type 而另一个用的 int type 吗？

回想起之前看过的 **A primitive type can be automatically converted to an object using a wrapper class, and vice versa.**

也就是说，Java是允许基本数据类型和 **Wrapper Class** 类型相互转换的，这种转换叫做**autoboxing** 和 **autounboxing** （一般是在赋值的时候？）

就好比下面这俩语句是等效的

`Integer i = new Integer(1);` and `Integer i = 1;` are **equivalent**

`int i = 1;` and `int i = new Integer(1);` are also **equivalent**

不过

在我先前的概念里面，数组不是被Java当成对象处理了吗？

那用 int[] 和 Integer[] 声明出来的数组，不都是属于一个对象吗？

不能pass到method printArray就奇怪了

## 仔细咀嚼

emm能报错的话，一定有它的道理，而书上很大概率会单独开一段话提及的

我尝试开始翻书阅览相关内容，终于，我找到了很明显的一段话 ~~当初肯定是仓促学习而略读了~~

``` java
Consider the following example:
  1 Integer[] intArray = {1, 2, 3};
  2 System.out.println(intArray[0] + intArray[1] + intArray[2]);

  In line 1, the prmitive values 1, 2 and 3 are automatically boxed into objects new Integer(1), new Integer(2), and new Integer(3).

  In line 2, the objects intArray[0], intArray[1], and intArray[2] are automatically unboxed into int values that are added together.
```

好了，看完这段话我开始明白我的错误之处了 ~~这么长的一段话我当初怎么略读掉的~~

噢原来 Integer[] type 是创建一个包含有多个Integer对象的数组啊

比如，这里有一个`Student`类，我们可以用`Student[]`来声明包含多个Student对象的数组

那么int[] type呢，原来创建的是包含有多个int基本数据类型的数组，里面的每一个元素都是一个基本数据类型的值

如果我们把 `int[] array = new int[100]` 称之为

`An array that contains 100 numbers`

它叫做 **Array of primitive values**

那么`Integer[] array = new Integer[100]` 则是

`An array that contains 100 objects`

而它叫做 **Array of objects**

~~这个东西在OOP上手的时候就已经提到过了，不要被包装类和基本数据类型转换这玩意迷惑了眼睛~~

## 总结错误

回到下面的代码

``` java
  Integer[] list1 = {12, 24, 55, 1};
  int[] list3 = {1, 2, 3};
```

通过前面重新回顾和学习的成果

**我们可见** list1数组它本身也是一个对象，并且是一个包含了好几个**对象**形如`new Integer(1)`的数组；而list3数组它本身也是一个对象，只不过里面包含的是好几个基本类型的数值而已

## 写在最后

做事要一步一步慢慢来，这才是符合科学和实践规律的

时快时慢，马马虎虎，必将少不了翻车

并且经过踏踏实实系统学习，我相信学习成果必定会比东拼西凑的学习要稳固得多

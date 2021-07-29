---
title: 初识类与对象
date: 2020-09-22 16:44:53
tags:
permalink: contents/f88ff2f50f29/
categories: Java
---
此文记录了咱对Java OOP的初步理解

由于是初学，文章也是初写，难免有错误，有的话，请指出

<!--more-->

## 修改记录

1. 2020-09-22 原始文章
2. 2020-11-01 coding有了点积累，回来追加一部分内容

## 前言

利用选择、循环、数组等这部分的内容，我们已经可以解决相当一部分的问题了。而当我们想构建一个包含着文本输入框、按钮等控件的GUI应用时，利用前面所学的知识，似乎需要耗费相当大的功夫。

## 面向对象编程

所以，为了提高软件的灵活性，开发性与可维护性，于是**面向对象编程** (Object-Orient Programming) 便出现了，面向对象编程，顾名思义就是使用Object(对象) 来进行程序设计

## 对象

### 什么是对象

那什么东西是Object呢？

听到对象这个词语的时候，~~我下意识看了下自己，咱可没有对象啊~~

但老师告诉过我们，遇到不懂的词语，就要学会查字典。Object在字典中的释义是
> **THING**: a solid thing that you can hold, touch, or see but that is not alive

懂了(~~其实没懂~~)，对象，放在生活上，不就是个具体的物体吗？

那么按理来讲，猫猫狗狗勺子苹果桌子学生，甚至是一个抽象的圆都可以是对象啊
放到计算机语言上，(~~复制粘贴的~~)一个可以被明确标识的实体，就是对象，并且每一个对象都偶有自己独特的标识、状态和行为

上面的文字真的好绕啊，理解对象是什么，我觉得最好还是要举栗子

比如，我们现在啥都没有，但是，**来 左边 跟我一起画个龙 在你右边 画一道彩虹**
~~于是乎便有了一条龙和一道彩虹~~

这条龙和这道彩虹，便是对象，龙有着独特位置(左)和长度这些特点，而彩虹也有着独特位置(右)和颜色等这些特点，这些都是用来描述他们的属性的
一个对象具有其独特的 **attribute** 和 **behavior** (属性与行为)。
如这条彩虹有着一定的大小与颜色深浅性质，这些都是通过它的 data field 才表示的；而如它的消失便是一个行为，一个对象的行为是通过 method 来定义的

## 类

### 什么是类

前面提及了对象，在这个地方说 class 便会自然而然了

来点正经的，先让我们忘掉刚刚那条龙和那一道彩虹（

我们拿正方形和电视机来说事

四条边相等并且互相垂直的四边形，便是正方形，这是每一个正方形基本性质，而对于每一台电视机，都有音量、频道和开关这些属性。
上述这些这些对于每一个正方形或者每一台电视机来说，是共有的。
或是说，每个正方形是同一类东西，每台电视也是如此
所以我们可以通过 class 来生成每一个 object

比如我们可以通过Square类来创建三个边长不同的正方形，它们都有着正方形的性质，只是边长不同罢了。这个过程叫做instantnation(实例化)
> Note: instance is equivalent to object
类在instantnation的过程中起到了一个相当于“模板”的作用，电视机对象也是如此。

设想: 我是一个电视装配厂的工人，我可以跟着生产指南(class)进行电视机的基本装配,便可以不断装配出数不胜数的电视机。
所以，可把类理解为产出同类对象的基本模板或者蓝图

### 日后追加部分

> 2020-11-01追加部分 可能会对文章逻辑造成影响 推荐跳过这部分的阅读

对上面那句话怎么了解呢，又模板又蓝图的？

经过多一点的实操之后，发现优点不是仅仅万物皆对象，而是让某段代码拥有更好的更强的可复用性，就拿一个实际的音乐播放器类进行举例吧。

如果有两台音乐播放器，我们按照之前的面向过程写法，就是分别声明变量来对应每一播放器的属性，如播放器的开关这个属性，就要声明下面这两个变量
`isOn1: boolean  isOn2: boolean`
并给它们上一个开机关机方法
`toggle（isOn: boolean): void`

开关机就要这样做

``` java
toggle(isOn1);
toogle (isOn2);
```

那么如果我们要管理n台音乐播放器，那么就要手动声明如下变量 `isOn1 isOn2 ... isOnn`
对他们进行开关机操作就要这样做

``` java
toggle (isOn1);
toggle (isOn2);
...
toggle (isOnn);
```

这臃肿与coding效率啊，请自己细品。

所以我们可以对播放器，创建一个Player类

``` java
public class Player {
    private boolean isOn;

    public void toggle() {
        isOn = !isOn;
    }
}
```

这样一来每一台播放器都有着相同的作用域和方法，开关只需要操作指定的播放器对象即可，如`player1.toggle()`

> 追加结束

### 类里有什么

类包含有什么，能吃吗？类如何定义的，我可以吗？直接看下码

``` java
class Square {
    /** data field */
    double length;

    /** constructors */
    Square() {
        length = 1;
    }

    Square(double inLength) {
        length = inLength;
    }

    /** methods */
    double getArea() {
        return length * length;
    }

    void getLength() {
        System.out.println(length);
    }

    void setLength(double newLength) {
        length = newLength;
    }
}
```

我们可以注意到一个class里面，包含有**data field, constructor, method** (好像分别是数据域 构造方法 方法 ~~还是英语顺眼~~)

在本例中，data field里面的length变量是每一个对象都有且是特有的(称之为 **instant variable** 实例变量，当然这不包括static variable)，在每一个对象中单独存在且不会相互影响，method则包含了这个对象特有的方法(当然这也不包括static method)

然后就是**constructor**了。我们注意到constructor与construct有关，那很好理解了(~~中文好像是构造器吧~~中文叫构造方法)。constructor便是新建对象时候所使用的方法。

### 新建对象

可以如下新建一个square对象

`Square square1 = new Square();`

括号里面可以含**actual parameter**也可以不含，不含的我们称之为 **no-arg constructor** .

这上面的语句用到了 **new** operator, 是不是似曾相识呢?

没错啦，仔细回忆一下array和命令行输入的内容？

输出的我们需要新建Scanner类下的对象

`Scanner input = new Scanner(System.in);`

新建数组我们需要的是新建一个array对象 (Java将array视为对象看待)

`int[] array = new int[10]; //create an array that contains 10 elements`

所以，结合之前的一些基础内容，也可以让我们理解创建对象的语句。

### 试讲constructor

constructor嘛，就是用来construct对象的，并且constructor在syntax方面与method header极其相像

因为只是极其相像，所以也有几点不像的（？

- 与method header相比，没有return type

- 名字必须与类名 完 全 一 致

- 只在新建对象的时候会用到

如上面的Square class中的片段

``` java
    /** constructors */
    Square() {
        length = 1;
    }

    Square(double inLength) {
        length = inLength;
    }
```

如果不带参地创建新对象，就会对该对象的length变量(instant variable)赋值1，而如果带实参的话，该对象便会以含形参的Square(double inLength)的constructor进行construct，此时变量length便会以inLength赋值

**那我忘记了创建constructor怎么办？**
如果你啥constructor也没加的话，恭喜你(?)，因为Java会implicitly帮你加上一个的：`ClassName() {}`

如果只加了带argument的话，no-arg constructor是不会再帮你加上的了

## UML class diagram

我们能以 **UML**(Unified Modeling Language) **class diagram**方式表示类与对象

把Square类做成图表的话，便会是如下所示

``` markdown
____________________________
|         Square           |
| ------------------------ |
|       length: int        |
|                          |
|         Square()         |
| Square(inLength: double) |
|      getArea(): void     |
|    getLength(): void     |
| ------------------------ |
```

也就是说用UML class diagram进行图示的话，遵从下列规则

| Class name | Denoted as |
| ---------- | ---------- |
| Data Fields | dataFieldName: dataFieldType |
| Constructors | ClassName(parameterName: parameterType) |
| Methods | methodName(paramterName: parameterType): returnType |

## reference variable

那么在面向对象编程中，object variable 和 primitive-type variable有什么区别呢

请与之前学到的**数组**建立起**联系**(数组在Java中被当成对象并且我们已经熟知了Java数组)

正如我们所知道的，基本数据类型是被存放于stack里的，而object是被存放在heap里面的

面向对象的数据类型不包含value，而是作为一个reference指向目的的对象

### 由数组说起

试回忆前面array内容，array variable 是作为一个 reference variable，被引用到heap里相对应的数组

``` java
int[] array = new int[10]; // create a new array
/** and array is a reference variable that reference to the array at the heap */

array[0] = 1; // assign 1 to element 0 at array

int[] array1; // create a new array variable called array1
array1 = array; // now array1 has the same reference as array

System.out.println(array[0]); // output: 1
System.out.println(array1[0]); // output is the same: 1
```

如下图

``` markdown
|   stack      |          |             heap        |
|              |          |                         |
|              |          |                         |
|              |          |                         |
|              |          |                         |
|--------------|reference |                         |
| main()       |   to     |   An array that         |
|        array | ---------|-->contains 10 elements  |
|--------------|          |                         |
```

### 以对象结束

那么对于对象来讲，其实跟数组几乎一致（~~数组也是对象啊喂~~

``` java
Square square1 = new Square(4); // create a square object which has length of 4
Square square2; // create a new reference variable of class Square

square1.getLength(); // output: 4
square2 = square1;
square2.setLength(5); // now make object square's length to 5

square2.getLength(); // output: 5
square1.getLength(); // output: 5
```

语句 `square2 = square1;` 把square2的引用也指向了square对象，正因如此，invoke的method和修改的data field都是属于同一个object的

可以表示如下

``` markdown
Before square2 = square1

|   stack      |          |             heap        |
|              |          |                         |
|              |          |                         |
|              |          |                         |
|              |          |                         |
| main()       |reference |                         |
| square2      |   to     |                         |
|      square1 | ---------|--> a square Object      |
|--------------|          |                         |

After

|   stack      |          |             heap        |
|              |          |                         |
|              |          |                         |
|              |          |                         |
|           ---|----------|-----------------------  |
| main()    |  |reference |                      |  |
| square2 ---  |   to     |                      |  |
|      square1 | ---------|--> a square Object <--  |
|--------------|          |                         |
```

总之，可以粗略地理解为在OOP中的变量其实就像一个书签，没有具体的值，指向着目标对象。

## 自我总结

其实呢，在学习编程时候，可以进行联系与联想的，这些操作可以使得你有一个具体的认知，并且让前后知识结合得更加紧密，形成一个比较稳健的知识体系

## 关于文中出现英语的这件事

emm还有有时候会忍不住用一下英语，是因为嘛，计算机几乎所有内容都是西方世界的，直接使用英语不好过加一步转化成为中文？

比如下面这个例子

这是对总线的解释

`总线 是指计算机组件间规范化的交换数据的方式，即以一种通用的方式为各组件提供数据传送和控制逻辑`

略有不解？

那好，总线的英语是**Bus**

既然是Bus，那他就是计算机部件之间交换数据的方式啊。这不是简单粗暴吗？

所以学习计算机与编程之类的，最好还是要把英语功底加深一下

而如何加深呢？是不是天天百词斩启动，生词背上几十个？（

其实不然，英语是我们生活中的应用工具，编程也如此，不使用它们，它们便会从你的记忆中褪去

附上瞎编的一句话吧

工具 不能纯粹学习 更要学以致用

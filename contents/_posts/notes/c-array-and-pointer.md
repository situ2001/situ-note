---
title: C语言之数组与指针
comments: true
date: 2020-12-05 15:44:12
tags: 
permalink: contents/d34f10f99adc/
categories: 笔记
---

发觉指针和数组的关系不浅

<!--more-->

课间写的，有点匆忙，估计有不少错误，如有，请指出，谢谢。

上面不懂的可能需要下面内容的补足（写作水平太菜了）

## 写在前面

为什么我突然写这篇文章呢？原来是我在[cppreference上面看malloc()](https://en.cppreference.com/w/c/memory/malloc)，了解一下简单的内存分配的时候，试了一下附带的example

``` c
#include <stdio.h>   
#include <stdlib.h> 
 
int main(void) 
{
    int *p1 = malloc(4*sizeof(int));  // allocates enough for an array of 4 int
    int *p2 = malloc(sizeof(int[4])); // same, naming the type directly
    int *p3 = malloc(4*sizeof *p3);   // same, without repeating the type name
 
    if(p1) {
        for(int n=0; n<4; ++n) // populate the array
            p1[n] = n*n;
        for(int n=0; n<4; ++n) // print it back out
            printf("p1[%d] == %d\n", n, p1[n]);
    }
 
    free(p1);
    free(p2);
    free(p3);
}
```

这段代码运行之后，输出的结果是

``` shell
p1[0] = 0
p1[1] = 1
p1[2] = 4
p1[3] = 9
```

诶诶诶，为什么指针也能拥有数组那样的下标呢？我的直觉告诉我：指针和数组，之间必定有不可描述的关系

在开始之前，感谢一下tindy2013能抽空给我微微解释了一下~~，缩短了我自主探索的时间~~

## 数组的下标

如同多数地方所说的，数组就是一种数据结构。是一坨**连续**的元素，接连着一起躺在了内存中的某一块区域。并且数组拥有operator`[]`，即是数组的下标。

之前我发现数组还可以这样子

``` c
int arr[5];
printf("%p", arr);
```

最后的输出了一个内存地址，并且我们还可以新建一个指针并把数组变量赋值给它，并能通过指针给arr中的其中一个元素赋值

``` c
int *p = arr;

arr[4] = 1;
//or
p += 4;
*p = 1;
//or
*(arr + 4) = 1;

printf("%d", arr[4]);
```

上面三个操作都是一样的，输出结果都是`1`

既然上面有`int *p = arr;`那么我把数组arr当成一个常量指针，既然arr可以拥有一个属于他自己的下标，那么一般的指针，是否也能拥有一个下标呢？

不多猜测，先试一下看看是不是这样

```c
p[4] = 1;
printf("%d", arr[4]);
```

也是一个样，那么，**指针变量拥有下标**。

但是经过一番的查询之后，发现数组和指针，这两者并不是**绝对相同**的。常见且有区别的，就是在使用运算符`sizeof`的时候，得到的就是数组类型`int[]`的长度了。只不过在大多数情况下，被隐式转换成指针了。

下面摘抄一点ISO C标准对数组的说明（不想看可以跳过）

` Constraints : 1 One of the expressions shall have type 'pointer to object type',  the other expression shall have integer type, and the result has type  'type'. `
`Semantics : 2 A postfix expression followed by an expression in square brackets [] is a subscripted designation of an element of an array object. The definition of the subscript operator [] is that E1[E2] is identical to (*((E1)+(E2))). Because of the conversion rules that apply to the binary + operator, if E1 is an array object (equivalently, a pointer to the initial element of an array object) and E2 is an integer, E1[E2] designates the E2-th element of E1 (counting from zero).`



## 关于内存的一点知识来讨论。

前面只是基于代码和结果来猜测和讨论的，那实际上它们都干了些啥，我们可以结合关于内存的一点知识来讨论。

首先，先给自己的脑子灌输一点知识：如果没有了解过内存的话，我们可以大概的形成一下印象。（大佬请跳过）

内存呢，我喜欢把它形象化成一张密密麻麻的表格，它很长很长，但是宽度只有8个格子（1字节 = 8位），并且每一行都有一个专门的标号，就是内存的地址啦（字节编址）

如图所示

![](https://cdn.jsdelivr.net/gh/situ2001/assets/img/20201205143617.png)

数据进入内存的话，就会占据内存的一部分，比如我们熟知，在32位下，`int`型占用4个字节，`double`型占用8个字节，比如我们有一个值为1的int变量，它会在内存中占据着4个字节

![](https://cdn.jsdelivr.net/gh/situ2001/assets/img/20201205143537.png)

数组是在内存上连续分布一块的数据结构。如果有一个长度为3的int数组`arr[3] = {7, 4, 5}`，那么它在内存里的占用是连续的，三个int类型长度的地址，还有一个数组名的变量，相当于一个常量指针（不可更改地址）

![](https://cdn.jsdelivr.net/gh/situ2001/assets/img/20201205143733.png)

我们可以使用`arr[0] arr[1] arr[2]`来进行对应元素的访问。与此同时，使用一个指针`int *p = arr`来实现上述的访问

``` c
int arr[3] = {7, 4, 5};
int *p = arr; // *p = 7
p++; // *p = 4
p++; // *p = 5
```

由上可见，指针p进行了两次自增，每一次自增，都会对p存放的地址+4，去到下一个元素的起始地址。因此，对p解引用就会出现不同的结果，分别对应`arr[0] arr[1] arr[2]`

![](https://cdn.jsdelivr.net/gh/situ2001/assets/img/20201205144359.png)

那么有，

`arr[0]`就是直接对arr的起始地址进行解引用，结果就是`7`

`arr[1]`就是对arr进行+1，对指针`arr + 1`进行解引用，结果就是`4`

`arr[2]`同理，结果是`5`

## 使用指针操作数组

一维数组的指针就是像上面那样子，那如果我们对**二维、三维数组**用指针进行数组操作呢？

其实呢，二维数组就是一个**连续的**，**包含多个一维数组**的数组

又因为，数组名就是个指针，所以，二维数组的数组名就是个指针，指向着多个一维数组名（pointer to pointer）

再根据上面所提到的一句话：

> 指针变量自增1，即是对其原来的地址加上一个对应类型的长度

假设这里有一个二维数组`int array[3][4]`呢？我们用指针进行操作的时候，可以初始化这两种指针：

``` c
int array[3][4] = {{4, 5, 1, 4}, {1, 9, 1, 9}, {8, 1, 0, 0}};
//an int type pointer
int *p1 = *array;
//an int[4] type pointer
int (*p2)[4] = array;
```

我们对p1和p2加一，并对其解引用

``` c
p1++;
printf("%d\n", *p1);	//output: 5
print("%d\n", array[0][1]);
p2++;
printf("%d\n", *p2);	//output: 9
printf("%d", array[1][1]);
```

可以看出，两者输出结果不一样，其中p1读出来的是`a[0][1]  = 5`，而p2读出来的是`a[1][1] = 9`

为什么呢？仔细思考一下的话，其实也不难理解

![](https://cdn.jsdelivr.net/gh/situ2001/assets/img/20201205145556.png)

## 注意操作的对象

我到底，操作着哪个对象啊......

我作为一个初学者，平时也会被各种多重 asterisk(*) 搞晕，不过静下心来，发现还是要抓住这些

1. 优先级
2. 指针加减所表示的含义

首先是优先级和结合性

先举一个在课堂上使人晕针的东西：**指针数组**和**数组指针**

我觉得好晕啊，先看下它们对应的英语吧：

|   中文   |       英语       |
| :------: | :--------------: |
| 指针数组 | array of pointer |
| 数组指针 | pointer to array |

英语表示不就直白很多了吗...

再者就是优先级的问题了。比如上文这个

``` c
//an int[4] type pointer
int (*p2)[4] = array;
```

由于`[]`的优先级比`*`的要高，所以用了括号来强行更改优先级，先解析`*`，它的意思是p2先是一个指针，然后解析`int`与`[4]`，表明p2是一个指向`int[4]`类型的指针。

不加的话，意思是这样的

``` c
int *p2[4];
// p2 is an array of pointers
```

（感觉解释有点奇怪）这里情况是，根据优先级，先解析`[4]`，表明p2会是一个长度为4的数组，然后再解析`*`，表明了p2是存储指针用的数组，指针指向`int`类型

举个简单的，`int **p = array;`这个呢？

就是等效于`int *(*p)`这个，`*`是右结合的，所以中间的`*`先与p结合，再与左边的`*`进行结合

再者就是指针加减实际的多少，在这里，我姑且把对指针的加减当做是对指针变量里头存放的地址的前移和后移吧，这东西在前面的部分，已经讲了个大概了。

对于上文那个`array[3][4]`数组，语句`(*(p2+1)+1)`做了些啥呢？p2是`int[4]`类型的指针，对`(p2+1)`就是p2右移动1个`int[4]`的长度，就是`array[1][0]`的起始地址，对该地址解引用后，获得了这个二维数组中的第二个`int[4]`类型的一维数组，即`array[1]`，是一个`int`类型的指针，之后加1就是右移动1个`int`长度了，因此最后解引用后就是9

并且写到这里我发现，`array[1][1] `，因为`[]`的结合性是左结合，即是`(array[1])[1]`，其实不就是相当于`*(*(p2+1)+1)`吗？？？(难道数组的下标相当于给指针进行解引用)

大概是下图这样的

![](https://cdn.jsdelivr.net/gh/situ2001/assets/img/20201205153231.png)

于是输出了`9`;

## 后面

还需要补一下，还有字符数组与字符串


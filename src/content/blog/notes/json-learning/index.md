---
title: 记一次JSON入门
comments: true
date: 2020-11-29 18:39:51
categories: 笔记
description: 记一次JSON入门
---

咋感觉最近学的小东西越来越多了...

## 写在前面

其实 JSON 这个东西我也不是第一次听到了，只不过之前看 json 文件看得云里雾里，但因为不是要自己上手使用~~（之前的想法是读 json 只需知道它大概说了啥就行）~~所以一直没去了解，一直拖延到现在，才打算学习一下 json。

## 这是啥啊

俗话说：“知己知彼，百战百胜。”所以我特地去找了找其介绍

> **JSON**(JavaScript Object Notation) 是一种轻量级的数据交换格式。 易于人阅读和编写。同时也易于机器解析和生成。 它基于[JavaScript Programming Language](http://www.crockford.com/javascript), [Standard ECMA-262 3rd Edition - December 1999](http://www.ecma-international.org/publications/files/ecma-st/ECMA-262.pdf)的一个子集。 JSON 采用完全独立于语言的文本格式，但是也使用了类似于 C 语言家族的习惯（包括 C, C++, C#, Java, JavaScript, Perl, Python 等）。 这些特性使 JSON 成为理想的数据交换语言。

现在我对 json 的认识是：

1. 是一种用于数据交换的文本格式
2. 使用了 C-liked 的风格

那么相对于之前一股脑乱读 json，停下脚步，静下心来思考，也许 json 并不是很难呢？

事实证明，思维的懒惰才是最为可怕的，花了一小段时间来阅读了一下[JSON 官网](https://www.json.org/json-en.html)的介绍，发现 json 这东西，真的不是很难

**由于目前咱有一点程序语言的知识储备**，所以这里只记录一些我自己需要记录的东西。

## 两大结构

如同 HTML 有属性和元素，JSON 也有两大结构

> JSON is built on two structures:
>
> - A collection of name/value pairs. In various languages, this is realized as an _object_, record, struct, dictionary, hash table, keyed list, or associative array.
> - An ordered list of values. In most languages, this is realized as an _array_, vector, list, or sequence.

它们分别是

1. 名称/值 pair 的集合
2. 值的有序列表（这个跟数组 array 很像的）

## 一些形式

### Object

对象呢，就是一堆无序的名称/值的集合，以`{`开始并以`}`结束，里面的每个 pair 都是以`name: value`这样的格式表示的，然后每个 pair**之间**都要用逗号`,`来**分隔开**~~（之前一直以为是每次换行都要加个逗号~~

我觉得官网上面的这个图画的挺厉害的，就收下来了

![Object 选自json官网](./20201127193252.png)

### Array

数组嘛，见得太多了，就不多说了，跟`[ele1, ele2 ... eleN]`这东西长得是差不多的，只不过其中的元素就是名次/值 pair

![Array 选自json官网](./20201127193253.png)

### Value

为什么我要把见得太多了的 value 给记录下呢？因为之前我是不知道 json 的值可以是 object 或者 array 的，所以也要用小本本记下来。

> A _value_ can be a _string_ in double quotes, or a _number_, or `true` or `false` or `null`, or an **object** or an **array**. These structures can be nested.

## 阅读实例

json 就顺手在刚刚查询的空教室记录里面抽取了一段，如下

```json
{
  "currentPage": 1,
  "currentResult": 0,
  "entityOrField": false,
  "items": [
    {
      "cd_id": "1011230",
      "cdbh": "1011230",
      "cdjylx": "教学类,活动类",
      "cdmc": "文新123#",
      "dateDigit": "2020年11月27日",
      "dateDigitSeparator": "2020-11-27",
      "month": "11",
      "queryModel": {
        "currentPage": 1,
        "currentResult": 0,
        "entityOrField": false,
        "limit": 15,
        "offset": 0,
        "pageNo": 0,
        "pageSize": 15,
        "showCount": 10,
        "sorts": [],
        "totalCount": 0,
        "totalPage": 0,
        "totalResult": 0
      },
      "rangeable": true
    }
  ]
}
```

结合上面的知识储备，就能看懂这段 json 想表示啥了~~，但为什么部分混入了拼音首字母缩写啊我擦~~

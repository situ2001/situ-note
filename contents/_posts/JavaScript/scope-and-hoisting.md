---
title: JavaScript之作用域与变量提升
comments: true
date: 2021-04-11 21:30:00
tags:
permalink: contents/d5c78114ba70/
categories: JavaScript
---

不知道的话，读代码的时候估计会很懵吧。

<!-- more -->

## 动机

看过《JavaScript: The Good Parts》，里面有说，var这种东西，算是(?)一个糟粕。于是我就想写篇文章记录一下咯。

## 写在前面

在js里头，有一个term叫做hoisting，中文翻译过来就就是提升。常见的就有变量提升了。

这里记录一下提升的几种，有`var`变量和函数的提升，也有ES6之后的`let`, `const`和`class`的提升。其实区别也就：在ES6引入的新东西，多了个TDZ(Temporary Dead Zone)而已。

在此之前，说一下js的scope，即作用域，文章可能会更为贯通。

总的来说，行文脉络就是：作用域 => 变量提升

## 作用域

> 粗暴理解: 一个变量能够被访问的范围

JavaScript本来有函数作用域和全局作用域，ES6之后再引入多一个块作用域。

### 全局作用域

在代码的任何地方都能访问到的变量就是全局变量了，其作用域就是全局作用域。

定义在最外层函数的变量，和`global`, `window`对象的property(比如`window.location`)等，以及**直接赋值却未先前声明**的变量。都拥有全局作用域。

比如直接赋值却未先前声明的变量

``` javascript
// In browser's Dev Tool
var f = function () {
    x = 114514;
    var y = 1919810;
}
f();
console.log(x); // 114514
console.log(y); // ReferenceError: y is not defined
```

### 函数作用域

而函数在js里面，被当成是一个闭包(Closure)。函数里面用`var`声明定义的变量的scope都是该函数内部（函数上下文）。可以利用这个特性外加IIFE(立即执行函数)，防止作用域污染

``` javascript
var fn = function () {
    var x = 114514;

    return {
        get: function () {return x;},
        add: function () {x++;}
    };
}();

fn.add();
console.log(fn.get()); // 114515
console.log(x); // ReferenceError: x is not defined
```

**但是**又不像C++/Java那样，一个brace`{}`就新建一个作用域（块作用域）。在js里头只有函数`function () {}`才会新建一个作用域（先撇开ES6）。比如下面这个if语句，就不会创建出一个新作用域

``` javascript
if (114514) {
    var a = [114, 514];
}
console.log(a); // [114, 514]

// 变量提升
if (!1) {
    var a = [114, 514];
}
console.log(a); // undefined

function fn () {
    var b = 114514; 
}
fn();
console.log(b); // ReferenceError: b is not defined
```

### 块作用域

这个东西在ES6才引入进来。简单来说，就是像C++/Java那样的作用域--用一个brace即大括号`{}`就能创建一个新作用域。

用`let`, `const`和`class`声明的变量都能拥有块作用域。比如这样做就会报错

``` javascript
{
    class Bar {
        constructor() {}
    }
}

let b = new Bar(); // ReferenceError: Bar is not defined
```

## 作用域链

每一个上下文都有一个拥有该作用域的变量信息的对象，作用域链就可以看作是这些对象的链接。（之前看过的红宝书）

简单的说法就是，当前的执行上下文要寻找变量，就会顺着作用域链来找，找不到继续向上找，以此类推，直到到达全局作用域或找到该变量为止（很像原型链）。

其中，在当前作用域找不到的变量，便叫做自由变量。

注意：函数的参数的作用域为当前函数的执行上下文。

但是是要注意，作用域是在运行前的**解释阶段**（包含了语法和词法分析以及作用域的确定）就已经被确定的了。与上下文相比，上下文是在运行时（创建Context => 执行函数）才确定的，常见的就是关于`this`的问题了。

比如下面的代码，此处的x就是自由变量，于是就会循着作用域链往外面找，找到之后就固定下来了，运行时不会再发生什么变化了。

``` javascript
var x = 114514;
var f = function () {
    console.log(x);
}
var fn = function (func) {
    var x = 1919810;
    if (typeof func === 'function' && func) {
        func();
    }
}
fn(f); // 114514;
```

## 变量提升

分别var与函数提升，以及let, const和class的提升。

**注意**：函数提升的同时还顺便定义了，而不像`var`那样只提升，而要到对应行数才被定义。

由于变量声明这些工作是在解释阶段确定的，一般**就等价于**（不是真把声明物理地搬到作用域的开头来）在该变量的作用域的开头声明，而在具体位置行数上进行赋值。

### var和function

``` javascript
console.log(x); // undefined
var x = 114514;
```

等价于

``` javascript
var x;
console.log(x);
x = 114514;
```

函数也同理，这可能就是我们为什么可以调用在下面才声明的函数(非`let`, `const`声明的函数)一样。

### ES6

ES6加了块作用域，虽然`let`, `const`, `class`这些声明**也会提升**，但是只**等价**于提升到块级作用域的开头——临时死区TDZ(Temporary Dead Zone)。在被赋值前访问，会出现错误。比如

``` javascript
{ // TDZ starts at beginning of scope
  console.log(bar); // undefined
  console.log(foo); // ReferenceError
  var bar = 1;
  let foo = 2; // End of TDZ (for foo)
}
```

## 写在后面

谁说JavaScript是简单的语言（狗头保命）

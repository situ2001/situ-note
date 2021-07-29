---
title: JavaScript之What is this
comments: true
date: 2021-07-11 11:30:00
tags:
permalink: contents/f7dd0265df9c/
categories: JavaScript
---

想必JSer们都碰到过关于this的问题吧？

~~更新于高数大物考前一天~~

<!-- more -->

## this

> A property of an execution context (global, function or eval) that, in non–strict mode, is always a reference to an object and in strict mode can be any value.

即是此时执行上下文(Execution context)的一个property，在严格模式下，可以是任何值，非严格模式下，它的值总是特定一个object

## 函数调用

在js里头，一般来说，函数调用方式有下面几种，前两个很常见，分别为函数调用和方法调用。而最后一个是用`Function.prototype.call`调用

``` javascript
func(114514);
obj.func(114514);
func.call(obj, [114514]);
```

其中对于第三种的这个方法，其syntax如下

``` javascript
func.call([thisArg[, arg1, arg2, ...argN]])
```

thisArg在第一个位置，其实对于函数里头的this，MDN如是说

> In most cases, the value of this is determined by how a function is called (runtime binding). It can't be set by assignment during execution, and it may be different each time the function is called.

也就是说我们可以把`this`当成：某时某刻，这个函数是**由谁**调用执行的。this其实是当前执行该函数的对象。在`call()`方法里头，函数里的`thisArg`就会是指定为传进去的`this`。

在nodejs的环境下，上面的两种调用方式

``` javascript
func(114514);
obj.func(114514);
```

转化为`call()`，就会是如下代码所示

``` javascript
func.call(undefined, [114514]);
func.call(obj, [114514]);
```

> 注: 而在浏览器里的话，第一个函数调用：非strict mode下就会是`window`，而strict mode下就是`undefined`

``` javascript
// non-strict mode
func.call(window, [114514]);
func.call(obj, [114514]);
```

上面说完了，那么，`this`真的就是一个对象吗？我们可以打印出来看看

``` javascript
const obj = {
    s: 2,
    i: 0,
    t: 0,
    u: 1
};

let func = function () {
    console.log(this);
};

func.call(obj); // { s: 2, i: 0, t: 0, u: 1 }
```

感觉说了一点啰嗦的东西...

大白话时间（水平不足）：在js里头，函数是一等公民，函数就是一个值，可以赋给其他变量。

但一个函数在哪里声明定义（箭头函数除外），不是最重要的。

对于函数里头`this`的值，最重要的是：这个函数是谁调用的(或被绑定)。

于是乎，如果碰到有this的情况，我们可以做一点稍微啰嗦的转化。

``` javascript
// foo is an object
foo.bar(114514);
// is equivalent to
foo.bar.call(foo, [114514]);
```

非常容易看到，此时的函数`bar`里面的`this`，就是`foo`。那么此时把里头的`this`都看成这个`bar`对象，不就EZ很多了吗？

---

总结时间（三个月后...）

> 普通函数如`func()`调用可以看作是`func.call(window, [...args])`或者`func.call(undefined, [...args])`
>
> 对象方法如`obj.func()`调用可以看做是`func.call(obj, [...args])`
>
> 指定函数的`this`可以使用`Function.prototype.call`

## this绑定

其实还有`Function.prototype.bind`这个方法，它是用于绑定`this`的，返回的是一个**绑定了**`this`的函数。注意，这个函数的第一个参数也是`thisArg`。

比如说

``` javascript
const obj = {
    s: 2,
    i: 0,
    t: 0,
    u: 1
};

let func = function () {
    console.log(Object.keys(this));
};

const foo = {
    dssq: 114514,
    fn: func.bind(obj) // a function that binds its this with obj.
};

foo.fn(); // [ 's', 'i', 't', 'u' ]
```

## 箭头函数

由于箭头函数没有属于自己的`this`

那么在箭头函数里头为什么可以有`this`呢？？

原因是，这个`this`，是循着作用域链，从外部的作用域里capture进来(就是你定义这个箭头函数的地方)的，

可以理解为静态不变的`this`，在编译的时候已经被确定下来了（词法作用域）。

比如

``` javascript
let test = function () {
    this.x = 114514;

    setTimeout(function () {
        console.log(this.x);
    }, 1000);
    
    setTimeout(() => {
        console.log(this.x);
    }, 1500);
};

let t = new test();
// undefined
// 114514
```

再举一个例子以说明这个`this`到底怎么来的

``` javascript
const foo = function () {
    // Whatever `this` is here...
    var chopper = {
        name: 'Gogo',
        getName1: () => {
            return this.name;    // ...is what `this` is here.
        },
        getName2: function () {
            return this.name;
        }
    };

    console.log(chopper.getName1());
    console.log(chopper.getName2());
}

const obj = {
    name: 'Tony'
};

foo.call(obj);
// Tony
// Gogo
```

又比如下面这个，输出分别为3和1

```javascript
let foo = function (config) {
    for (const v of config) {
        if (typeof v === 'function') {
            v.call({value: 3});
        }
    }
};

let f = function () {
    // Whatever `this` is here...
    let value = 2;
    foo({
        data: {
            value: 0
        },
        foo: function () {
            console.log(this.value);
        },
        bar: () => console.log(this.value), // ...is what `this` is here.
        *[Symbol.iterator] () {
            for (const k of Object.keys(this)) {
                yield this[k];
            }
        }
    });
};

f.call({value: 1});
```

## Constructor

这里有一个constructor pattern的函数

``` javascript
let Foo = function () {
    this.x = 114;
    this.y = 514;
};
```

如果我们要用函数创建一个新对象，可以这样做

```javascript
// Create a new object using function Foo
Foo foo = new Foo();
// Then print its properties
console.log(foo.x, foo.y); // 114 514
```

那为什么，在调用`new Foo()`之后，可以得到一个对象，且其带有`x`和`y`这两个property？

其实，在了解了`this`之后，我们可以这样看待`new`运算符，其实new运算符是分了几步的，很简陋的一个实现如下

``` javascript
let bar = Object.create(Foo.prototype); // bar = {}
foo.apply(bar); // bar = { x: 114, y: 514 }
```

也就是先把`Foo.prototype`对象作为原型对象，创建一个新对象bar。然后以对象`bar`，作为foo函数的`this`，调用foo函数。

``` javascript
// Now the property `this` is bar;
this.x = 114; // is bar.x = 114
this.y = 514; // is bar.y = 514
```

此时的property就自然而然被加上咯。

---

一句话总结

> JS里头的对象的创建大致流程了解了，后面的ES6 `class`这些语法糖就没有什么问题了，因为class本质上还是基于这一套基于原型的OO

~~其实实际代码，用ES6 class就行了~~

## 写在后面

令人头晕的`this`，好像也就这样了（感觉要比C晕针症状严重）？

其实我觉得理解到一些实质，就稳很多了。

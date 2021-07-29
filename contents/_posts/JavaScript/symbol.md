---
title: JavaScript之symbol
comments: true
date: 2021-06-16 19:10:00
tags:
permalink: contents/4eba787ff8b0/
categories: JavaScript
---

(笔记向)新加进来的(ES6)，是第几个primitive来着？

<!-- more -->

> Symbol is a primitive type for unique identifiers.

期末复习周快到了，我还是想记录一下之前所了解的JS primitive -- symbol。

~~简单地说一下：symbol的中文意思就是“标志，符号”嘛，我们就可以用标志这个含义来了解——独一无二的标志，给独一无二的property（误）~~

我们看了看MDN的原生对象`Symbol`的简介，它如是说

> Symbol is a built-in object whose constructor returns a symbol primitive — also called a Symbol value or just a Symbol — that’s guaranteed to be unique.

也就是说，一个symbol，有特殊的值，你几乎找不到另一个值与该symbol相等的symbol。(很像Hash

利用这个特性，我们可以做一点操作。

## Initialize a symbol

两种方法，前者是直接新建一个symbol，后者会返回一个在**global registry**上的symbol。

`Symbol(description: string)` 和 `Symbol.for(description: string)`

description可选，主要是调试用：`Symbol.prototype.description`

## Unique

唯一性是怎么样的？跑跑代码不就知道了？

```javascript
let s1 = Symbol()
let s2 = Symbol()
s1 === s2 // false
```

不过要注意在全局注册表里头的symbol

```javascript
let s3 = Symbol.for("114514")
let s4 = Symbol.for("114514")
s3 === s4 // true
```

## Basic usage

使用很简单，只需要新建symbol，然后作为一个对象的key就行了，retrieve的时候也是跟常规操作一样。

```javascript
const obj = {};
const s1 = Symbol();
obj[s1] = 114514;
console.log(obj[s1]); // 114514
```

不过要记住！万一失去了特定Symbol的引用，你就无法访问该key的value了。

~~`Object.getOwnPropertySymbols`帮你忙~~

## Private property

虽然现在的ES也有私有成员的定义方法，在标识符前面加一个#就行了

```javascript
class Foo {
    #val = 114514;
}
```

但是，symbol也可以用来做私有变量，并且也不会被for in循环弄出来。TM的，JS真的是太灵活了，草

首先回忆一下前面所说的，我们要把一个symbol作为一个property的key，并且要保持这个symbol不丢失，且不会被外界访问到。

...emm...

闭包！

``` javascript
const Foo = (function() {
    const name_ = Symbol("name");
    class Foo {
        constructor(name) {
            this[name_] = name;
        }
        greet() {
            console.log(this[name_]);
        }
    }
    return Foo;
})();

const o = new Foo("situ2001");
o.greet(); // situ2001
```

## System symbol

同时，JS也把一些内部的属性通过symbol给暴露了出来。

### Symbol.iterator

比如`Symbol.iterator`，我们可以挂一个生成器上去，这样的话，迭代这个对象（包括`...` `for.. of ..`）就会使用这个生成器。

``` javascript
class Foo {
    *[Symbol.iterator]() {
        yield 114514;
        yield 1919810;
    }
}

const obj = new Foo();
console.log([...obj]); // [114514, 1919810]
```

### Symbol.species

又比如`Symbol.species`，我们可以把一个对象的constructor给换掉。

用途是什么呢？比如说你新建了一个继承了Array的类MyArray，但是你想让一个MyArray对象使用了如`map()`方法之后，返回一个Array对象，而不是MyArray。就可以自行实现这个`Symbol.species`属性了。(应该是把返回的对象的constructor改为了Array，如下代码的MyArray.prototype也就访问不到了)

这个属性是用来给自己的对象方法用以创建派生对象，即运行时对象若再次调用自己的构造函数来新建对象，那么就会涉及到`Symbol.species`。一些容器的方法会用到这个getter，比如`Array.prototype.map`（Array的话，还有slice, splice, filter, flat, flatMap, concat)。

``` javascript
class MyArray extends Array {
    constructor(...nums) {
        super(...nums);
    }

    static get [Symbol.species]() {
        return Array;
    }

    greet() {
        console.log("Hello");
    }
}

const arr = new MyArray(1, 1, 4, 5, 1 ,4);
const arr1 = arr.map(x => x + 1);

console.log(arr.constructor); // [class MyArray extends Array]
console.log(arr1.constructor); // [Function: Array]

arr.greet(); // Hello
// arr1.greet(); // Error!

console.log(arr1 instanceof Array); // true
console.log(arr1 instanceof MyArray); // false
```

### Symbol.hasInstance

要改变运算符`instanceof`对某一个类的行为(本来是顺着原型链一路上去上constructor的)，我们自己定义一个静态函数，用`Symbol.hasInstance`

``` javascript
class Foo {
    static [Symbol.hasInstance](obj) {
        return Array.isArray(obj);
    }
}

console.log([] instanceof Foo); // true
```

### Symbol.toPrimitive

再比如`Symbol.toPrimitive`，可以在做强制类型转换的比较的时候起到作用（不建议

``` javascript
class Foo {
    [Symbol.toPrimitive](hint) {
        switch (hint) {
            case "number": return 114514;
            case "string": return "dssq";
            case "default": return "FOO";
        }
    }
}

const o = new Foo();
console.log(0 - o); // -114514
console.log(`${o}`); // dssq
console.log(o == "FOO"); // true
```

### Symbol.toStringTag

又如`Symbol.toStringTag`，直接打印的Object的时候，description就是由这个getter来实现的。

``` javascript
class Foo {
    get [Symbol.toStringTag]() {
        return "MyFoo";
    }
}

const obj = new Foo();
console.log(obj); // Foo [MyFoo] {}
console.log(Object.prototype.toString.call(obj)); // [object MyFoo]
```

还有一些其他的，就不一一列举了。

## Conclusion

真的。。。JS真的是强大。。。（感觉更多的是有意义的繁杂

（一句话总结，逃

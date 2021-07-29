---
title: 模拟实现 Function.prototype
comments: true
date: 2021-05-31 17:15:00
tags:
permalink: contents/9a9ccee65baf/
categories: JavaScript
---

模拟实现 call, apply 和 bind

<!-- more -->

唉，广州疫情又开始有苗头了，待在室内写博客比干啥都好。

## Function.prototype.call

首先先看一下这个函数的syntax是怎么样的

```javascript
call()
call(thisArg)
call(thisArg, arg1)
call(thisArg, arg1, arg2)
call(thisArg, arg1, ... , argN)
```

那么自己实现的函数，第一个参数就是`thisArg`，其余的参数就用可变参数来接收

由于这个函数在`Function.prototype`上，因此这个函数里头的`this`只能是一个`Function`或者是`Function.prototype`。但是直接用后者调用是不被允许的（这种做法是直接调用了对象方法）。因此要加个判断。

接着，就是做些什么，使得被调用的函数的`this`是传入的`ctx`本身。不难想出，比如`obj.fn()`这样调用时候，`fn`里头的`this`就会是`obj`了。

但是万一`ctx`有许许多多的properties而产生重名冲突了呢？

此时ES6的`Symbol`就闪亮登场，它可以帮我们创建一个不会重名的属性，值会存在`Symbol`里头，如下代码这样加进去。当然用完之后记得删除。

还要注意，这个函数的`ctx`如果为`undefined`，那么就会是`globalThis`

```javascript
Function.prototype.call_ = function(ctx = window, ...args) {
    if (this === Function.prototype) {
        return undefined;
    }

    const f = Symbol();
    ctx[f] = this;
    const result = ctx[f](...args);
    delete ctx[f];

    return result;
}
```

测试一下

```javascript
let f = function(num = 1) {
    console.log(this.x + num);
}

const obj = {
    x: 114510,
};

f.call_(obj, 4); // 114514;
Function.prototype.call_(obj, 4); // undefined
```

## Function.prototype.apply

跟上者类似除了接受的是参数数组。只需要改一下就行，记得判断是否为数组。还需要注意`argsArray`为可选参数，记得处理。

```javascript
Function.prototype.apply_ = function(ctx = window, argsArray) {
    if (this === Function.prototype) {
        return undefined;
    }

    const f = Symbol();
    ctx[f] = this;
    
    let result;
    if (Array.isArray(argsArray)) {
        result = ctx[f](...argsArray);
    } else if (argsArray === undefined) {
        result = ctx[f]();
    }
    else {
        throw TypeError("The args passed in is not an array");
    }

    delete ctx[f];

    return result;
}
```

测试一下（接上面的测试代码）

```javascript
f.apply_(obj, [4]); // 114514
f.apply_(obj); // 114511
```

## Function.prototype.bind

`Function.prototype.bind`的作用是返回一个绑定了`this`的函数。

先看看syntax，依旧采用可变参数

```javascript
bind(thisArg)
bind(thisArg, arg1)
bind(thisArg, arg1, arg2)
bind(thisArg, arg1, ... , argN)
```

大致思路是：先把当前的函数缓存下来。然后返回一个与缓存下来的函数形成闭包的函数。注意参数的处理。

阅读了一下MDN，认为这里不需要做`this`的判断。

```javascript
Function.prototype.bind_ = function(ctx, ...args) {
    const this_ = this;
    return function fn(...args1) {
        if (this instanceof fn) {
            return new this_(...args, ...args1);
        } else {
            if (ctx === null || ctx === undefined) {
                this_(...args, ...args1);
            } else {
                this_.call(ctx, ...args, ...args1);
            }
        }
    }
}
```

chrome下测试（接上面的测试代码）

```javascript
let myFn = f.bind_(); // window
let myFn1 = f.bind_(obj);

this.x = 110;

myFn(4); // 114
myFn1(4); // 114514
```

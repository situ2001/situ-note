---
title: 使用Deferred Pattern控制异步
comments: true
date: 2022-09-08 17:00:00
categories: JavaScript
description: 如何控制异步回调函数之间的同步呢
---

## 问题

之前在实现某一个功能的时候，需要控制这么一个顺序，某一个事件需要用到一个对象的方法来获取这个对象的数据。但是这个对象的数据并没有及时被初始化，而是在等待其他异步回调来帮它初始化。

```text
1. waiting for some data of an created object(async, e.g waiting for network request)
2. another event(async) need invoking method of this initialized object
```

问题来了，我们希望按照着这样的顺序来执行。但是由于异步执行在时间上的不确定性。如果直接简单写出几个事件监听来直接访问这个对象，就会变成梭哈行为了——这个对象的方法，有可能在对象数据初始化后被调用，也有可能在初始化前被调用（boom💥）

## 尝试解决

先举个例子吧

比如说，我们这里有一个对象 Foo，它有 data 这个 field，在某一个异步回调函数，这个 data 会被赋值

```typescript
class Foo {
  data: string | undefined;

  getData() {
    return this.data;
  }
}

const foo = new Foo();
```

这里给出一个比较简单的例子：一个异步回调给 data 赋值，若干个异步回调访问 data 数据

```typescript
setTimeout(() => {
  // init data here
  foo.data = "Loaded";
}, 1000);

setTimeout(() => {
  // try to get some data
  console.log(foo.getData());
}, 500);

setTimeout(() => {
  // try again to get some data
  console.log(foo.getData());
}, 1500);
```

如果这样运行的话，会出现这样的结果

```text
undefined
Loaded
```

那有同学会想到曾经学过的并发相关的内容，对于多线程之间的同步，我们可以使用信号量来解决。

那么在 JS 这种单线程语言中，我们是否也能使用类似的方法，处理异步函数之间的同步呢？

可以用 Promise 来解决嘛，我们可以做一个 Promise，配合 `async/await`，让这两个要访问数据的异步方法来等待数据的初始化，不就行了嘛。

于是写出了这样的代码

```typescript
let promise: Promise<void>;

setTimeout(() => {
  // init data here
  promise = new Promise<void>((resolve) => {
    foo.data = "Loaded";
    resolve();
  });
}, 1000);

setTimeout(async () => {
  // try to get some data
  await promise;
  console.log(foo.getData());
}, 500);

setTimeout(async () => {
  // try again to get some data
  await promise;
  console.log(foo.getData());
}, 1500);
```

好像有一点道理喔，看起来也没有什么大问题。先运行一下，

```text
undefined
Loaded
```

果不其然，还是出错了，仔细观察，那是因为，在第一个异步函数调用的时候，你的 Promise 还没有初始化，是 undefined 呀！

那么关键点就来了，我们可以一开始就把 Promise 给初始化啊。但是你会发现一个大问题——Promise 的 executor 是在初始化的时候就要被调用的了！

此时，较为可行的方法就是把异步事件回调函数给放进 executor，如下

```typescript
// resolve or reject are executed in executor
let promise: Promise<void>;

promise = new Promise((resolve) => {
  setTimeout(() => {
    // init data here
    foo.data = "Loaded";
    resolve();
  }, 1000);
});
setTimeout(async () => {
  // try to get some data
  await promise;
  console.log(foo.getData());
}, 500);

setTimeout(async () => {
  // try again to get some data
  await promise;
  console.log(foo.getData());
}, 1500);
```

此时输出便是

```text
Loaded
Loaded
```

但是，难不成都要把异步事件的**回调函数给整个塞入 Promise 的 executor 里头**吗？

## Deferred Pattern

其实...为什么我们不把 executor 里头的 `resolve` 和 `reject` 给抽出来，让 Promise 在外部被 `resolve` 或 `reject` 呢？

于是，就有一了一个 Pattern，那就是 **deferred pattern**

在这里，我们定义一个类 `Deferred`

```typescript
class Deferred<T> {
  resolve!: (value: T | PromiseLike<T>) => void;
  reject!: (reason: any) => void;

  promise: Promise<T>;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
```

这个时候，上面的例子就可以变成这个样子

```typescript
// use deferred pattern instead
let deferred = new Deferred<void>();

setTimeout(() => {
  // init data here
  foo.data = "Loaded";
  deferred.resolve();
}, 1000);
setTimeout(async () => {
  // try to get some data
  await deferred.promise;
  console.log(foo.getData());
}, 500);

setTimeout(async () => {
  // try again to get some data
  await deferred.promise;
  console.log(foo.getData());
}, 1500);
```

输出如下

```text
Loaded
Loaded
```

这样就可以避免上面提到的问题了，既没有把异步事件的回调给塞入 executor 里头，也成功解决了异步事件之间的同步问题。

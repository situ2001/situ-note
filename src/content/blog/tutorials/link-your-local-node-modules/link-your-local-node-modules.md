---
title: npm link 的用法
comments: true
date: 2022-10-02 19:49:00
categories: 教程
description: 如何在自己的项目里调试本地 node module
---

## 前言

之前想过一个问题：一般来说，很多语言的代码在调试的时候，可以跳转到库代码里头并一览无余其代码，没有混淆和压缩。但是 JS 这边的代码呢...画风就完全不一样了，为了缩小体积做的压缩，为了代码的安全而做的混淆...

这样做，对生产环境有极大的好处，但是对开发者来说呢，就是灾难了。

诚然，我们可以在 npm 包里加一份未经压缩的代码，判断 environment 为 production 或  development。对于不同的环境，export 不同的文件(比如 `min.js` 或 `prod.js`)来解决这个问题。下面贴出 npm 包 `react` 入口文件的代码。

```javascript
"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./cjs/react.production.min.js");
} else {
  module.exports = require("./cjs/react.development.js");
}
```

但这个不一定是所有 npm 包都会这么做。

那，有没有方法在自己的项目里头，调试到项目用到的 npm 包未经压缩的源码呢？

其实还有场景2：你是某 npm 包的开发者，你在调试这个 npm 包，与此同时，你想在你的项目中使用你在本地改动了的 npm 包。

那么，该包的改动如何可以以最短时间，最高的效率，作用到你用到了这个库的代码里头呢？

也许我们可以发版，然后在对应项目里头更新这个 npm 包依赖。但是这么做，非常麻烦，很耗精力很耗时间。

## 试试链接吧

关键点：文件软链接 **symlink**

去网上搜索了一下解决方案，发现我们可以使用 `npm link` 命令来满足这个需求。

官方对该命令的解释如下

> This is handy for installing your own stuff, so that you can work on it and test iteratively without having to continually rebuild.

继续查看文档，发现这个命令是用于创建本地文件的 symlink，将本地的 node module 给链接到自己的项目中去。

即，将该模块的文件夹给链接到 `{prefix}/lib/node_modules/<package>`，将该模块的二进制文件（如有）链接到 `{prefix}/bin/{name}`

PS: 这个 prefix 可以通过命令 `npm prefix -g` 获得

接着，如果我们在其他项目里头运行命令 `npm link <package name>`，即可在 `node_modules` 目录下生成该包 `<package name>` 的链接。

## 实操

比如我需要知道与依赖注入相关的库的具体实现，比较好的一个方法就是找出这个库的代码（如果有的话），然后在本地跑起来。

在这里，我想在本地调试一个 npm 包 `@opensumi/di`，我想要在调试的时候看到未经混淆压缩的源码，还想在随心所欲给修改这个包的代码以观察行为。

此时，我们可以在这个 npm 包的目录下，运行命令 `npm link`

```shell
➜  di git:(main) ✗ npm link

> @opensumi/di@1.8.0 prepare /Users/situ/Codes/di
> husky install

husky - Git hooks installed
audited 616 packages in 1.413s

87 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

/Users/situ/.nvm/versions/node/v14.20.0/lib/node_modules/@opensumi/di -> /Users/situ/Codes/di
```

注意上面打印出来的最后一行信息，创建了一个软链接文件，该文件的 stats 信息如下所示

```shell
➜  di git:(main) ✗ stat -x /Users/situ/.nvm/versions/node/v14.20.0/lib/node_modules/@opensumi/di
  File: "/Users/situ/.nvm/versions/node/v14.20.0/lib/node_modules/@opensumi/di"
  Size: 20           FileType: Symbolic Link
  Mode: (0755/lrwxr-xr-x)         Uid: (  501/    situ)  Gid: (   20/   staff)
Device: 1,18   Inode: 27493795    Links: 1
Access: Sun Oct  2 19:46:58 2022
Modify: Sun Oct  2 19:46:58 2022
Change: Sun Oct  2 19:46:58 2022
 Birth: Sun Oct  2 19:46:58 2022
```

此时，在自己的其他项目下运行命令 `npm link "@opensumi/di"` 即可链接到目的 npm 包的目录下。

```shell
➜ npm link "@opensumi/di"
/Users/situ/Codes/Playground/node-scripts/node_modules/@opensumi/di -> /Users/situ/.nvm/versions/node/v14.20.0/lib/node_modules/@opensumi/di -> /Users/situ/Codes/di
```

创建的同样是一个软链接文件

```shell
➜  di git:(main) ✗ stat -x /Users/situ/Codes/Playground/node-scripts/node_modules/@opensumi/di
  File: "/Users/situ/Codes/Playground/node-scripts/node_modules/@opensumi/di"
  Size: 72           FileType: Symbolic Link
  Mode: (0755/lrwxr-xr-x)         Uid: (  501/    situ)  Gid: (   20/   staff)
Device: 1,18   Inode: 27492422    Links: 1
Access: Sun Oct  2 19:39:03 2022
Modify: Sun Oct  2 19:39:03 2022
Change: Sun Oct  2 19:39:03 2022
 Birth: Sun Oct  2 19:39:03 2022
```

## 本地试试

万事俱备，基于上面的操作，我们尝试在本地改动一下上面提及的库，看看起不起作用。

这里先放上一段代码，我是想通过实际上手使用该库来了解这个库的工作原理。

```typescript
import { Autowired, Injectable, Injector, INJECTOR_TOKEN } from "@opensumi/di";

const injector: Injector = new Injector();

injector.addProviders({
  token: "114514",
  useValue: { a: 1, b: 2 },
});

@Injectable()
class A {
  @Autowired(INJECTOR_TOKEN)
  injector: Injector;

  constructor() {
    console.log("Create A");
  }
}

@Injectable()
class B {
  @Autowired()
  a: A;

  constructor() {
    console.log("Create B");
  }
}

injector.addProviders(A, B);

const b = injector.get(B);
console.log(b.a instanceof A);
console.log(injector.get("114514"));
```

如果什么也没有改动的话，输出应该如下。

```shell
➜  node-scripts ts-node-esm di-test.ts
Create B
Create A
true
{ a: 1, b: 2 }
```

这里举个非常简单的例子，如下（为了创造需求而创造需求）

放在以前，我无法改动库的代码，就很难得知什么时候类 `A` 和 `B` 变为 `Injectable` 的。

但现在我们知道了 `npm link` 这个强大的命令。在创建好对应的链接文件之后，我们就可以直接改本地的库，改动会立即反映到我们项目的代码里头。

我们在 `@opensumi/di` 对应的装饰器和构造函数里头塞入一行 `console.log` 语句。

```typescript
/**
 * 装饰一个 Class 是否是可以被依赖注入
 * @param opts
 */
export function Injectable(opts?: InstanceOpts): ClassDecorator {
  return <T extends Function>(target: T) => {
    Helper.markInjectable(target, opts);

    console.log('Made', target, 'Injectable');
```

然后重新构建一下 `@opensumi/di`

在自己的项目下重新运行一次上上面的那段代码，结果如下

```shell
➜  node-scripts ts-node-esm di-test.ts
Made [Function: A] Injectable
Made [Function: B] Injectable
Create B
Create A
true
{ a: 1, b: 2 }
```

此时，我们可以大概看出两个类什么时候被 make 为 Injectable 了

我们尝试让代码抛出一个错误，修改上上面代码的最后一行为

```typescript
console.log(injector.get("1919810"));
```

从 stack trace 上，也可以清晰明了看到链接的库的文件路径

```shell
➜  node-scripts ts-node-esm di-test.ts
Made [Function: A] Injectable
Made [Function: B] Injectable
Create B
Create A
true
/Users/situ/Codes/di/dist/error.js:45
    return new Error("Cannot find Provider of ".concat(tokens.map(function (t) { return stringify(t); }).join(', ')));
           ^
Error: Cannot find Provider of 1919810
    at Object.noProviderError (/Users/situ/Codes/di/dist/error.js:45:12)
    at Injector.get (/Users/situ/Codes/di/dist/injector.js:204:33)
    at file:///Users/situ/Codes/Playground/node-scripts/di-test.ts:34:22
    at ModuleJob.run (internal/modules/esm/module_job.js:183:25)
    at async Loader.import (internal/modules/esm/loader.js:178:24)
    at async Object.loadESM (internal/process/esm_loader.js:68:5)
    at async handleMainPromise (internal/modules/run_main.js:59:12)
```

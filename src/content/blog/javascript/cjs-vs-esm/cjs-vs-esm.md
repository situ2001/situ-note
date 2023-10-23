---
title: CJS和ESM
comments: true
date: 2022-03-31 10:15:00
categories: JavaScript
description: CommonJS 和 ESM 的一些区别
---

## 前言

最近在做的一个 nest.js 项目，其中遇到了不同标准的模块共用的“坑”。

比如我要使用 `unified` 这个模块及其生态来解析 markdown 文件，但是这个模块呢，它写明了 **ESM-only**。

由于该 nest 项目的`package.json`的 type 不是`type: "module"`,如果直接使用的话就会报错如下

```shell
const unified_1 = require("unified");
                  ^
Error [ERR_REQUIRE_ESM]: require() of ES Module node_modules\unified\index.js from xxx.service.js not supported.
Instead change the require of index.js in xxx.js to a dynamic import() which is available in all CommonJS modules.
```

根据错误提示，我去翻了一下，看到在 Node12 之后，支持了 ESM 的 dynamic import。也就是说，我们可以如下导入 ESM

```typescript
const { foo } = await import("npm-package");
```

那我尝试改一下

```typescript
const { unified } = await import("unified");
```

但还是报错了

```shell
xxx.service.js:41
    const { unified } = await Promise.resolve().then(() => require('unified'));
                            ^
Error [ERR_REQUIRE_ESM]: require() of ES Module node_modules\unified\index.js from xxx.service.js not supported.
Instead change the require of index.js in xxx.service.js to a dynamic import() which is available in all CommonJS modules.
```

我看一看 TypeScript 到底被编译成了什么

```javascript
const { unified } = await Promise.resolve().then(() => require("unified"));
```

emm...编译之后的 js 代码还是 用了`require()` 来导入 ESM，那有什么办法让它不把 dynamic import 给转译到 `require()` 吗？

应该是 tsconfig 的问题，上网找了一下，发现了这个 [issue](https://github.com/microsoft/TypeScript/issues/43329) 下~~也有不少 campaign~~，不过细看可以发现，在 Typescript4.5 之后支持了一个新的特性：[ECMAScript Module Support in Node.js](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta/)

即可以在 `"type": "commonjs"` 的 Node 项目里头同时支持 CommonJS 与 ESM，我们只需要在 tsconfig 里头更改如下即可

```json
{
  "compilerOptions": {
    "module": "node12"
  }
}
```

最后编译的产物如下，这个 ESM-only 的模块就能正常使用了

```javascript
const { unified } = await import("unified");
```

## 两者的区别

在此坑出现之前，我对 CommonJS 和 ESM 的概念，并没有认识太多，只有：CommonJS 是 Node 的模块规范，ESM 是 ES 的模块规范，后者的出现，代表着模块终于被作为 ES 的核心特性了。

Node 和 ESM 对于模块的主要定义是差不多的，即每一个文件都是一个拥有**私有命名空间**的独立模块，模块也有作用域，是模块文件本身。

我们在在文件里头定义的变量、常量、函数和类都是私有的，除非它们被显式地导出。

接下来，它们主要的区别就是导入导出的 syntax 了。

CommonJS 的导入，它在 node 中是使用 `require()` 导入的

```javascript
const fs = require("fs");
const foo = require("./foo.js");
// or
const { sum } = require("./foo.js");
```

导出，通过设置全局 Export 对象的属性或者完全替换 module.export 对象，来导出公共 API

```javascript
// 直接设置全局 exports 对象的属性
exports.foo = () => console.log("Hello from foo");
exports.bar = () => exports.foo();

// 或者直接设置模块的默认导出
module.exports = /** class, function, variable */
// or export as an object
const sum = (x, y) => x + y;
const avg = (x, y) => (x + y) / 2;
module.exports = { sum, avg };
```

我们在一个文件中，导入的 ESM 的值的标识符都是**常量**

导入只能在模块的顶层导入（动态导入除外），**并且**要是一个带 `/` 的绝对路径或者开头为 `./` `../` 的相对路径，这样做可以避免歧义。

导入的函数也是会被“提升”到顶部的。

我们还可以导入一个没有任何导出的模块，一般用途是执行一个模块里头的代码（比如注册一些事件啥的）

并且，我们还能对导入进来的标识符进行重命名。

```javascript
import foo from "./foo.js";
import { sum } from "./foo.js";
import Bar, { sum, avg } from "./foo.js";
import * as util from "./foo.js";
// 导入一个没有任何导出的函数
import "./foo.js";
// 重命名
import { sum as s } from "./foo.js";
import { default as Foo, avg } from "./foo.js";
```

导出也可以导出变量、常量、函数和类，模块只能有一个默认导出，以及多个常规导出。ESM 的 export 关键字**只能**出现在 JS 代码的顶层，即不能出现在函数，类，块里头。对导出的标识符，我们也可以进行重命名。

```javascript
export class Bar {}

// OR
export default class Bar {}
const sum = (x, y) => x + y;
const avg = (x, y) => (x + y) / 2;
export { sum, avg };
export * from "./bar.js";
export { mean } from "./bar.js";
export { sum as s };
```

ESM 还有一个特性就是`import.meta`这个特殊的语法，它引用了一个特殊的对象，这个对象包含了当前执行模块的元数据，经常用到的有`import.meta.url`即加载模块时使用的 URL(类比一下 Node 模块的`__dirname`)

### 动态导入

ESM 和 CommonJS 的导入和导出都是静态的，ES2020 又把动态导入加了进来，ESM 可以被异步地动态导入，使用`import()`，值得注意的是这个是一个**操作符**，不是函数！

比如我们本来就可以静态导入一个对象

```javascript
import { avg } from "./foo.js";
```

而现在我们现在还可以动态地导入一个对象了

```javascript
import("./foo.js").then((foo) => {
  let meanValue = foo.avg(n1, n2);
});
```

还有更多的细节可以看看[这里](https://nodejs.org/api/esm.html#esm_differences_between_es_modules_and_commonjs)

## 做一个 Pure ESM

那么问题来了，前言中提到的这个包，它是怎么样实现 ESM-only 的呢？

~~如果是新建一个的话，其实很简单~~，如果不是，还要考虑如 tsconfig.json 的配置，更改模块内的 import 的 syntax，可以参考这个[gist](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)，写得很详细

把这个模块中的 CommonJS 的 export 给去掉，换成 ESM 的 export，再把 `package.json` 的 `type` 给改成 `module`，以及将 `main` 改为 `exports` 即可

```javascript
function hello(name) {
  console.log(`Hello, ${name}`);
}

export { hello };
```

改 `package.json` 的 `type` 以及将 `main` 改为 `exports`

```json
"exports": "./index.js",
"type": "module"
```

这下我们在一个 CommonJS 项目中直接导入

```javascript
const { hello } = require("../esm-only-package");

hello("situ2001");
```

就会报错

```shell
const { hello } = require('../esm-only-package');
                  ^

Error [ERR_REQUIRE_ESM]: require() of ES Module C:\Users\situ\Desktop\tmp\esm-only-package\index.js from C:\Users\situ\Desktop\tmp\node-test\index.js not supported.
Instead change the require of C:\Users\situ\Desktop\tmp\esm-only-package\index.js in C:\Users\situ\Desktop\tmp\node-test\index.js to a dynamic import() which is available in all CommonJS modules.
    at Object.<anonymous> (C:\Users\situ\Desktop\tmp\node-test\index.js:1:19) {
  code: 'ERR_REQUIRE_ESM'
}
```

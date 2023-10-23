---
title: 如何模拟递归
comments: true
date: 2023-01-16 23:45:00
categories: JavaScript
description: 在JS下模拟递归
---

使用递归解决问题就像喝水一样简单。没有任何心智压力。

但是非递归往往就不是这样了。比如最常见的二叉树前中后序遍历，特别是后两者，大量出现于程序员面试中，想要在现场写对非递归遍历，还是非常不简单的。

那么，有没有一种通法，可以让我们轻松地原地将递归调用转化为非递归调用呢？那肯定是有的。

## 准备一棵树

在此之前，先定义二叉树的节点，以及构建一颗二叉树。

```javascript
class TreeNode {
  constructor(val, left, right) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

const root = new TreeNode(
  4,
  new TreeNode(2, new TreeNode(1), new TreeNode(3)),
  new TreeNode(6, new TreeNode(5), new TreeNode(7))
);
```

## 递归的中序遍历

很简单很自然，就不多说了。

```javascript
const traverse = (root) => {
  if (!root) {
    return;
  }
  traverse(root.left);
  console.log(root.val);
  traverse(root.right);
};
```

## 非递归的中序遍历

把之前的力扣解答拿过来。这里的栈是临时存放二叉树节点的，这个跟模拟递归过程差的有点远，不妨说是模拟中序遍历的过程。

```javascript
/** iterative
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function (root) {
  const result = [];
  if (!root) {
    return result;
  }

  const stack = [];
  let cur; // current pointed node
  cur = root;
  while (cur || stack.length > 0) {
    if (cur) {
      stack.push(cur);
      cur = cur.left;
    } else {
      const t = stack.pop();
      result.push(t.val);
      cur = t.right;
    }
  }

  return result;
};
```

## 模拟递归

模拟遍历过程其实挺麻烦的。哎呀，看着自己写的递归不能用，真的是咬牙切齿。既然那不能用递归，我们能不能用迭代来**模拟递归**呢？

仔细回想专业课学习的知识，函数调用和执行的过程是与调用栈有关的，函数在被调用的时候，将对应的信息压入调用栈。一个函数在栈上表示的基本单位是**栈帧**，栈帧包含了**函数的参数**，局部变量，以及**返回地址**等等。

这里的返回地址，会在函数执行完毕后被使用 —— 通过`ret`指令，从调用栈 pop 出，装载到 PC 寄存器，即可跳转到 caller 的将要继续执行的代码上。

PS：这里的`ret`指令，可以简单地理解为 JS 的`return`。函数执行完后，将会从栈上弹出。

那么，总结出简单模拟所需的元素

1. 调用栈
2. 栈帧（包括了函数参数以及函数的 PC 指针）

```javascript
const stack = [];

class StackFrame {
  constructor(arg, pc) {
    this.arg = arg;
    this.pc = pc;
  }
}
```

再想想，PC 地址什么时候需要被保存到调用栈上？一般是该函数调用其他函数的时候，需要保存 PC 信息。那么我们可以将中序遍历划分为若干段。

```javascript
const traverse = (root) => {
  // pc = 0
  if (!root) {
    return; // pop
  }
  traverse(root.left);
  console.log(root.val); // pc = 1, waiting for return of traverse(root.left)
  traverse(root.right);
  // pop
};
```

拥有这些背景知识后，我们就可以转化过来了。如下所示。

```javascript
const simulate = () => {
  const stack = [];
  stack.push(new StackFrame(root, 0)); // invoke traverse(root)

  while (stack.length > 0) {
    let top = stack.at(-1);
    let arg = top.arg;

    if (top.pc === 0) {
      if (!arg) {
        stack.pop(); // if (!arg) pop
      } else {
        top.pc = 1; // mark addr of console.log(val)
        stack.push(new StackFrame(arg.left, 0)); // invoke traverse(arg.left)
      }
    } else if (top.pc === 1) {
      console.log(arg.val);
      stack.pop(); // return
      stack.push(new StackFrame(arg.right, 0)); // invoke traverse(arg.right)
    }
  }
};
```

跑出结果 `1 2 3 4 5 6 7`

## 转化为迭代器

模拟出来的迭代已经有了，那我们就可以顺手转化为迭代器了。实现`Symbol.iterator`生成器即可。该迭代器类维护一个调用栈。

```javascript
class TreeIterator {
  constructor(root) {
    this.stack = [];
    this.stack.push(new StackFrame(root, 0));
  }

  *[Symbol.iterator]() {
    while (this.stack.length > 0) {
      let top = this.stack.at(-1);
      let arg = top.arg;

      if (top.pc === 0) {
        if (!arg) {
          this.stack.pop();
        } else {
          top.pc = 1;
          this.stack.push(new StackFrame(arg.left, 0));
        }
      } else if (top.pc === 1) {
        yield arg.val; // HERE
        this.stack.pop();
        this.stack.push(new StackFrame(arg.right, 0));
      }
    }
  }
}
```

调用一下

```javascript
console.log([...new TreeIterator(root)]); // [1, 2, 3, 4, 5, 6, 7]
```

Done. 一切都是那么的简单。

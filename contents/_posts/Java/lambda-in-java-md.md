---
title: λ在Java
comments: true
date: 2021-02-22 13:14:15
tags:
permalink: contents/3b19f30c2f96/
categories: Java
---

我之前一直以为Java里头的Lambda表达式就是SAM的语法糖...

<!-- more -->

## 萌新认知

说起Lambda表达式这个东西啊，我之前是在梁勇的教材里面的anonymous inner class部分看到的。书上是用JavaFX来举例的，那我换个简单的例子，我们知道new一个Thread，可以这样。

``` java
new Thread(new Runnable() {
    @Override
    public void run() {
        /** your code here */
    }
});
```

使用了Lambda表达式之后就变成了这个样了

``` java
new Thread(() -> { /** your code here */ });
```

为什么可以这样？我们可以来看看Runnable这个interface里面有啥

``` java
@FunctionalInterface
public interface Runnable {
    public abstract void run();
}
```

由上看出，这个interface里面只有一个Abstract method，在jdk1.8之后，实现一个方法的接口（Single Abstract Method即是SAM）可以用Lambda表达式来代替。这种接口上一般会有一个annotation `@FunctionalInterface`来indicate这是一个函数式接口。

如果有一个FunctionalInterface的方法是`String dosth(String s)`，那么Lambda表达式也可以这样子，param是自己推断，可以不加类型声明

``` java
s -> /** return a String */
(s) -> /** return a String */
(String s) -> /** return a String */

s -> {/** do sth */ return xxx;}
// the same
```

上述这是我之前对Lambda表达式的认知：**简 短**，仅此而已。

## 刷新认知

直到我学会了JavaScript...

我认为，java中匿名类和Lambda表达式的关系就像是js中Function和Arrow Function的关系。

在js里头，箭头函数和普通函数的区别一般是前者没有了**属于自己**的`this`（来自lexical scope）和`arguments`，这意味着将箭头函数作为constructor和实现长度可变参数是不可能的了。使用`bind` `call`和`bind`是不合适的，因为建立起来的scope还是来自lexical scope。所以下面这个例子，在nodejs下。

``` javascript
var obj = { num: 114514 };
this.num = 1919810;
var test = (x) => this.num + x;
console.log(test.apply(obj, [1])); //result 1919811
```

那java中的Lambda表达式也是这样子的吗？我做了一个小实验。

``` java
package test;

public class Test {
    public Test() {
        System.out.println(this.getClass().getTypeName());
        new Thread(() -> System.out.println("Lambda: "+ this.getClass().getTypeName())).start();
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("Anonymous inner class: " + this.getClass().getTypeName());
            }
        }).start();
    }

    public static void main(String[] args) {
        new Test();
    }
}
```

结果是

``` shell
test.Test
Lambda: test.Test
Anonymous inner class: test.Test$1
```

那么可以说是，Lambda表达式自己capture了外层的`this`了。

js中，有个叫做closure（闭包）的特性，就是说js的函数可以根据context来捕获外部的全局变量来与之组成闭包，如下

``` javascript
var myObject = function () {
    var value = 0;

    return {
        increment: function (inc) {
            value += typeof inc === 'number' ? inc : 1;
        },
        getValue: function () {
            return value;
        }
    };
}();
myObject.increment(114514);
console.log(myObject.getValue()); // 114515
```

上面这个，`value`与return语句中的对象（这里就是myObject)形成了闭包，出了这个函数之后，value依旧可以被`myObject`中的两个方法所访问。

那么java中的Lambda或者匿名内部类也能这样吗？（草）我们先来看一段代码

``` java
public static void dosth() {
  int value = 0;
  IntStream.range(0, 114514).forEach(i -> value += i);
}
```

如果你在Lambda或匿名内部类中做这种事情，就会收到编译器给你的错误`Variable used in lambda expression should be final or effectively final`

这是为什么呢？我之前百思不得其解，没知道根本原因，导致用匿名类的时候总是蹩手蹩脚着试探着用。直到我看到了反编译了这段代码

``` java
public class Test {
    public static void main(String[] args) {
        int i = 0;
        IntStream.range(0, 114514).forEach(new IntConsumer() {
            @Override
            public void accept(int value) {
                System.out.println(i);
            }
        });
    }
}
```

的`Test$1.class`后...得到如下结果...

``` java
class Test$1 implements IntConsumer {
    Test$1(int var1) {
        this.val$i = var1;
    }

    public void accept(int value) {
        System.out.println(this.val$i);
    }
}
```

这看起来就是直接把要捕获的变量，复制了一份进去...怪不得不能修改，不然改了就会内外不一致...难道不能引入词法作用域吗？看着java这啰嗦可靠的代码，估计还是为了，保持稳定可靠吧？（个人观点

## 继续瞎摸

### Stream类

学js的时候我了解到了Array有对应一些方法，可以很简便地对连续的数据结构进行处理，比如求和、筛选和映射

``` javascript
var array = [1, 2, 3, 4, 5];

console.log(array.reduce((a, b) => a + b)); // 15
console.log(array.filter(i => i <= 3)); // [1, 2, 3]
console.log(array.map(x => x * 2)); // [2, 4, 6, 8, 10]
```

如此简便的操作，我一直在想java有没有呢？最后发现了一个[Stream](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/stream/package-summary.html)类，打开了新世界的大门。在java中也可以对数据进行类似的操作。如下面的例子，结果跟上面js的是一样的。最后使用`collect()`方法来转换回List。

``` java
public class Test {
    public static void main(String[] args) {
        List<Integer> integers = List.of(1, 2, 3, 4, 5);

        int sum = integers.stream().reduce(0, (a, b) -> a + b); // 15
        List<Integer> list = integers.stream().filter(i -> i <= 3).collect(Collectors.toList()); // [1, 2, 3]
        List<Integer> list1 = integers.stream().map(x -> x * 2).collect(Collectors.toList()); // [1, 2, 3, 4, 5]
    }
}
```

然后，我又在上面发现了，这些方法里头有不同的对象。

``` java
public abstract T reduce(T identity, java.util.function.BinaryOperator<T> accumulator)
public abstract Stream<T> filter(java.util.function.Predicate<? super T> predicate)
public abstract <R> Stream<R> map(java.util.function.Function<? super T, ? extends R> mapper)
```

这又涉及到java8开始为Lambda所提供的的一个包`java.util.function`了...它是用来给Lambda提供支持的，介绍是这样的

> Functional interfaces provide target types for lambda expressions and method references. Each functional interface has a single abstract method, called the functional method for that functional interface, to which the lambda expression's parameter and return types are matched or adapted.

来个简单的，就`Function`来说说吧。进入`Function.java`，我们可以看出，又是一个Functional Interface，因此我们可以往上面盖Lambda表达式或者**方法引用**。

就像是这样(省略了一些default方法)

``` java
/**
 * Represents a function that accepts one argument and produces a result.
 *
 * <p>This is a <a href="package-summary.html">functional interface</a>
 * whose functional method is {@link #apply(Object)}.
 *
 * @param <T> the type of the input to the function
 * @param <R> the type of the result of the function
 *
 * @since 1.8
 */
@FunctionalInterface
public interface Function<T, R> {

    /**
     * Applies this function to the given argument.
     *
     * @param t the function argument
     * @return the function result
     */
    R apply(T t);

}
```

比如我们可以用来determine一个String的长度。

``` java
// Lambda expression
Function<String, Integer> function = s -> s.length();

function.apply("114514"); // 6
```

这里的`apply()`把"114514"传了进去。同理这个包里面的其他类也可以这么用，比如`BiFunction`，意思就是有两个参数的函数。

``` java
BiFunction<String, String, Integer> function = (s1, s2) -> s1.compareTo(s2);
function.apply("114514", "1919810"); // -8
```

### 方法引用

然后万能的IDEA IDE又告诉我，可以使用方法引用来代替Lambda表达式(???)试了一下，发现是这样子的。

``` java
Function<String, Integer> function = String::length;
BiFunction<String, String, Integer> function = String::compareTo;
```

看起来就像是把String里面的`length()`和`compareTo(String s)`方法给“引用”了过来。我一一观察，return type一样，但是...参数不一样啊...都是少了一个参数，但是一些static方法又是可以一一对应上去的...

那我们把这个

``` java
BiFunction<String, String, Integer> function = String::compareTo;
function.apply("114514", "1919810");
```

javap一下，得到字节码，我发现了这个

``` java
invokedynamic #2,  0              // InvokeDynamic #0:apply:()Ljava/util/function/BiFunction;

BootstrapMethods:
0: #27 REF_invokeStatic java/lang/invoke/LambdaMetafactory.metafactory:(Ljava/lang/invoke/MethodHandles$Lookup;Ljava/lang/String;Ljava/lang/invoke/MethodType;Ljava/lang/invoke/MethodType;Ljava/lang/invoke/MethodHandle;Ljava/lang/invoke/MethodType;)Ljava/lang/invoke/CallSite;
```

emm之前没有了解过JVM的instruction。甚至还有一个我从没见过的类`LambdaMetafactory`。看了看[java doc](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/invoke/LambdaMetafactory.html)，有如下的说明。

> Methods to facilitate the creation of simple "function objects" that implement one or more interfaces by delegation to a provided MethodHandle, possibly after type adaptation and partial evaluation of arguments. These methods are typically used as bootstrap methods for invokedynamic call sites, to support the lambda expression and method reference expression features of the Java Programming Language.

知道了Lambda的内部用的是`MethodHandle`，还知道了`invokedynamic`指令会调用BSM来生成一个Call Site...（真的是盲区），然后`implMethod`就是对应interface的implementation了。

所以我等零专业基础菜狗只能在IDE里面在这个方法上打断点试试了。最后Debug试出了这个

`instantiatedMethodType: "(String, String)int"`

嗯？直接多出一个参数？再仔细看看文档...

> implMethod (the MethodHandle providing the implementation has M parameters, of types (A1..Am) and return type Ra (if the method describes an **instance method**, the method type of this method handle already **includes an extra first argument** corresponding to the receiver);
>
> instantiatedMethodType (allowing restrictions on invocation) has N parameters, of types (T1..Tn) and return type Rt.

也就是说，如果是实例方法的话，就会在首位加多一个argument（就是把this作为了第一个参数），而静态方法就是原来的样子了。

那么，刚刚的方法引用`String::compareTo`就很好解释了，`compareTo(String s)`是一个实例方法，因此来到这里，他的签名就变成`(String, String)int`了。（这里绑定到第一个参数的this是`::`前面的`String`，但，如果是`"dssq"::compareTo`的话，这里的this就是`"dssq"`了，签名就是`(String)int`（因为前面的this已经绑定了，不能改变了，所以签名就是这样了）

``` java
Function<String, Integer> function = "dssq"::compareTo;
function.apply("114514"); //51
```

所以方法引用，静态方法的引用的方法签名是一样的。实例方法就要看情况，普通的情况，拿`compareTo`来讲，签名是`(String, String)int`实际上就是相当于这样: `this.compareTo(String s)`（this位于第一个位）

后面的内容因为有点盲区，都是现卖，如果有错请指出！

## 学过其他语言后

学过其他的语言如groovy / js。才发现，似乎是因为java很面向对象，所以将Lambda表达式也是类。在其他语言里头，Lambda或许不叫Lambda而是叫closure（闭包）。js里头的函数，就直接是个类型，是一等公民（

Lambda和闭包在编程语言中一般是**一小块代码**，也就是叫做匿名函数。我觉得它们带来了一些便利——不需要为实现一个小功能而去额外定义一个函数。给coding带来了方便。

正是因为这样，所以用Lambda和闭包的时候最好要根据实际情况来使用。实现匿名类的话，如果Lambda能清晰表明你要做的东西就用（比如说上面提到的Stream），不能的话还是直接写匿名类吧（因为可以带来更加易读的代码）。这句话是我的想法，不知其他人的想法是怎么样的。
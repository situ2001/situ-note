---
title: 项目小总结之简易井字棋
comments: true
date: 2021-02-27 15:14:16
tags:
permalink: contents/76029e119cb2/
categories: 笔记
---

(个人笔记) 就算是玩具项目，做完也会有不少收获——主要是对gradle和groovy的初步认识

<!-- more -->

这次学到了包管理工具和jar相关，还有一门脚本语言Groovy。

包管理工具常见的有maven和gradle，我选择了后者。

我们知道，依赖多并复杂起来的时候，谁都想要一个可以帮忙自动处理dependency的工具。于是我就尝试使用一下gradle。

## 写在前面

还是日常将文档页面放在这里: [gradle doc](https://docs.gradle.org/current/userguide/userguide.html)

## 一瞥

这次没有先去看文档，而是先用IDEA新建了一个gradle project，可以看出多了许多东西。

目录结果可能如下（**摘自官方**）。不过IDEA中，默认gradle生成的，其中除了`build.gradle`，都在app文件夹外面。（应该是因为IDEA创建的为单项目，没有包含子项目的原因吧）

``` shell
├── gradle 
│   └── wrapper
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── gradlew 
├── gradlew.bat 
├── settings.gradle 
└── app
    ├── build.gradle 
    └── src
        ├── main
        │   └── java 
        │       └── demo
        │           └── App.java
        └── test
            └── java 
                └── demo
                    └── AppTest.java
```

比如`setting.gradle`和`build.gradle`（用IDEA的wizard新建的）

其中`setting.gradle`项目的设置，里面包含着子项目和build的一些definition。而`build.gradle`就是特定的一个项目或者子项目的build script。它们都是用的groovy语言或者kotlin（这里我选择的是groovy）

``` groovy
//setting.gradle
rootProject.name = 'gradletest'

//build.gradle
plugins {
    id 'java'
}

group 'org.example'
version '1.0-SNAPSHOT'

repositories {
    mavenCentral()
}

dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter-api:5.6.0'
    testRuntimeOnly 'org.junit.jupiter:junit-jupiter-engine'
}

test {
    useJUnitPlatform()
}
```

从上面可以看出，除此之外。他生成了一些文件和文件夹，`gradle/wrapper`里头装着`gradle wrapper`，然后就还有wrapper的启动脚本。

关于这个wrapper，他虽然很小，但是它可以调用来下载对应的gradle版本，帮你快速构建，免去手动下载安装gradle的麻烦。

这个wrapper执行的步骤大概是：先下载dist到本地，然后解压，最后使用这个dist来构建这个项目。的确有点意思

## 我的项目

这次实践的就是一个简单的井字棋了，大致原理也不是很难，所以就不多多解释了。这次的目的主要是：一些工具的学习与使用。

先搁出这个练手小项目的github repo吧: [SimpleTicTacToeGame](https://github.com/situ2001/SimpleTicTacToeGame)

从大致的目录结构中可以看出，里面有两个子项目:`client`和`server`，顾名思义，就是对应着客户端和服务端。`setting.gradle`搁在root下，而`build.gradle`搁在每个子项目文件夹里头，这符合了官方对这两个文件的解释。

里面用到的东西不是很多，我用gradle来管理自己的项目的最初想法，也就是想隔离开来方便管理而已，后来才想起用它来构建jar。但是dependencies这个就没有碰过了。

这次我就用到了这些东西

- 将server和client隔开来

要实现这个，我就需要用到子项目这个操作了，看了看官方对它的说明，我开始按葫芦画瓢。新建了文件夹`server`和`client`，然后每个下面放好`build.gradle`和文件夹`src`。最后，项目根目录下的`setting.gradle`如下所示

``` groovy
rootProject.name = 'SimpleTicTacToeGame'
include 'server', 'client'
```

- 构建jar包

既然有wrapper了，官网查询一下命令。然后在命令行里头输入

``` shell
./gradlew jar # for the whole project
#or
./gradlew client:jar # jar task for sub project client
```

这样就能在在build文件夹里头找到jar了，通过上述操作，命令大概也就是 `./gradlew <subproject>:<task>` 或者 `./gradlew <task>`吧

## Groovy语言

这也是一个跑在JVM上面的语言，还是一种**脚本语言**，**动态语言**...为什么要了解一下这个呢？因为gradle里面的script都用着groovy或者kotlin的DSL(Domain-Specific Language)啊。不知道一些基础的话，写起来就奇奇怪怪的。

不过由于是DSL，那么就不用完全了解过一遍这个语言，事实上有java的基础，迁移学习groovy是非常容易的，并且官方也给出了[Groovy与Java的差别](https://groovy-lang.org/differences.html)

通过阅读，我大概发现了，要在gradle的配置文件里写，几点东西需要看看：

- 默认import了一些常用包，比如`java.lang.*`也就是说可以不用`System.out.print`而是`print`即可
  
- 初始化数组，对比一下，groovy用的`[]`
  
``` java
//java
int[] a = {114, 514}; // or new int[]{114, 514}
//groovy
int[] a = [114, 514] //有py内味
List b = [1919, '810'] // powerful
```

- 跟Java中的Lambda比较，这边叫做闭包Closure了，主要是 `() ->`变成了`{ }`，inner class和anonymous inner class的写法跟java也差不多，但是...真香?

> The implementation of anonymous inner classes and nested classes follow Java closely, but there are some differences, e.g. local variables accessed from within such classes don’t have to be final.

``` java
Runnable run = () -> System.out.println("Run");  // Java
list.forEach(System.out::println);

Runnable run = { println 'run' } //Groovy
list.each { println it } // or list.each(this.&println)
```

- 自 Java7 开始出现的 ARM 也变了写法

``` groovy
//本来是 try(Scanner in = ...) {} 的
//But in Groovy
new File('/path/to/file').eachLine('UTF-8') {
   println it
}
```

- `==` 变成`equals()`了（
  
- 一些可能用到的新keyword

``` groovy
it //in closure
def // def i = 1919810
var // var i = 1919810 (from Java)
in // (Python
```

- pass参数的时候，可以不需要带符号

``` groovy
print '114514'
new Thread().start { /** closure */ }
```

- 多方法

groovy动态，要运行的方法都是在运行时选择的，而不是像Java那样由declared type决定

``` java
int method(String arg) {
    return 1;
}
int method(Object arg) {
    return 2;
}
Object o = "Object";
int result = method(o);
```

java运行就是`2`，Groovy就是`1`

- 字符串

就像这样，`'i=${i}'`，接触多了js应该不陌生

- class为一等公民

即Class可以忽略`.class`

- with操作对象

使用`with`，可以批量对一个对象进行操作

``` groovy
Test test = new Test()
test.with {
  ds = 114514
  sq = 1919810
}
```

- 判断非null

``` groovy
print obj?.id?.number
```

- 范围

``` groovy
114..514 // 114(inclusive) to 514(inclusive)
```

- switch

不仅可以是数字，字符，Enumerate，还可以是其他

``` groovy
switch (test) {
  case Integer:
  case [1, 14514, 'dssq']:
  case { it > 891 }:
  case 114..514:
}
```

## 继续学习

初步入手了这几个东西，现在或以后想要用的时候，就要去gradle的文档里头查api用了。（据说难度跟CMake一样，害怕

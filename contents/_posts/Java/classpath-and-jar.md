---
title: classpath和jar
comments: true
date: 2021-02-28 18:00:00
tags:
permalink: contents/7db3c9ea2bf1/
categories: Java
---

学Java，怎能不知道classpath和jar呢？

<!-- more -->

## classpath

`classpath`，顾名思义就是class path，即class的路径。网上一搜，很多文章都是关于java在windows下的环境变量配置的，但我觉得不应该在环境变量里头设置classpath。为什么呢？请看我胡乱分析

只需要知道，classpath其实是JVM用到的一个环境变量，**是给JVM来寻找class用的**。

指定classpath的方法可以是给`java`传入`-cp`或者`-classpath`，默认的话就是`.`即当前目录。

比如说，我在`C:\Users\situ\foo\bar`里头有一个`Hello.class`，如果此时JVM要加载一个`foo.bar.Hello`类。而我们指定的classpath为`.;C:\Users\situ`，命令如下

``` shell
java -cp .;C:\Users\situ foo.bar.Hello
```

那么就会这样按着classpath去找class

`<current dir>\foo\bar\Hello.class`

`C:\Users\situ\foo\bar\Hello.class`

那这些都是用户自己的class，java自带的类呢？...不需要操心的，JVM自己知道的。

## 一个疑问

摘自我的笔记 -- Situ Note

Q: 为什么`javafx.scene.image.Image`的relative url是相对于classpath的，而`java.io.File`的path url不是？

> The Java IO API relies on the local disk file system, not on the classpath.
>
> `Java.io`的相对路径是根据此时的working directory来决定的

``` java
package test;
import java.io.File;
public class Test {
    public static void main(String[] args) {
        // Don't fiddle with relative paths in java.io.File. 
        // They are dependent on the current working directory over which you have totally no control from inside the Java code.
        File file = new File("./test.dat");
        System.out.println(file.getAbsolutePath());
    }
}
```

比如这样，的确是根据工作目录来的。

``` shell
C:\Users\situ\codes>java -cp C:\Users\situ\codes\experiment\out\production\experiment test.Test
C:\Users\situ\codes\test.dat
```

而之前使用JavaFX，要读图只能放在classpath下。之前搞不懂，是因为我不知道classpath到底是个什么鬼，而现在我懂了。

``` java
// The image is located in my.res package of the classpath
Image image2 = new Image("my/res/flower.png");
```

如果classpath是`C:\Users\situ\codes\experiment\out\production\experiment`那么这个图片的绝对路径就是`C:\Users\situ\codes\experiment\out\production\experiment\my\res\flower.png`

## jar

其实jar实质上就是一个压缩文件...就拿我的丢人井字棋client来说说吧（这个jar包是用gradle构建的）。先把这个jar解了，看下目录结构。

``` shell
C:\Users\situ\github\SimpleTicTacToeGame\client\build\libs\client-1.0-SNAPSHOT>tree /F
Folder PATH listing for volume OS
Volume serial number is 3C20-9E7B
C:.
│  Client$Cell.class
│  Client$O.class
│  Client$X.class
│  Client.class
│
├─META-INF
│      MANIFEST.MF
│
└─res
    Constants.class
```

可以看出，除了编译好的class，这些class要按照package的路径来放，比如`res.Constants`就要按规矩放，放为`res\Constants.class`。

这个jar里面还有一个`MANIFAST.MF`，打开一开，发现里面标明了Main-Class

```
Manifest-Version: 1.0
Main-Class: Client
```

怎么运行这个jar呢？很简单只需要输入这个命令就行了。

``` shell
C:\Users\situ\github\SimpleTicTacToeGame\client\build\libs>java -jar client-1.0-SNAPSHOT.jar
```

我觉得这个可以不用了解太多，可以运行，知道本质就行了。剩下的东西当然是靠构建工具啊（
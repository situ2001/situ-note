---
title: 初识抽象与接口
date: 2020-10-22 16:24:00
tags:
permalink: contents/de7e01688b2c/
categories: Java
---

这篇记录了咱对Java面向对象编程中抽象与接口的初步理解

<!-- more -->

在了解了OOP中的封装、继承与多态之后，我继续前行到抽象与接口的学习

因为是初次接触一下这个内容就开始输出文章了，估计问题不少，希望大神能指正

## 修订记录

1. 2020-10-24 初版

## 抽象类

抽象是什么？什么是抽象？在了解OOP的抽象之前，我在一本计算机导论书里面读过这段话
> The term **abstraction**, as we are using it here, refers to the distinction between the external properties of an entity and the details of the entity's internal composition. It is abstraction that allows us to ignore the internal details of a complex device and use it as a single, comprehensible unit.

这段话大概是说了抽象存在的作用，它使得我们的社会分工更加妥当，在许多地方，你只需要做好你自己的本能，而不必刻意去理解你所作所为的背后的原理

这就像计算机与用户之间的关系一样，当你作为用户，你不用去了解程序的运行过程和CPU的原理，这些东西并不会影响你的日常使用，你作为用户只需要好好去使用计算机就行了，此时这些原理就像黑盒子一样，被封装被抽象起来了

那么OOP语言中的抽象也是这个道理吗？

那我这里还是拿上一篇文章所用的类GeometricObject和Circle来举例

``` java
/** UML diagram */
               GeometricObject
-------------------------------------------------
-color: String
-filled: boolean
-dateCreated: java.util.Date
-------------------------------------------------
+GeometricObject()
+GeometricObject(color: String, filled: boolean)
+getColor(): String
+isFilled(): boolean
+setFilled(filled: boolean): void
+getDataCreated(): java.util.Date
+toString(): String


                      Circle
-------------------------------------------------------
-radius: double
-------------------------------------------------------
+Circle()
+Circle(radius: double)
+Circle(radius: double, color: String, filled: boolean)
+getRadius(): double
+setRadius(radius: double): void
+getArea(): double
+getPerimeter(): double
+getDiameter(): double
+printCircle(): void
```

还是这熟悉的两个类，只不过仔细观察，你会发现，计算周长和面积的方法`getPerimeter()`和`getArea()`都位于Circle类，但是每一个GeometricObject理论上都要计算面积和周长啊，然而由于每种几何图形的面积周长的计算方法都不一样，因此这两个方法都是依赖于特定图形的类如Circle的

那我们应该怎么样让GeometricObject的实例使用`getPerimeter()`和`getArea()`方法呢？

我们可以把类改成抽象类，然后在这个类里面添加抽象方法`getPerimeter()`和`getArea()`

于是将其class header

``` java
public class GeometricObject
```

加个 modifier **abstract** 改变为如下

``` java
public abstract class GeometricObject
```

并在GeometricObject类里，加入抽象方法

``` java
/**abstract classes */
public abstract double getArea();

public abstract double getPerimeter();
```

抽象方法body都是空的，虽然这个抽象方法存在于GeometricObject类里面，但是并不由这个类实现，这个方法的实现交给了继承它的子类来实现

我们在原Circle类里面重写这个方法（已经重写了，如下）

``` java
private double radius;

@Override
public double getArea() {
    return radius * radius * Math.PI;
}
```

此时我们可以进行如下操作

``` java
public class Test {
    public static void main(String[] args) {
        GeometricObject circle = new Circle(2);
        System.out.println("Area is " + circle.getArea());
        //output: Area is 12.566370614359172
    }
}
```

GeometricObject类型的对象也能调用getArea()方法了，这个方法实际是在Circle类里面实现的（这个实现方法的类的调用是由JVM动态决定的，取决于actual type），这跟我之前看到的关于抽象的描述岂不是有神似之处，虽然这方法实际上是在子类的那一层实现的，但是父类只管知道有这个方法并且自己可以用它就行

就这个例子来说，在GeometricObject类中加这俩抽象方法有什么好处呢？

我认为相比于哲学的抽象定义，更实际的用途就是在**更加通用化的父类中使用子类中比较特殊化的方法**吧

这样定义了抽象类与方法，我们就可以直接比较两个不同子类对象的面积和周长了（而不用进行typecast）

**并且**由于抽象类中的抽象方法必须要有继承这个类的子类进行重写实现，因此抽象类的constructor不能直接被调用，从而无法直接创建一个actual type为抽象类的对象，其constructor在子类对象被创建的时候通过继承链进行调用

## 接口

接口是什么呢？接口是一个与类非常相似的结构，它可以指定通用行为给相关或不相关的类，你可以指定这个类是不是如 可以比较(Comparable) 可以克隆(Cloneable)等

接口继承的方式与类继承的方式也是差不多，只不过Java不允许一个子类继承多个子类，但是允许实现多个interface

要实现一个接口，只需要在类上加上 `implements interface1, interface2, ... interfaceN` 即可，此时这个类实现了这多个接口，并且同时也是这些个接口的对象

有什么例子吗？

我们用了非常多的一个`String`类，拥有一个方法`compareTo(String s)`，当我们想要表示两个字符串的时候，便可以调用这个方法

``` java
String s1 = "ABC";
String s2 = "ABCD";
System.out.println(s1.compareTo(s2)); //output: -1
```

经过API文档的查阅，我们可以得出这么点东西

在String页面下有如下的class header

``` java
public final class String extends Object implements Serializable, Comparable<String>, CharSequence
```

对于`interface Comparable<String>` 我们也能在API Doc下面找到如下的

``` java
Interface Comparable<T> {
    int compareTo(T o);
}
```

其中的T其实就是type parameter, T 代表着任意一个 type

也就是说，这个方法在接口中定义，在实现它的类中进行接口方法的实现，这点与抽象类非常相似

## 接口与抽象的区别

既然抽象类与接口如此相似，那差别是什么呢？

一个类包含了data field, constructor和method, 而接口与类也差不多，只是没了constructor，并且在另外两个上也有那么一丢丢差别

我拿**Java 8或以上**的来讲讲区别吧

|| data field | constructor | method |
|---------- | ---------- | ----------- | ------ |
| 抽象类 | 跟个正常类一样 | 有 但是只能由子类调用 | 跟个正常类一样 只是多了抽象方法 |
| 接口 | 必须都是final | 无 | 只能是抽象方法 **default**方法 **static**方法 |

并且，一个子类可以实现多个接口，而一个子类只能继承一个父类

也许你会问：好像除了一类实现多个接口的特性，接口好像一无是处诶？

其实我认为存在即合理吧，从某种情况来讲，接口比抽象类更加**普适通用**

写这篇文章的时候，咱还没有什么实际项目经验，是个云玩家，举个小实例吧

比如我们定义那么一个接口 `Edible`, 含有一个 `howToEat()` 抽象方法

那么，任意能吃的实体类都能实现它

而我们把 `howToEat()` 方法定义在一个抽象类`Animal`中，那么只有继承它的子类才能实现这个方法，那一些蔬菜也能吃啊，把一种植物强行继承在动物类中，这有点不合继承的一些规则（不遵守is-a关系，乱来）

而接口并没有这个情况出现，他很通用，只要能实现，都能在类中用 `implements` 来继承它

这里应该可以用 **is-a** 和 **is-kind-of** 关系来描述接口与子类，抽象父类与子类的关系

我们在继承的时候知道了is-a关系，可以 `Circle is a GeometricObject` 这样表示一个继承关系，这个父类子类关系比较明显

而接口的继承关系可以这样表达 `String is kind of Comparable` 或 `String is a Comparable Object`，而这接口和类的关系就没那么关系明显了，是比较弱的一个关系

那么就可以一句话解释上面的错误了 你想想 `Cabbage is an Animal` 这河里吗？

## 写在最后

所以，抽象和接口相似但又有区别，因此设计程序的时候，最好根据实际需求进行选择

---
title: 初识继承与多态
date: 2020-10-14 19:00:00
tags:
permalink: contents/49e5f4612660/
categories: Java
---

这篇文章主要写了咱对继承与多态的一点基本看法

<!-- more -->

## 写在前前面

其实领悟这种东西不必像玩茴香豆写法一样，实际上手多写一些OOP代码就是了
~~当然感兴趣的读者还是可以看下去的~~

## 版本记录

1. 2020-10-14 初学初写
2. 2020-10-19 回头发现些小问题，做几处修改
3. 2020-11-21 使部分文字变得简洁

## 写在前面

咱最近在学习新知识--继承和多态的时候，反复看了一下书，然后手敲来验证

最后吸收了知识并得到了结论

知识输入住得稳还是要靠输出用得好

其实本没有这篇文章的，只不过是我在思考的时候，发觉继承和多态有不可描述的关联

~~所以这篇文章便出来了~~

下文掺杂着我的一些看法

若有错误，还请大佬指出

## 继承

继承是面向对象编程的一个重要特性，可以使代码拥有更好的复用性

依旧是拿几何图形来举例

比如说三角形和圆形都是几何图形，它们有着如**颜色 创建日期 是否被填色**等特性，有着共同的变量和对应的getter和setter，对于这些图形的实例，我们也都可以调用**方法**来获取它们的**填充状态 颜色 创建日期**等

这时我们可以创建一个类**GeometricObject**拥有着对应的data field和method

``` java
GeometricObject
----
-color: String
-filled: boolean
-dateCreated: java.util.Date
----
+GeometricObject()
+GeometricObject(color: String, filled: boolean)
+getColor(): String
+isFilled(): boolean
+setFilled(filled: boolean): void
+getDataCreated(): java.util.Date
+toString(): String
```

而圆和三角形对象都有自己那特别的特性，比如圆拥有**半径**和变量的setter和getter，并且有自己特有的用于**计算周长 计算面积**方法

此时，类**Circle**便如下图所示

``` java
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

而圆也有的那部分如**颜色**相关等的data field和method呢？不用虚，我们可以使用如下语句创建一个继承了GeometricObject的Circle类

``` java
public class Circle extends GeometricObject
```

对于Circle也是如此

注：在Java中，**所有类都extend于Object类**

然后下面是**注意事项**

我们要注意的注意的是不同class的调用有且只有accessible method或者accessible data field

比如下面这个是不合法的 ~~好同学千万不要尝试哦~~

``` java
/**in class GeometricObject*/
private boolean filled;
/**in class Circle */
public Circle() {
  filled = true;
}
```

不过在继承的使用之中也要避免一些滥用错误(真这样用也是很暴力了)

有**不当继承**

比如继承中，很多东西都遵循**is-A relationship**，比如上述的Geometric和Circle可以说成 `A circle is geometric`

但这个规则并不是万能的，比如正方形和矩形，我们用 `A square is a rectangle` 这种说法便不合适，因为肉眼可知，长方形有长和宽，而正方形只需用边长就能解决了

也有**天 马 行 空**

不要为了复用方法和数据域而进行胡乱继承

如**Person**和**Tree**有着些许相同的特性，但是 `Tree is not a person` 不遵循 **is-A relationship**，于是不能把Tree继承Person

## super关键字

`super()` 关键字是用来调用父类的constructor或者method的

我们以上面举的例子来说，也就是下面这个

``` java
public class Circle extends GeometricObject
```

在创建Circle类对象的时候会同时调用Superclass的constructor以继承其方法和数据域

他们只能被 `super();` 或者 `super(parameters);` 语句调用且该语句需要放在第一行

没有被人为打上的时`super()`是被隐式(implicitly)调用的

所以下面两种都是等价的

``` java
public ClassName() {

}
//is equivalent to
public ClassName() {
  super();
}
```

一般来说，super()被显式调用的时候，往往是为了调用父类特定的constructor或者与子类**重名**的方法，因为不重名的方法可以直接method()调用

## 继承链

当有类似下面的类时候，一条继承链就被创建了

``` java
public class Circle extends GeometricObject
```

其中Circle是子类，GeometricObject是父类，也有GeometricObject是子类，Object是父类

如下所示 这就是一继承链

`Object <- GeometricObject <- Circle`

让我们创建一个对象

``` java
Circle circle = new Circle();
```

也就是说，由于类的constructor之间的相互调用，此时circle同时拥有了Circle类GeometricObject类和Object类的方法和数据域

因为子类extends父类，所以子类的实例都可以是父类的实例

听起来蛮拗口的对吧，我们可以用水果解释一下

比如水果有苹果和橙子，苹果又分为红苹果和青苹果

如果上述的都是类，那么它们其中一个继承关系应该如下

`Fruit <- Apple <- GreenApple`

所以~~根据生活经验~~可以看出GreenApple是Apple，Apple是Fruit，所以实例化为GreenApple类的实例呢，同时可以看作是Apple类的实例，也还可以看作是Fruit类对象的实例(就是说子类实例可以**被当做**是父类的实例看，不过这个GreenApple本质上也只是GreenApple，并没有应该是多个类的实例而出现额外的新实例)

## 变量的两个类型

新建对象时的语句可以总结如下

``` java
delaredType name = new actualType(parameters);
```

上面的变量name，有了两个东东，一个是Declared Type，还有一个是Actual Type

举栗子

``` java
GeometricObject circle = new Circle();
```

其继承关系

`Object <- GeometricObject <- Circle`

这个引用变量circle呢，有两个类型：**Declared Type**和**Actual Type**，中文应该是声明类型和实际类型吧

这个例子中变量circle的声明类型是**GeometricObject**类型，实际类型是**Circle**类型

circle只是一个引用着一个对象的引用变量，被这个变量所引用 的对象 最先实例化的类 就是这个变量的**Actual Type**，而所声明这个变量所选的类型，就是**Declared Type**

通俗一点就是这本来是个圆实例，只不过引用它的变量的声明类型是**GeometricObject**，并且这个圆实例不仅可以被声明类型为**GeometricObject**类的变量所引用，还可以被声明类型为某一父类类型的变量所引用，此时它就被当做是父类的实例看待了，我们便把它看成了一个几何实例（这 就 是 多 态）。但是，这个`new Circle()`（Circle即是这个变量的**Actual Type**）表明了这个对象**根本上**是由Circle类来实例化的

其实这里我脑内理解还行，只不过表达输出来变得有点诡怪，希望大佬们能提点建议？

？**我认为**，一个继承了父类的子类对象被new出来，必然包含了父类的方法和数据域，所以引用这个对象的变量可以自然而然的进行声明类型的的切换，从而可以把这个子类对象看作为其他父类的对象？

## Dynamic binding

另一方面来讲

Declared Type是给编译器看的决定了哪一个方法会在编译时被match，比如上述变量circle的actual type虽然是Circle，但Declared type是GeometricObject类型，所以在编译的时候自然match不到比Declared type更子的类型的方法，比如Circle里面的getDiameter()方法，便因此而无法被调用

而在运行的时候JVM会动态绑定method，这个所绑定的method，取决于Actual Type，若对象circle里面有个被Override的`toString()`方法，那么即使该对象被引用的变量的Declared Type是GeometricObject（甚至是Object的话），就算match到了声明类型的类里有这个method，由于**Dynamic binding**的缘故，它实际invoke的是最后一个子类所重写的`toString()`方法

> 上面这段话简短来说就是，编译的时候知道这个类型的对象应该会有什么方法，但是调用方法时候有Override的方法，就是调用的最末端Override的方法

## 多态和对象类型转换

多态意味着在父类对象的地盘，都可以使用子类对象

我们可以把一个子类对象的类型cast到父类的类型，~~通俗一点就是把儿子当爸爸用~~ 以便方便传参和通用化该对象

看一下下面的一个传参的例子

``` java
public class PolymorphismDemo {
  public static void main(String[] args) {
    displayObject(new Circle(1, "red", false));
    displayObject(new Rectangle(1, 1, "black", true));
  }

  public static void displayObject(GeometricObject object) {
    System.out.println("Created on " + object.getDateCreated() +
      ". Color is " + object.getColor());
  }
}
```

上面的代码中，通过cast为父类GeometricObject类型进行传参，方便了许多

那我们upcast后怎么把他们downcast下来啊，很简单，想一下基本数据类型的casting，有显性转换也有隐形转换，同理，对象的类型转换也有隐有显，只不过面向对象的转换过程，并没有出现新的对象

因为每一个子类的实例永远都是其父类的一个实例，所以upcast是隐性的

但是每一个父类的实例并不一定是某一个子类的实例啊，所以downcast是显性的

上面这两句话可以用生活例子来解释：就好比学科（父类）有语文和数学（子类），语文或数学类的实例一定可以是学科类的实例，而学科类的实例又不一定是语文类的实例，这个实例有可能是数学类的实例，也或许没有子类的实例存在呢？

我们如果只new了实际类型是学科类的实例，那转换到语文或数学实例，便会产生`ClassCastExcpetion`错误

所以需要我们人为添加`(Type)`来cast

前面提到过了，由于继承，一个子类实例可以是一或多个父类的实例，但一个父类实例却不一定是某一子类的实例，所以为了避免产生downcast的错误，我们可以用关键字`instanceof`来判断一个引用变量所引用的对象是不是目标类的一个实例

``` java
public class CastingDemo {
  public static void main(String[] args) {
    Object object1 = new Circle(1);
    Object object2 = new Rectangle(1, 1);

    displayObject(object1);
    displayObject(object2);
  }

  public static void displayObject(Object object) {
    if (object instanceof Circle) {
      System.out.println("The circle area is " + ((GeometricObject)object).getColor());
      System.out.println("The circle diameter is " + ((Circle)object).getDiameter());
    }
    else if  (object instanceof Rectangle) {
      System.out.println("The rectangle area is " + ((Rectangle)object).getArea());
    }
  }
}
```

上面这个例子就是利用了`instanceof`来对应地转换对象的类型，从而避免了错误的产生

## 这要单独给个标题

结合前后内容突然醒悟 ~~小声BB 我悟错了吗~~

其实到最后，对于多态和上下转型的实现，我发现应该是这样的吧，不管是声明类型的怎么变化，还是typecast的那各种上上下下的操作，**实际上操作的是引用变量，而不是已经被实例化的对象本身**

结合上面那奇奇怪怪的大段文字和下面这句话理解

一个继承了父类的子类对象在被new出来，必然包含了父类的方法和数据域

~~所以，只不过是因为引用变量的变化，才导致引用变量所指向的对象出现不那么一样的样子而已（此表达有点奇怪~~

## 总结一刻

在Java中，由多态概念的引出可以看出它与继承是有相当多的联系的，只因有了继承的关系，才会出现后面的多态，两者缺一不可

而最后，多态中，出现的“子类的实例都可以是父类的实例”这句话，其实要理清楚，结合前面的知识，我们知道一个对象只能被实例化一次，多态中，这个创建了的对象只不过是随着指向着它的引用变量的类型变化而相对地变化成特定类的实例罢了

所以，掳清概念很重要

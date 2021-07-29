---
title: Java使用者眼中的C++面向对象
comments: true
date: 2021-04-07 15:00:00
tags:
permalink: contents/a4fbad73ad9c/
categories: 笔记
---

~~要不是大一下学校的OOP课要讲MFC...~~

update: 感谢学校push我学习C++，现在读底层代码舒服好多好多（

最后更新于2020/04/07

<!-- more -->

**最后更新**于:2020/04/07，最新的就在这里看吧: [个人笔记](https://note.situ2001.com/cpp/OOP.html)

---

基于java中的OOP来学习C++的OOP（可 迁 移 学 习）（爆炸预定

感觉C++中的OOP多了好多东西啊（太菜了）

## Operators

按优先级来说的。

scope qualifier: `::`，很直白，翻译过来就叫做作用域限定符

member access: `.`和`->`常见，前者是非指针变量用过的，后者是指针变量用的

class上的`:`，如同java里的`extends`

## Member function

这个其实怎么说呢，我就把它跟java里头的instance method混为一谈了。所以这样理解就没问题了。

## Instantiation

无参数的话，**不用带parentheses**

``` cpp
Test test1;

Test* test2 = new Test;
```

前者开在stack上，后者开在heap上。（java直接扔heap上不香吗

## Virtual function

函数就有非虚函数，虚函数和纯虚函数这三种了，太草了。由于java的对象方法默认就是`virtual`的（JVM调用指令`invokevirtual`），然后java可以多态，要invoke的方法都是在runtime进行动态绑定的。所以C++里头的函数虚不虚，就很好理解了。

比如java里头定义一个父类抽象方法的话，子类来实现。

``` java
//father
public abstract void test();
//son
@Override
public void test() {
  /** do sth */
}
```

C++就要用到纯虚函数了

``` cpp
//father
virtual void test() = 0;
//son
virtual void test()
{
  /** do sth */
}
```

如果父类的虚函数想有自己的实现的话，把`= 0`去掉，加自己的实现即可（此时仍然有多态）。但此时的父类就不是抽象类了，可以被实例化。

``` cpp
class Animal
{
    public:
    virtual void eat()
    {
        std::cout << "I am eating food." << std::endl;
    }
};

class Chicken : public Animal
{
    public:
    virtual void eat()
    {
        std::cout << "I am eating hay" << std::endl;
    }
};
```

## Override

该关键字(C++11)可以防止写虚函数重载的时候，不小心写错的大无语事件发生。

``` cpp
virtual void eat() override;
```

## Modifier

似乎因为没有jvav的package，所以这么几个modifier**都没有了package access的restriction**（因为根本没有package啊）。所以就很方便了。

`public`类的外部都能访问。

`protected`**自己和派生类**能访问。(！大不同！)

`private`直接是私有，类里的能访问。

## Static keyword

这个也没啥大区别的，唯一的小区别就是访问static的方法或变量需要使用operator `::`

还有，根据C++17前（艹）的标准。define的时候必须要在类外面进行(除非为const的时候才能在类内做定义)

``` cpp
//class Test
public:
  static int i;

// outside the class
static int Test::i = 114514;

//main
Test::i // 114514
```

为什么要这样做呢？估计要等到了解csapp之后了（

## Friend keyword

> The friend declaration appears in a class body and grants a function or another class access to private and protected members of the class where the friend declaration appears.

``` cpp
class Test
{
public:
  friend void getNum(Test test)
  {
    std::cout << test.num << std::endl;
  }
private:
  int num = 114514;
};

// or
friend void getNum(Test test);

// outside of the class
void getNum(Test test)
{
  // implements here
}
```

``` cpp
Test test;
getNum(test); // 114514
```

当然也可以在里头声明一个友元类，此时友元类里的成员函数都能访问到这个类的private field

前提是有一个该类的对象，才能进行访问

``` cpp
//In class Test
friend class Friend;

//Friend
class Friend
{
  /** ... */
  /** have the access to private field of Test */
}
```

## Inheritance

``` cpp
class Chicken : public Animal
```

继承的话，要注意，C++继承的class默认是private的，（前期naive认知）所以（不一定）要加个`public`，~~否则外部无法使用父类的方法。~~（~~原来还能用scope qualifier艹~~）

经查询继承类型有如下，比如上面的`public Animal`就是公有继承了

1. 公有继承
2. 保护继承
3. 私有继承

原理是将所继承的父类member的accessibility给降级...`public`->`protected`->`private`

比如在保护继承和私有的继承的情况下，如果想改变某一个member的accessibility（比如原来是public或protected的，但是继承后降级），可以使用scope qualifier...(差不多得了)

``` cpp
class Animal
{
    int i = 1141514;
public:
    Animal() = default;
    void foo() {}
};

class Chicken : Animal
{
public:
    Animal::foo;
};

int main()
{
    Chicken foo;
    foo.foo();
}
```

## Multiple inheritance

主要是用来当Interface用吧（C++的OOP没有Interface...

``` cpp
class Foo : public BaseFoo, public BaseBar
```

如果有命名冲突就用scope qualifier吧...

然后还有歧义的问题，就是这样的

``` cpp
#include <iostream>

class Base
{
public:
  Base() { std::cout << "Base was constructed" << '\n'; }
  void test()
  {
    std::cout << "tested" << '\n';
  }
};

class Bar : public Base
{
public:
  Bar() { std::cout << "Bar was constructed" << '\n'; }
};

class Bar1 : public Base
{
public:
  Bar1() { std::cout << "Bar1 was constructed" << '\n'; }
};

class Foo : public Bar, public Bar1
{
public:
  Foo() { std::cout << "Foo was constructed" << '\n'; }
};

int main()
{
  Foo foo;
}
```

输出

``` shell
Base was constructed
Bar was constructed
Base was constructed
Bar1 was constructed
Foo was constructed
```

如果main里加`foo.test()`会报错`ambiguous access of 'test'`，因为每个Bar类都分别有自己的一个父类对象。如下所示

``` shell
Base   Base
 |      |
Bar    Bar1
   \  /
    Foo
```

为避免这个问题，我们使用虚继承（virtual inheritance）...

把两个Bar类的继承里的modifier加上关键字`virtual`，就会得到如下，两者继承到了同一个父类对象上。

``` shell
Base was constructed
Bar was constructed
Bar1 was constructed
Foo was constructed
```

此时的继承关系为

``` shell
   Base
  /   \
Bar    Bar1
  \   /
   Foo
```

## Constructors and member initializer lists

``` cpp
public:
  Chicken() : Animal(arg)
  {
    /** do sth */
  }
```

相似地，我们也可以用来给field初始化

``` cpp
private:
  std::string text = nullptr;
public:
  Foo() : text("114514")
  {
    /** do sth */
  }
```

## Constructor and Destructor

常见，语法也是差不多，但是后者析构这个就没见过了（GC擦屁股太香了

类的析构和构造，都是默认缺省的（无参数），这点都一样，当然也可以自己写实现

``` cpp
//class Test
~Test()
{
  std::cout << "instance deleted";
}
```

出栈或者`delete`的时候会被隐式调用

方法命名就这，直接是constructor前加 `~`

## Copy Constructor

然后就是这个了，同上，这个东西也是默认缺省的，像这样，传的必须要是一个引用类型（不传引用？你可以想想套娃调用...）。

``` cpp
Test::Test(const Point&)
```

其中这个类型，可以cv-qualified，其中`const`主要是用来应对`rvalue`的（`const T&`和`T&&`都能被赋值一个临时对象），如果copy constructor的参数类型不加`const`那么这个就会报错

``` cpp
// in a function body
return obj;
```

本来java中的引用变量赋值就是把reference给你而已。但是C++直接给你弄了个了新对象。

``` cpp
//main
Test test;
Test test1 = test; //invoke Copy Constructor
```

调用默认拷贝构造函数的时候，一切栈上的变量都被拷过去了(这不就是跟struct一模一样吗)。但是当然要自己实现的时候，就不是这样了（要自己一个一个加实现）

``` cpp
Test test;
Test test1;
test1 = test; // This is operator overloading, NOT invoking copy constructor
```

此外，函数返回一个对象，传参(一个对象)进去函数的时候，也会调用copy constructor

## Move Constructor

C++11开始加入了rvalue reference，这是什么呢，一查cpprefernce就能看到短小精悍的解释

> Rvalue references can be used to extend the lifetimes of temporary objects

两个字来说就是~~续命~~

还有std::move，类的构造器也有了移动构造函数

``` cpp
//class Foo
public:
  Foo(Foo&& bar); 
```

初始化并赋值一个新对象的时候，可以使用Move constructor

``` cpp
Foo foo1;
Foo foo2 = std::move(foo1);
```

## Pointer

- this

`this`跟java一样，C++只有成员函数才有的。记得member access要用operator `->`

- Pointer to an object

这个java的引用变量是差不多的。声明也就这样

``` cpp
ClassType* pointer;
```

用法也就那样，如

``` cpp
Test test1;
Test* pointer = &test1;

Test* test2 = new Test;
```

## Function definition

来自cpluscplus.com

> The only difference between defining a class member function completely within its class or to include only the prototype and later its definition, is that in the first case the function will automatically be considered an inline member function by the compiler, while in the second it will be a normal (not-inline) class member function, which in fact supposes no difference in behavior

## Default and delete

如果有带参的constructor，那么可以用`=default`来写默认constructor如`Test(){}`。

如果要禁用某个函数，可以上`=delete`

``` cpp
Test() = default;
Test(const X&) = delete;
Test& operator=(const X&) = delete;

//main
Test test;
Test test1 = test; //wrong!
Test test2;
test2 = test3; //wrong!
```

## Operator overloading

直接扔cppreference算了: [直达](https://en.cppreference.com/w/cpp/language/operators)

注意，一个重载运算符的函数，其operand必须有一个是枚举类型或者类类型。

> When an operator appears in an expression, and at least one of its operands has a class type or an enumeration type

其实返回值赋给谁的这个问题，我想了想，估计可以直接与基本类型的运算挂钩。结合一下操作符运算的本质特点就可以了！

对应到方法呢？比如`+`是这样的，成员函数`a.operator+(b)`，非成员函数`operator+(a, b)`

但是一些运算符是不能被重载为非成员函数的: `=`, `()`, `[]`, `->`

有些运算符需要记录一下，代码扔到snippet里了

## Const keyword

一般来说呢，`const`是作用于它左边的（如果左边啥都没有的话就是作用于右边）。而这个关键字`const`能作用于变量、**成员**函数、类对象...

**关键**是有`const`修饰的，就不能修改里面成员的内存空间。

如果有`Foo const foo;`，那么这个对象变量（或指针）就不能访问非const方法，也不能修改成员了。如果有一个const方法，那么在这个方法体内，不能访问非const方法，也不能修改成员变量。（实质在后面说了）

而我查了cppreference，里面这样说

> const object - an object whose type is const-qualified, or a non-mutable subobject of a const object. Such object cannot be modified: attempt to do so directly is a compile-time error, and attempt to do so indirectly (e.g., by modifying the const object through a reference or pointer to non-const type) results in undefined behavior.

并且const了的函数实质又是？是这样的，其实就是把这个函数里头的`*this`给const掉了。

> In the body of a cv-qualified function, *this is cv-qualified, e.g. in a const member function, only other const member functions may be called normally. (A non-const member function may still be called if const_cast is applied or through an access path that does not involve this.)

## Type casting

[面向SO编程](https://stackoverflow.com/questions/332030/when-should-static-cast-dynamic-cast-const-cast-and-reinterpret-cast-be-used)

在OOP里头一般用到的casting关键字，一般有`static_cast`, `dynamic_cast`, `const_cast`和`reinterpret_cast`和C风格cast）

- `static_cast`是安全地，隐式地在类型之间进行转换(比如void, int, double, float)
- `dynamic_cast`是在有继承关系的类之间的up cast, down cast and side cast（虽然上者也可以
- `const_cast`可以加减`const`约束
- `reinterpret_cast`暴力casting，不管啥的

一个例子

``` cpp
#include <iostream>

struct Base
{
  int a = 114514;
};

struct D : public Base
{
  int a = 1919810;
};

int main()
{
  D* d = new D;
  std::cout << d->a << '\n'; // 1919810
  Base* b = dynamic_cast<Base*>(d); // upcast
  std::cout << b->a; // 114514
}
```

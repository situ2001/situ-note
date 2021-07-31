---
title: 浅谈Java的装箱与拆箱
comments: true
date: 2021-01-22 16:48:49
tags:
permalink: contents/152c3b965d2f/
categories: Java
---

基操，见得多了，只不过之前没往里头摸。行文诡异，可能错漏百出，也许为午后昏睡过久所致。

<!-- more -->

众所周知，在Java中，有primitive type和wrapper class。它们之间可以相互转化。比如下面的代码是合法的。

``` java
Integer integer = 114;
int i = integer;
```

Java的官方也有如下的说明

>Autoboxing is the automatic conversion that the Java **compiler** makes between the primitive types and their corresponding object wrapper classes. For example, converting an int to an Integer, a double to a Double, and so on. If the conversion goes the other way, this is called unboxing.

这里可以看到一个关键的部分`the Java compiler makes`，也就是说这个拆箱与装箱的过程，是编译器帮忙做的。

回想一下之前学校教C++的时候讲到了引用，老师只把它比喻为“分身”，并叫我们记住。而这个似乎可以通过反汇编看出来，如下，编译器为MSVC。

```
    int i = 114514;
00D91842  mov         dword ptr [i],1BF52h  
    int& j = i;
00D91849  lea         eax,[i]  //将i的地址放入寄存器eax中
00D9184C  mov         dword ptr [j],eax   //将此时寄存器eax的内容移到j的值中
    j = 1919;
00D9184F  mov         eax,dword ptr [j]  //将j的值送入eax中
00D91852  mov         dword ptr [eax],77Fh  //将1919移入i中
    int *const pi = &i;
00D91858  lea         eax,[i]  
00D9185B  mov         dword ptr [pi],eax  
    *pi = 810;
00D9185E  mov         eax,dword ptr [pi]  
00D91861  mov         dword ptr [eax],32Ah 
```

可以看出引用其实相当于是语法糖，底层实现其实是一个指针常量？（C++没去学太多，有错请指出）

那么Java的这个自动装拆箱机制，是否也可以通过反汇编来得到答案呢？答案是能的，经过一番查找我找到了javap这个工具，是用来对Class文件进行反汇编的。

它的基本用法就是这样咯，参数带个`-c`就可以对class文件进行反编译了

``` shell
Usage: javap <options> <classes>
```

那么现在就可以对开头的文件操作了，反汇编之后得到如下结果

``` java
Compiled from "Test.java"
public class test.Test {
  public test.Test();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: bipush        114
       2: invokestatic  #2                  // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
       5: astore_1
       6: aload_1
       7: invokevirtual #3                  // Method java/lang/Integer.intValue:()I
      10: istore_2
      11: return
}
```

从输出的注释中可以明显看出，在初始化Integer变量的时候，调用了`valueOf()`方法，而在将integer赋值给i的时候，又调用了`intValue()`方法。

嗯，这就是所谓的拆箱装箱了，~~显然，这是一个平淡无味的语法糖~~

那么问题又来了，为什么是用了`valueOf()`方法而不是直接`new Integer(114)`呢？初学的时候我以为不了解，感觉java这做法是在脱裤子放屁。但直到我看了`Integer.java`的源码...

先是constructor，甚至已经是不建议使用，而是建议使用`valueOf()`。

``` java
/**
* Constructs a newly allocated {@code Integer} object that
* represents the specified {@code int} value.
*
* @param   value   the value to be represented by the
*                  {@code Integer} object.
*
* @deprecated
* It is rarely appropriate to use this constructor. The static factory
* {@link #valueOf(int)} is generally a better choice, as it is
* likely to yield significantly better space and time performance.
*/
@Deprecated(since="9")
public Integer(int value) {
this.value = value;
}
```

那我继续定位到方法`valueOf()`下，发现了这么些东西

``` java
/**
 * Returns an {@code Integer} instance representing the specified
 * {@code int} value.  If a new {@code Integer} instance is not
 * required, this method should generally be used in preference to
 * the constructor {@link #Integer(int)}, as this method is likely
 * to yield significantly better space and time performance by
 * caching frequently requested values.
 *
 * This method will always cache values in the range -128 to 127,
 * inclusive, and may cache other values outside of this range.
 *
 * @param  i an {@code int} value.
 * @return an {@code Integer} instance representing {@code i}.
 * @since  1.5
 */
@HotSpotIntrinsicCandidate
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high)
        return IntegerCache.cache[i + (-IntegerCache.low)];
    return new Integer(i);
}
```

可以看到有一个inner class `IntegerCache`，再次定位。

``` java
/**
 * Cache to support the object identity semantics of autoboxing for values between
 * -128 and 127 (inclusive) as required by JLS.
 *
 * The cache is initialized on first usage.  The size of the cache
 * may be controlled by the {@code -XX:AutoBoxCacheMax=<size>} option.
 * During VM initialization, java.lang.Integer.IntegerCache.high property
 * may be set and saved in the private system properties in the
 * jdk.internal.misc.VM class.
 */

private static class IntegerCache {
    static final int low = -128;
    static final int high;
    static final Integer[] cache;
    static Integer[] archivedCache;

    static {
        // high value may be configured by property
        int h = 127;
        String integerCacheHighPropValue =
            VM.getSavedProperty("java.lang.Integer.IntegerCache.high");
        if (integerCacheHighPropValue != null) {
            try {
                int i = parseInt(integerCacheHighPropValue);
                i = Math.max(i, 127);
                // Maximum array size is Integer.MAX_VALUE
                h = Math.min(i, Integer.MAX_VALUE - (-low) -1);
            } catch( NumberFormatException nfe) {
                // If the property cannot be parsed into an int, ignore it.
            }
        }
        high = h;

        // Load IntegerCache.archivedCache from archive, if possible
        VM.initializeFromArchive(IntegerCache.class);
        int size = (high - low) + 1;

        // Use the archived cache if it exists and is large enough
        if (archivedCache == null || size > archivedCache.length) {
            Integer[] c = new Integer[size];
            int j = low;
            for(int k = 0; k < c.length; k++)
                c[k] = new Integer(j++);
            archivedCache = c;
        }
        cache = archivedCache;
        // range [-128, 127] must be interned (JLS7 5.1.7)
        assert IntegerCache.high >= 127;
    }

    private IntegerCache() {}
}
```

啊这，为了获得更好的性能，在初始化的时候，VM就直接把[-128, 127]的整数初始化一遍放入`cache`数组里啊。怪不得不用constructor新建Integer对象而是用`valueOf()`啊...

那么对于之前的一些奇奇怪怪的问题如

``` java
Integer a = 114;
Integer b = 114;
Integer c = 514;
Integer d = 514;

// a == b is true
// c == d is false
```

这类的，就很好解释了。因为有-127~128的整数有缓存，所以a和b引用的，都是同一个对象。而c和d调用`valueOf()`的时候，都是new出一个新对象。

既然Integer是这个样子，那么Boolean会不会更是这个样子，因为bool类型也就一个true和false。验证发现果然如此

``` java
/**
 * The {@code Boolean} object corresponding to the primitive
 * value {@code true}.
 */
public static final Boolean TRUE = new Boolean(true);

/**
 * The {@code Boolean} object corresponding to the primitive
 * value {@code false}.
 */
public static final Boolean FALSE = new Boolean(false);
/**
 * Returns a {@code Boolean} instance representing the specified
 * {@code boolean} value.  If the specified {@code boolean} value
 * is {@code true}, this method returns {@code Boolean.TRUE};
 * if it is {@code false}, this method returns {@code Boolean.FALSE}.
 * If a new {@code Boolean} instance is not required, this method
 * should generally be used in preference to the constructor
 * {@link #Boolean(boolean)}, as this method is likely to yield
 * significantly better space and time performance.
 *
 * @param  b a boolean value.
 * @return a {@code Boolean} instance representing {@code b}.
 * @since  1.4
 */
@HotSpotIntrinsicCandidate
public static Boolean valueOf(boolean b) {
    return (b ? TRUE : FALSE);
}
```

`Character`类也是这样

``` java
/**
 * Returns a {@code Character} instance representing the specified
 * {@code char} value.
 * If a new {@code Character} instance is not required, this method
 * should generally be used in preference to the constructor
 * {@link #Character(char)}, as this method is likely to yield
 * significantly better space and time performance by caching
 * frequently requested values.
 *
 * This method will always cache values in the range {@code
 * '\u005Cu0000'} to {@code '\u005Cu007F'}, inclusive, and may
 * cache other values outside of this range.
 *
 * @param  c a char value.
 * @return a {@code Character} instance representing {@code c}.
 * @since  1.5
 */
@HotSpotIntrinsicCandidate
public static Character valueOf(char c) {
    if (c <= 127) { // must cache
        return CharacterCache.cache[(int)c];
    }
    return new Character(c);
}
/**
 * Constructs a newly allocated {@code Character} object that
 * represents the specified {@code char} value.
 *
 * @param  value   the value to be represented by the
 *                  {@code Character} object.
 *
 * @deprecated
 * It is rarely appropriate to use this constructor. The static factory
 * {@link #valueOf(char)} is generally a better choice, as it is
 * likely to yield significantly better space and time performance.
 */
@Deprecated(since="9")
public Character(char value) {
    this.value = value;
}

private static class CharacterCache {
    private CharacterCache(){}

    static final Character cache[] = new Character[127 + 1];

    static {
        for (int i = 0; i < cache.length; i++)
            cache[i] = new Character((char)i);
    }
}
```

最后，虽然这篇文章是我军训结束后昏睡一下午起床才写的，涉及到的内容也是相当基础和简单。

但是有时候，你不去摸摸源码的实现，你也比较难理解原理。（比如`String`里的`compareTo()`

但是他给我启示：学习嘛，学有余力的话，**有的时候**往往可以往深钻一下子的。还有就是要学会一些工具的使用之类的啦，要学会实际问题实际分析

(~~上面一行完全是我自己憋的尴尬套话~~)
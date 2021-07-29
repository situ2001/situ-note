---
title: git快速上手
date: 2020-11-18 20:54:40
tags:
permalink: contents/bd5b790794cf/
categories: 教程
---

我想这篇文章应该可以让你快速上手git和github吧？

<!-- more -->

## 写在前面

什么时候会用到git呢？就我而言，我目前有两处地方有用到git

1. 跟踪管理自己代码的时候
2. 与其他人合作为同一个项目做贡献的时候
3. 对其他开源项目做贡献~~（太菜了没做过）~~

我认为快速入门git的好方法是了解基础步骤后直接开始操作~~，于是就有了这篇文章~~

这篇文章的许多内容都是自己试过的，希望下面的内容能给新手们带来一点帮助，如有错误，请指出。

## 上手之前

### 准备工具

首先准备好所需的工具：**git**和**github账号一个**（当然其他代码托管平台也是可以的），若没有的话，git在这里[下载](https://git-scm.com/)，github账号的在[这里注册](https://github.com/)

然后，在命令行中做好配置文件相应的设置
`git config --global user.name "your-name"`
`git config --global user.email "your-email"`

再者就是本地与github之间通讯要用到的ssh密钥。之前应该写过，我直接拷贝过来吧。

### 配置密钥

先生成SSH key，下列command生成了公/私对
`$ ssh-keygen -t rsa -b 4096 -C "your_email@example.com"`

再将其public key复制进剪贴板
`$ clip < ~/.ssh/id_rsa.pub`

之后到[https://github.com/settings/keys](https://github.com/settings/keys)里，点击New SSH key，然后把它粘贴到文本框里

接下来就是测试连接

在命令行下输入 `ssh -T git@github.com` 以测试SSH是否配置好

预期结果应如下
``` powershell
PS C:\Users\situ> ssh -T git@github.com
Hi situ2001! You've successfully authenticated, but GitHub does not provide shell access.
```

此时，密钥配置完成。

然后下面是操作的过程，虽然不知道发生了什么，但是先照着做就是了。

## 跟踪自己的代码

这块内容大致分为两步

1. 新建一个仓库
2. 往仓库提交你的代码

### 新建一个仓库

这个新建一次就行了。这个新建一次就行了。这个新建一次就行了。

仓库分为本地的仓库（即本机）和远程仓库（在这里指github的仓库）

建立本地仓库的话，就是在你代码的目录下，输入下面的命令

``` shell
git init
```

成功初始化后的输出可能如下

``` shell
Initialized empty Git repository in C:/Users/situ/github/git_test/.git/
```

接着去github新建对应的仓库，在github首页的右上角就能看到新建仓库的图标了，跟着指引一步一步做下去就行了

至此，仓库的新建工作完成了

### 往仓库提交你的代码

接着就是进行状态的检查，这个命令**很有用**，它可以告诉你现在仓库的状态是什么样子的

``` shell
git status
```

输出可能如下

``` shell
C:\Users\situ\github\git_test>git status
On branch master

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        1.txt
        Main.java

nothing added to commit but untracked files present (use "git add" to track)
```

接着，把untracked的文件加入git中

``` shell
git add .
```

这个命令表示把所有更改过的或者未追踪的文件加入跟踪

接着就是记录自己此时仓库的情况，使用如下命令

``` shell
git commit -m "my first commit"
```

输出结果如下

``` shell
[master (root-commit) cc978b4] my first commit
 2 files changed, 15 insertions(+)
 create mode 100644 1.txt
 create mode 100644 Main.java
```

再用`git status`看看

``` shell
On branch master
nothing to commit, working tree clean
```

说明，此时仓库已经记录下你现在的工作了。

接着我们使用命令`git remote`进行远端仓库的添加(如下仅为实例，具体情况具体分析)

``` shell
git remote add origin https://github.com/situ2001/git_test.git
```

最后，我们使用`git push`命令，把此时本地的master分支推到远端仓库上的master分支

``` shell
git push -u origin master
```

出现像下面这样的，是成功了

``` shell
C:\Users\situ\github\git_test>git push -u origin master
Enumerating objects: 4, done.
Counting objects: 100% (4/4), done.
Delta compression using up to 16 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (4/4), 406 bytes | 406.00 KiB/s, done.
Total 4 (delta 0), reused 0 (delta 0), pack-reused 0
To https://github.com/situ2001/git_test.git
 * [new branch]      master -> master
Branch 'master' set up to track remote branch 'master' from 'origin'.
```

接着，你在github的repo上面就能见到这次的commit了。

那么**在其他地方**操作，怎么把仓库拉下来啊。很EZ，用`git clone`命令就行了，如下

``` shell
git clone [repo-url]
```

还有不要忘了在其他地方做了更改，回到自己的环境下，要进行一下`git pull`同步一下远端仓库的内容哦

## 与他人进行合作

有时候我们会与他人合作，共同contribute同一个repo，因此，一些git分支与合并的操作还是要懂得一点的

我目前了解到的合作还是**比较肤浅**，自己了解过的只有两种

1. 受他人邀请后，直接获得对仓库进行更改的权限
2. fork一份他人的repo，对其修改后，在github上发起PR（Pull Request）

### 直接修改所有者的repo

这两种原理是差不多的，我挑较为用过次数比2多的1来说吧(事实上这**有点头铁**，推荐用2)

如果repo的所有者对你发出了collaborate的邀请，接受了，你对应用户的邮箱就能直接在这个repo下进行更改了

此时先使用命令`git clone`把对应的仓库clone下来

``` shell
git clone [repo-url]
```

由于是多人合作，就要避免一些更改的冲突，此处比较保险的方法是利用git的分支操作，大概操作如下：

1. 创建分支并切换到对应的分支
2. 进行相对应的更改并做好commit
3. 在主分支下进行整合工作
4. 将当前的分支push到远端分支

**开始操作**~~（由于最近在肝某deadline，所以一些输出就不搞了，理论上这流程下来是没有问题的）~~

首先，创建一个分支并切换到对应分支

``` shell
git checkout -b [branch-name]
```

下面这两行与上面的是等效的

``` shell
git branch [branch-name]
git checkout [branch-name]
```

接着，开始你的工作，进行相对应的更改并做好相对应的commit，还是像上面一样

``` shell
git add .
git commit -m "some changes"
```

再接着，把做好的修改，确定无误后，使用`git merge`指令将该分支合并到主分支上......等等，此时我们冷静一下，我在进行多人合作诶，思考下：万一人家在我合并之前已经进行了一次合并或者是主分支出现了一些更新的commit呢？

所以，我们在合并之前最好是使用`git pull`命令，同步一下最新的远端仓库，所以要执行的操作如下，先同步后合并

``` shell
git checkout master
git pull
git merge [branch-name]
```

git会进行自动处理，除非是git无法处理的冲突才需要人为干涉（这里暂不多说）

接下来就是，把当前本地的分支推到远端了，依旧是`git push`

``` shell
git push -u origin master
```

要是想要把新分支也同步上去，如下

``` shell
git checkout [branch-name]
git push -u origin [branch-name]
```

### 使用Pull Request

如果是用PR的方法的话，应该会安全一点（云玩家又来了

我认为先是fork一份到自己的号里，然后前面1 2步骤与上面一样，而3 4 5分别是

3. 将主分支的最新更改整合到你的分支里
4. push你的分支到远端
5. 在你的repo下根据提示进行PR

自第三步有点差别，考虑到是合作，他人有可能进行了一定的修改，先`git pull`

``` shell
git checkout master
git pull
git checkout [branch-name]
git merge master
```

再合并，不过此次是把master合并到你的分支里

第四步就是将你的分支推到远端啦

``` shell
git push -u origin [branch-name]
```

第五步就是打开你的github对应的repo，它会自动提示你进行PR操作的

甚至还能做下事后清理工作，可以把本地和远程对应的分支所删除(当然远程分支也可以在github的对应的repo下进行删除分支的操作)

``` shell
git branch -d [branch-name]
git push -d origin [branch-name]
```

## 还有更多

我只是简单地写了两种常见的git使用场景的普遍情况，这俩操作可以应付得来大部分场景了

不过就这么点，还远远不够，再安利些东西吧，git指令想了解原理和更多操作，可以参考下面这个，初学的时候受益甚多（不过内容还是比较多的，初次上手可以像我这篇文章一样直接开个仓库进行操作

[Git Tutorials and Training | Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials)

**强烈建议**了解一下里面画的图片，配合图片来解释git的一些行为，会比空洞的文字好很多的

刚刚全都是在命令行下处理的，如果需要一个相关的GUI工具，可以尝试下面的

- [Sourcetree](https://www.sourcetreeapp.com/)

- vscode

还有一个方法，学习这东西，可以到github上面浏览一下出名的repo的一些东西，比如说，它们的commit commet的写法风格是怎么样的，它们的分支是怎么样的......

以上就是我这菜狗能提供的东西了，如有错误，还请指出~~（菜是原罪）~~
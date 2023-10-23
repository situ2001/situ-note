---
title: 从git仓库中移除无用的大文件
comments: true
date: 2022-04-04 13:45:00
categories: git
description: commit一时爽，事后火葬场
---

## 问题

在合并了某个学弟提交的 PR 之后，我发现仓库的体积，变大了非常非常多。。。

```bash
situ@ubuntu:~/Desktop$ git clone https://github.com/situ2001/gzhu_no_clock_in
Cloning into 'gzhu_no_clock_in'...
remote: Enumerating objects: 386, done.
remote: Counting objects: 100% (386/386), done.
remote: Compressing objects: 100% (240/240), done.
remote: Total 386 (delta 210), reused 251 (delta 106), pack-reused 0
Receiving objects: 100% (386/386), 37.43 MiB | 5.52 MiB/s, done.
Resolving deltas: 100% (210/210), done.
```

这给我的第一直觉是，学弟一定往仓库上面 commit 了什么硕大的二进制文件。

## 分析

我们先使用命令

```bash
git ls-tree -r -t -l --full-name HEAD | sort -n -r -k 4
```

看看当前的工作目录

```bash
100644 blob 19897b567bbdeb4c0745841a79a7f77e893679f5   34034    des.py
100644 blob 0c6b6aa7103b83fcdc1fa00aae2567a00ff89db4    4022    run.py
100644 blob 64f1d0e7348039d96ce6a2bb2217082935be896e    2526    clock_in.py
100644 blob 78f639c33a4bd3661edcfdcfc5ae5252d27ebe28    2265    README.md
100644 blob daa3a8db23f26e9c4f61f505a8254b31f128508c    1065    LICENSE
100644 blob 7456319f2fcbbadcc4ea7197407f468bc7ed82ae    1042    login_new.py
100644 blob 334119ed9a7436aa4bb382892c13dddf7564c183    1020    msession.py
100644 blob fb60aa156642321388f9c890191d59d354ffc68b      73    requirements.txt
100644 blob d206d128b235e5bbbe52cfbbda3f1cb46b60cb72      47    .gitignore
100644 blob e69de29bb2d1d6434b8b29ae775ad8c2e48c5391       0    stu_id.txt
```

并没有没有什么大文件。猜测是学弟把这个文件给删除了，然后把删除了这个文件的修改给 commit 了。

使用如下命令

```bash
git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | sed -n 's/^blob //p' | sort -n -r -k 2 | head -n 10
```

可得到该 git 仓库下，最大的 10 个 blob 与其文件名如下

```bash
4df0f91922c9ca62aaf7a9d2181124308945ec48 14544478 run-amd64-linux.tar.gz
9f6913f74af3732fbdc314fc4c3f4c7728aeb7d0 14233021 run-x86-windows.tar..gz
8f335bec6eaab6c835a558be9d98d9ac9920b1fe 10106361 run-aarch64-linux.tar.gz
f2943c6d4688b1363d82ba4e7b9d6894b7c50e6d 108973 img/set_secrets.png
ed6a321c340f71711df17c7a068f685740bc24c1 103346 img/run_workflow.png
51b1ab52c0369ebea0cb3bfbb19a6929352bc559 97027 img/enable_or_disable_action.png
19897b567bbdeb4c0745841a79a7f77e893679f5 34034 des.py
03c997793074c33cfffbb0d99816bc010b4134c0 28898 login_new.py
16b6c7a7d7bccfbfede77e4c5b9811d4b68a9962 28876 login_new.py
df1fbe8e2bc860b181e1cebd96142c3e5726a212 28868 login_new.py
```

好家伙，是几个压缩包，但是这几个 blob，在当前的 working directory 下都没有出现。那我们得看看这个 blob object 到底是给哪些个 commit 给引用的

使用命令

```bash
git log --follow -- run-amd64-linux.tar.gz
```

得到结果

```bash
commit 01adb1f123b6da67b09153a85e9583233a3aa4d2
Author: when-hao <72253870+when-hao@users.noreply.github.com>
Date:   Sat Mar 26 17:51:41 2022 +0800

    Delete run-amd64-linux.tar.gz

commit ab71f443fbd348f2d5e21f35f610bdbc57b81e75
Author: when-hao <72253870+when-hao@users.noreply.github.com>
Date:   Sat Mar 26 17:48:02 2022 +0800

    Add files via upload

    2022-03-26编译
```

再结合 commit message 看看。

```bash
commit fce40b2077bea4d67589596422dad647a6d2b159
Author: when-hao <72253870+when-hao@users.noreply.github.com>
Date:   Sat Mar 26 17:51:51 2022 +0800

    Delete run-x86-windows.tar..gz

commit 01adb1f123b6da67b09153a85e9583233a3aa4d2
Author: when-hao <72253870+when-hao@users.noreply.github.com>
Date:   Sat Mar 26 17:51:41 2022 +0800

    Delete run-amd64-linux.tar.gz

commit bddc02913288375f5037e15eff4f169e4c6a8b32
Author: when-hao <72253870+when-hao@users.noreply.github.com>
Date:   Sat Mar 26 17:51:29 2022 +0800

    Delete run-aarch64-linux.tar.gz

commit ab71f443fbd348f2d5e21f35f610bdbc57b81e75
Author: when-hao <72253870+when-hao@users.noreply.github.com>
Date:   Sat Mar 26 17:48:02 2022 +0800

    Add files via upload

    2022-03-26编译
```

好家伙，果然是 commit 后删除了又 commit。。。还传了两个其他文件上来，commit 了又 commit 了一个删除。。。（~~好家伙怎么还有一个`.tar..gz`格式的文件~~）

那么目标就已经很明确了，我们得让这个 blob object 不被任何 commit 所引用，那么大致的思路就有了，那就是：**rebase**。

rebase 的时候把这四个 commit 给 drop 掉就行了

## 操作

那么事不宜迟，我们开始操作

首先确保没有什么人在这个仓库上没有其他人在进行合作，~~就一个小脚本怎么会有人跟我协同合作呢~~

先找出要 rebase to 的 commit，上文的 commit 的前一个 commit 是这个

```bash
commit ccd9936a442848bb8aa40f5c3fd1836a065bf529
Author: when-hao <72253870+when-hao@users.noreply.github.com>
Date:   Sat Mar 26 11:54:38 2022 +0800

    Update README.md
```

知道了 commit 的 SHA，我们便可以用 git 的 interactive rebase 进行操作

```bash
git rebase -i ccd9
```

这个命令表示将 ccd9 前面的 commit 给 rebase 到 ccd9 上面

执行之后出现

```bash
pick ab71f44 Add files via upload
pick bddc029 Delete run-aarch64-linux.tar.gz
pick 01adb1f Delete run-amd64-linux.tar.gz
pick fce40b2 Delete run-x86-windows.tar..gz
pick 9f0fdf9 Update README.md
pick ae1eab0 Add files via upload
pick 3dd8789 Add files via upload
pick 8a280f6 Update README.md
pick 88687f4 Update README.md
pick 9512df7 Update run.py
pick d095e77 Update run.py
pick 85fb9d7 Update run.py
pick 1ce6bb2 Update README.md
pick a7da424 Update auto_clockin.yml
pick a389cb5 add form data entity
pick 5675e0a add telegram push
pick a842250 add telegram push
pick f04fa5b bug fix
pick a9db8d8 push bug fix
pick 78bfea6 update readme
pick 82ce174 modified counter
pick 28a3eed move TG_HTTP_PROXY to env
pick 31e85ad refactor: format `README.md`
pick 3bb0032 try to increase timeout
pick 3438c53 delete: action workflows
pick 5e46179 docs: update README

# Rebase ccd9936..5e46179 onto ccd9936 (26 commands)
#
# Commands:
# p, pick <commit> = use commit
# r, reword <commit> = use commit, but edit the commit message
# e, edit <commit> = use commit, but stop for amending
# s, squash <commit> = use commit, but meld into previous commit
# f, fixup [-C | -c] <commit> = like "squash" but keep only the previous
#                    commit's log message, unless -C is used, in which case
#                    keep only this commit's message; -c is same as -C but
#                    opens the editor
# x, exec <command> = run command (the rest of the line) using shell
# b, break = stop here (continue rebase later with 'git rebase --continue')
# d, drop <commit> = remove commit
# l, label <label> = label current HEAD with a name
# t, reset <label> = reset HEAD to a label
# m, merge [-C <commit> | -c <commit>] <label> [# <oneline>]
# .       create a merge commit using the original merge commit's
# .       message (or the oneline, if no original merge commit was
# .       specified); use -c <commit> to reword the commit message
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
```

根据指示，我们应该把不要的 commit 给 drop 掉，将

```bash
pick ab71f44 Add files via upload
pick bddc029 Delete run-aarch64-linux.tar.gz
pick 01adb1f Delete run-amd64-linux.tar.gz
pick fce40b2 Delete run-x86-windows.tar..gz
```

更改为

```bash
drop ab71f44 Add files via upload
drop bddc029 Delete run-aarch64-linux.tar.gz
drop 01adb1f Delete run-amd64-linux.tar.gz
drop fce40b2 Delete run-x86-windows.tar..gz
```

保存，关闭编辑器，完成本次 rebase 工作

这个时候的 git status 就变为了

```bash
On branch main
Your branch and 'origin/main' have diverged,
and have 22 and 27 different commits each, respectively.
  (use "git pull" to merge the remote branch into yours)

nothing to commit, working tree clean
```

然后 force push 一波，便得到了解决

```bash
(base) PS C:\Users\situ\github\gzhu_no_clock_in> git push -f
Enumerating objects: 78, done.
Counting objects: 100% (78/78), done.
Delta compression using up to 16 threads
Compressing objects: 100% (52/52), done.
Writing objects: 100% (70/70), 9.69 KiB | 2.42 MiB/s, done.
Total 70 (delta 44), reused 18 (delta 16), pack-reused 0
remote: Resolving deltas: 100% (44/44), completed with 5 local objects.
To https://github.com/situ2001/gzhu_no_clock_in.git
 + 5e46179...9ed00dc main -> main (forced update)
```

其他地方拉下来的就会是这样（会与本地仓库进行 merge）

```bash
situ@ubuntu:~/Desktop/gzhu_no_clock_in$ git pull
remote: Enumerating objects: 78, done.
remote: Counting objects: 100% (78/78), done.
remote: Compressing objects: 100% (24/24), done.
remote: Total 70 (delta 45), reused 69 (delta 44), pack-reused 0
Unpacking objects: 100% (70/70), 9.44 KiB | 1.35 MiB/s, done.
From https://github.com/situ2001/gzhu_no_clock_in
 + 5e46179...9ed00dc main       -> origin/main  (forced update)
Merge made by the 'recursive' strategy.
```

可以看到，远程仓库已经瘦身了

```bash
situ@ubuntu:~/Desktop$ git clone https://github.com/situ2001/gzhu_no_clock_in
Cloning into 'gzhu_no_clock_in'...
remote: Enumerating objects: 375, done.
remote: Counting objects: 100% (375/375), done.
remote: Compressing objects: 100% (201/201), done.
remote: Total 375 (delta 208), reused 294 (delta 134), pack-reused 0
Receiving objects: 100% (375/375), 334.02 KiB | 2.76 MiB/s, done.
Resolving deltas: 100% (208/208), done.
```

里头已经没有了这几个 blob 的存在

## 最后

git 用作版本控制固然好用，但 git 好用的前提是，你得做一个合格的 git 使用者，不然的话，很容易用出一言难尽的体验

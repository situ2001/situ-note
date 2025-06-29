---
title: 在威联通 NAS 配置自启动脚本的方法
comments: true
date: 2025-06-29 16:30:00
categories: 技术, QNAP, 威联通, NAS
description: 在威联通 NAS 上配置自启动脚本的方法
---

## 为什么我要配置自启动脚本

请见文章 [西数 HA340 硬盘在 QNAP NAS 上频繁启停的问题排查与解决方法](https://situ2001.com/blog/qnap-ha340-disk-bug)

在上述这篇文章里，我提及到了解决方法，但当时是要每次重启后都要执行一次命令，这样显然不够方便，如果忘记了就会继续频繁启停，导致硬盘损坏...

因此把设置硬盘 APM 的命令 `sudo hdparm -B 254 /dev/sdb` 添加到开机启动脚本就显得非常有必要了

## 如何配置

> 下面的内容
> 
> 1. *QNAP 和威联通指的都是 QNAP NAS*
> 2. *基于 Intel 的 QNAP NAS（比如 TS-464C）进行的，如果有其他架构的 QNAP NAS，可能会有些许差异。请参考官方文档 [Running Your Own Application at Startup](https://www.qnap.com/en/how-to/faq/article/running-your-own-application-at-startup)*

### 前置步骤

- 一个 SSH Client（比如 PuTTY/Termius/macOS 自带 SSH）
- 在威联通 NAS 上启用 SSH 功能：打开“Control Panel”（控制台） > “Network & File Services”（网络和文件服务）> Telnet/SSH > 启用“Allow SSH connection”（允许 SSH 连接）

### 开始操作

首先进入 `sudo` interactive 模式，一般来说，输入你的威联通 NAS 的管理员密码即可

```bash
sudo -i
```

然后将配置所处的 ramblock 挂载到 `/tmp/config` 目录下

```bash
mount $(/sbin/hal_app --get_boot_pd port_id=0)6 /tmp/config
```

在 `/tmp/config` 目录下创建一个名为 `autorun.sh` 的文件

```bash
touch /tmp/config/autorun.sh
vi /tmp/config/autorun.sh
```

在 `vi` 编辑器中输入以下内容（按 `i` 进入编辑模式）

```bash
sudo hdparm -B 254 /dev/sdb # 替换为你自己的自启动脚本内容
```

按 `Esc` 键退出编辑模式，然后输入 `:x` 保存并退出

接下来需要给这个脚本文件添加可执行权限

```bash
chmod +x /tmp/config/autorun.sh
```

最后，卸载刚刚挂载的 ramblock

```bash
umount /tmp/config
```

### 验证配置

按道理来说，按照上述步骤操作后，重启 NAS 后就会自动执行脚本了。可以这么查看是否会生效：

1. 打开“Control Panel”（控制台） > “Hardware”（硬件） > “General”（常规）
2. 勾选 “Run user defined processes during startup”（启动时运行用户自定义的进程）
3. 点击 “View autorun.sh”（查看 autorun.sh），如果能看到你刚刚添加的脚本内容，就说明配置成功了
4. 亲自执行：在重启后，是否真的执行了脚本。（比如我配置的执行 `sudo hdparm -B 254 /dev/sdb` 命令，那么验证方法就是通过 `sudo hdparm -I /dev/sdb` 查看 `/dev/sdb` 的 APM 值是否为 `0xfe`）

## 结尾

操作步骤较为直接，按官方文档执行即可。但还是要吐槽一下，没想到 HA340 在 QNAP 上会有这么奇葩的问题，真实令人无语...

可能这也是为什么 QNAP 会有一个官方的硬盘兼容性列表吧...也是为什么群晖在最新的机型（ds925+）上不再支持自家以外的硬盘的原因吧...

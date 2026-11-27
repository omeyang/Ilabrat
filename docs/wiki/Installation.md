# 安装与验证

从 [v0.1.0 Release](https://github.com/omeyang/Ilabrat/releases/tag/v0.1.0) 下载 `omeyang-dsh-ilabrat-0.1.0.tgz`。插件会在 DSH 宿主机上启动 buf 和 grpcurl。如果浏览器与 DSH 分别运行在两台机器上，请把工具和 schema 放在运行 DSH 的机器上。

## 安装前

Web 版的已验证组合是 DSH `0.2.2-rc.5`、Node.js 24.9 或更高版本。把 Buf 和 grpcurl 放进启动 DSH 的进程 PATH，再运行以下命令确认可执行文件版本。

```sh
buf --version
grpcurl --version
```

在 Windows PowerShell 中还可执行 `Get-Command buf.exe, grpcurl.exe` 查看实际路径。更新 PATH 后，重新启动 DSH。

## 选择安装位置

在下载目录执行相应命令。

| 使用方式 | 操作 |
| --- | --- |
| DSH Web | 执行 `dsh plugin --profile web add ./omeyang-dsh-ilabrat-0.1.0.tgz`，刷新 Web 页面 |
| DSH 桌面版 | 先启动桌面版一次并完全退出，用桌面版提供的 `dsh` 执行 `dsh plugin --profile desktop add ./omeyang-dsh-ilabrat-0.1.0.tgz`，再重新打开桌面版 |

## 检查安装结果

侧栏应出现 **Ilabrat · gRPC 工作台**。打开后，输入一个含 `buf.yaml` 的目录，点击「加载 schema」。若工作区定义了服务，左侧会列出方法。点击「编译」后，应看到 `.ilabrat/schema.binpb` 的输出位置。继续阅读[工作台快速入门](Quickstart.md)。

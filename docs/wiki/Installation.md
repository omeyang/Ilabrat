# 安装与验证

将 Ilabrat 0.2.0 的 tgz 安装包放在本机，在该目录运行相应命令。DSH 版本参考 `0.2.2-rc.5`，Node.js 需要 24.9 或更新版本。

| 安装位置 | 命令 |
| --- | --- |
| DSH Web | `dsh plugin --profile web add ./omeyang-dsh-ilabrat-0.2.0.tgz` |
| DSH 桌面版 | 完全退出桌面应用，用它提供的 `dsh` 执行 `dsh plugin --profile desktop add ./omeyang-dsh-ilabrat-0.2.0.tgz`，再重新打开 |

Buf 和 grpcurl 只需安装在**实际发送请求的机器**上，且在非交互进程的 PATH 中可执行。本机 Windows 模式使用 `buf.exe` 和 `grpcurl.exe`。SSH 模式使用 Linux 的 SFTP 子系统、`buf`、`grpcurl` 和 GNU `timeout`；远程无需安装 Node 或 DSH。SSH agent 认证使用 DSH 宿主上已经解锁的 agent。

从源码生成跨平台安装包可执行 `npm ci` 和 `npm run pack:portable`。安装包内含 ssh2 所需的 JavaScript 依赖。

安装后从侧栏打开 Ilabrat，选取一个含有 service 的 .proto 文件，检查接口下拉列表。继续阅读[工作台快速入门](Quickstart.md)。

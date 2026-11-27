# Ilabrat 使用手册

Ilabrat 是 DeepSeek Harness（DSH）里的 gRPC 接口测试工作台。只要有服务地址和对应的 Buf 工作区，就能从侧边栏选方法、发请求、检查响应，再把这次调用保存为回归用例。服务可以关闭 gRPC 反射。

| 你要完成的事 | 从这里开始 |
| --- | --- |
| 安装到 DSH Web 或桌面版 | [安装与验证](Installation.md) |
| 从 `buf.yaml` 发出第一条 RPC | [工作台快速入门](Quickstart.md) |
| 验证字段和延迟，重复运行或分享用例 | [断言与用例](Test-cases.md) |
| 从脚本、PowerShell 或 DSH Agent 调用 | [命令行与 Agent](CLI-and-agent.md) |
| 定位加载、连接、断言或回放错误 | [故障排查](Troubleshooting.md) |

当前手册对应 **v0.1.0**。发布包已在 DSH `0.2.2-rc.5` Web profile 完成浏览器验收，Windows x64 与 Linux x64 均用真实 buf、grpcurl 通过了集成测试。Windows Electron 外壳的单独验收尚待完成。[下载安装包](https://github.com/omeyang/Ilabrat/releases/tag/v0.1.0)

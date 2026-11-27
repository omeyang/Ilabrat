# 故障排查

| 现象 | 检查方法 |
| --- | --- |
| 侧栏没有 Ilabrat | 核对安装使用的 profile。Web 刷新页面或重启 Web 进程；桌面版完全退出后重开。 |
| 提示找不到 buf 或 grpcurl | 在启动 DSH 的同一环境执行 `buf --version` 和 `grpcurl --version`。Windows 可用 `Get-Command buf.exe, grpcurl.exe` 核对 PATH。 |
| 加载目录失败或方法列表为空 | 选择直接包含 `buf.yaml` 的目录，从该目录运行 `buf build .`。如果构建成功却没有方法，确认模块里确实声明了 `service` 和 `rpc`。私有 BSR 依赖需要本机 Buf 认证。 |
| 服务关闭反射 | 加载与服务版本一致的本地 schema。插件用 FileDescriptorSet 调用，支持关闭反射的服务。 |
| TLS 握手失败或调用超时 | 检查端口、TLS/h2c 和从 DSH 主机到服务的连通性。远程 DSH 的 `localhost` 指远程机。v0.1.0 使用系统信任的 TLS，尚无自签 CA 和 mTLS 表单。 |
| RPC 调用成功，测试却失败 | 展开断言结果，核对 JSON Pointer、值的类型及 RPC 耗时上限。例如字符串 `"42"` 与数字 `42` 会产生不同结果。 |
| 保存时正常，回放时缺少 Metadata | 历史只保存键名。在表单中补填值再发送，或用 CLI 的 `--metadata` 指定当次回放值。 |
| 长调用或大响应被中止 | 每个 buf/grpcurl 子进程有 60 秒超时，标准输出与标准错误合计上限为 4 MiB。服务端流的多条响应按原始文本展示。 |

错误出现在 **buf build** 阶段时，先修复配置、依赖或 proto 编译；错误出现在 **grpcurl** 阶段时，再核对服务地址、方法、请求和响应。

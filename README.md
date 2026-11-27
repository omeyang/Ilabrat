# Ilabrat

Ilabrat 是 DeepSeek Harness 的 gRPC 工作台。可以在 Windows 上打开插件，选择已保存的 Linux 开发机，直接浏览开发机上的 Proto 文件并从那里调用测试服务。也可以选择本机，由运行 DSH 的 Windows 或 Linux 发送请求。

[安装与验证](docs/wiki/Installation.md) · [工作台快速入门](docs/wiki/Quickstart.md) · [断言与用例](docs/wiki/Test-cases.md)

## 安装

使用 Node.js 24.9 或更新版本。将 0.2.0 安装包添加到对应的 DSH profile，重新打开客户端。Web 版示例如下。

```sh
dsh plugin --profile web add ./omeyang-dsh-ilabrat-0.2.0.tgz
```

## 从协议到一次可重复的测试

1. 选择「请求来源」。本机使用 DSH 所在机器；SSH 来源保存名称、主机、端口、账号和认证方式，首次连接核对主机指纹。SSH 模式通过 SFTP 浏览文件，Buf 和 grpcurl 均在 Linux 上执行。把它们和 GNU timeout 放在远端非交互命令的 PATH 中。
2. 选择单个 .proto 或含有 buf.yaml 的工作区。单文件方式支持同目录导入和 Buf 可解析的模块导入。按 Package、Service、Method 选择接口，在字段视图中直接填值。嵌套字段、枚举、数组、map、oneof 和 JSON 编辑都可用。
3. 填写目标地址和 TLS 或明文 h2c，点击「保存目标」命名。通过「保存模板」可复用来源、目标地址与传输方式、协议路径、方法、请求体和断言。模板只保留 Metadata 键名。
4. 在「断言」中设置响应字段及其期望 JSON 值，或设置 RPC 耗时上限。例如，路径 `/user/id`、期望值 `"42"`。空路径匹配整个响应；数组用 `/items/0/name`，字段名包含 `/` 或 `~` 时用 JSON Pointer 的 `~1`、`~0` 转义。
5. 点击「发送请求」。结果包含 gRPC 成功状态、断言明细、响应内容、错误、退出码、总耗时和 RPC 耗时。RPC 耗时从启动 grpcurl 开始，总耗时还包含编译。每次发送都会重新编译 schema 并传入临时 FileDescriptorSet，可调用关闭反射的服务。
6. 勾选「保存为用例」，填写名称再发送，成功与失败结果均可保存。在「用例」中点击一项可以恢复表单；勾选多项并点击「运行选中」会按勾选顺序逐条执行。导出会生成可分享的请求及断言 JSON，导入后可编辑再发送。

## 保存位置与调用范围

- **本机 Buf 用例**存放在工作区 `.ilabrat/history/<UUID>.json`，包含地址、方法、请求体、断言、结果和耗时。Metadata 只在用例和导出文件中记录键名；回放需要这些字段时，在 Metadata 页签或 CLI 中重新填写。批量运行遇到需要补填的字段会显示失败并继续下一条。请求体和服务返回的内容均按原文保存。
- **SSH 来源**保存在 DSH 用户目录的 `.ilabrat/sources` 下。Windows 使用当前用户 DPAPI 保护密码，Linux 使用 AES-256-GCM 和同用户私有密钥文件。单文件与远程用例按来源和协议路径隔离，存放在宿主的 `.ilabrat/cases` 下。可用 `ILABRAT_HOME` 指定宿主配置根目录。
- **编译**生成 `.ilabrat/schema.binpb`，失败时保留上次成功的文件。建议将 `.ilabrat/` 加入业务仓库的忽略规则。校验执行 `buf lint`。环境地址保存在当前浏览器/桌面 profile 本地。
- **输入输出**每次发送一条 JSON 请求。服务端流的多个响应以 grpcurl 原始文本显示；交互式双向流、自签 CA 和 mTLS 表单尚未支持。每个子进程有 60 秒超时，输出合计上限 4 MiB。

## Agent 与命令行

DSH 注册 `ilabrat_buf` 和 `ilabrat_grpcurl`。例如让 Agent「从当前工作区列出所有 RPC」「对选定接口发一个明文请求，并保存为用例」。工具通过 `workingDirectory` 获取实际会话目录，也接受 `dir` 参数。在远程主机运行 DSH 时，目录和 `localhost` 均指该主机。

在仓库或解包目录运行，或通过 npm 的 `bin` 入口使用 `ilabrat` 命令。

```sh
node src/cli.js buf lint --dir ./service
node src/cli.js buf build --dir ./service
node src/cli.js buf schema --dir ./service
node src/cli.js grpcurl localhost:50051 echo.v1.EchoService/Echo --dir ./service --plaintext --data '{"text":"hello"}' --save
node src/cli.js grpcurl --dir ./service --history
node src/cli.js grpcurl --dir ./service --case <UUID>
```

Windows PowerShell 可以通过标准输入传入 JSON，避免命令行引号差异。

```powershell
'{"text":"hello"}' | node src/cli.js grpcurl localhost:50051 echo.v1.EchoService/Echo --dir .\service --data '@' --plaintext
```

## 开发与验证

插件通过 ssh2 执行远程操作。修改 `web/` 后执行 `npm ci`、`npm run build` 更新 `client.js`。设置好 Buf、grpcurl 的 PATH 后运行 `npm test`。集成测试会在临时目录创建包含 protobuf 导入的 v2 工作区，并在回环地址启动关闭反射的 HTTP/2 gRPC 测试端。运行 `npm run pack:portable` 生成带纯 JavaScript 运行时依赖的跨平台安装包。

参考 [DSH 桌面 profile](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.2-rc.5/apps/desktop/README.md)、[Buf build](https://buf.build/docs/reference/cli/buf/build/) 与 [grpcurl](https://github.com/fullstorydev/grpcurl)。

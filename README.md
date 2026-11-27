# Ilabrat

在 DeepSeek Harness 侧边栏打开 **Ilabrat · gRPC 工作台**，选择含有 `buf.yaml` 的项目，即可浏览服务、编辑 JSON 请求、发送 RPC 并验证响应。插件使用 DSH 所在机器 PATH 中的 Buf 与 grpcurl，支持 Windows 和 Linux。界面使用中文，有两个同名功能入口供 Agent 和命令行调用。

## 安装

已在 DSH `0.2.2-rc.5` 的 Web profile 验证。使用与该版本兼容的 DSH、Node.js 24.9 或更新版本，将 `buf` 和 `grpcurl` 加入运行 DSH 的进程 PATH。Windows 上查找 `buf.exe`、`grpcurl.exe`。单独启动的桌面程序可能需要重启才能继承更新后的 PATH。

**Web 版**在插件包所在目录执行以下命令，然后刷新 DSH。如果侧栏尚未更新，重新启动 Web profile。

```sh
dsh plugin --profile web add ./omeyang-dsh-ilabrat-0.1.0.tgz
```

**桌面版**可在「插件 → 添加插件」选择源码目录。使用命令行安装包时，先启动过桌面版并将它完全退出，再用桌面版提供的 `dsh` 命令安装到 desktop profile，重新打开应用。

```sh
dsh plugin --profile desktop add ./omeyang-dsh-ilabrat-0.1.0.tgz
```

在远程开发机可直接从源码目录安装 Web 插件，仓库已包含构建好的浏览器入口。

```sh
dsh plugin --profile web add /root/code/ai/github.com/omeyang/Ilabrat
```

## 从 schema 到一次可重复的测试

1. 打开侧栏工作台。打开时按当前会话工作目录、上次加载的目录、DSH 启动目录的顺序选择默认位置。也可以直接输入目录或浏览目录，再点击「加载 schema」。Buf 负责解析模块、导入、工作区依赖和锁文件。使用 BSR 依赖时，由本机 Buf 提供网络访问及认证。
2. 从方法列表选择 RPC。请求体为空对象时会自动填入 JSON 模板，也可以点击「填入 schema 模板」覆盖编辑器。模板从 protobuf 描述符生成，业务必填值、Any 的具体类型、数组和 map 的内容由调用者填写。
3. 填写 `host:port` 和 JSON，选择 TLS 或明文 h2c。默认使用系统信任的 TLS。Metadata 页签可填写 JSON 字符串键值对。通过「保存环境」记住常用地址和传输方式。
4. 在「断言」中设置响应字段及其期望 JSON 值，或设置 RPC 耗时上限。例如，路径 `/user/id`、期望值 `"42"`。空路径匹配整个响应；数组用 `/items/0/name`，字段名包含 `/` 或 `~` 时用 JSON Pointer 的 `~1`、`~0` 转义。
5. 点击「发送请求」。结果包含 gRPC 成功状态、断言明细、响应内容、错误、退出码、总耗时和 RPC 耗时。RPC 耗时从启动 grpcurl 开始，总耗时还包含编译。每次发送都会重新编译 schema 并传入临时 FileDescriptorSet，可调用关闭反射的服务。
6. 勾选「保存为用例」，填写名称再发送，成功与失败结果均可保存。在「用例」中点击一项可以恢复表单；勾选多项并点击「运行选中」会按勾选顺序逐条执行。导出会生成可分享的请求及断言 JSON，导入后可编辑再发送。

## 保存位置与调用范围

- **用例**存放在工作区 `.ilabrat/history/<UUID>.json`，包含地址、方法、请求体、断言、结果和耗时。Metadata 只在用例和导出文件中记录键名；回放需要这些字段时，在 Metadata 页签或 CLI 中重新填写。批量运行遇到需要补填的字段会显示失败并继续下一条。请求体和服务返回的内容均按原文保存。
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

插件无 npm 运行时依赖。修改 `web/` 后执行 `npm ci`、`npm run build` 更新 `client.js`。设置好 Buf、grpcurl 的 PATH 后运行 `npm test`。集成测试会在临时目录创建包含 protobuf 导入的 v2 工作区，并在回环地址启动关闭反射的 HTTP/2 gRPC 测试端。运行 `npm pack` 生成安装包。

参考 [DSH 桌面 profile](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.2-rc.5/apps/desktop/README.md)、[Buf build](https://buf.build/docs/reference/cli/buf/build/) 与 [grpcurl](https://github.com/fullstorydev/grpcurl)。

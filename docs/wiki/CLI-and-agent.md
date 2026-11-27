# 命令行与 Agent

以下命令从源码根目录或安装包解包后的 `package` 目录运行。`./service` 指含有 `buf.yaml` 的目录。

## 校验、编译、列方法

```sh
node src/cli.js buf lint --dir ./service
node src/cli.js buf build --dir ./service
node src/cli.js buf schema --dir ./service
```

## 指定来源和文件

```sh
node src/cli.js buf schema --source SOURCE_UUID --proto /opt/protos/echo.proto
```

SOURCE_UUID 可从工作台的「连接详情」复制。CLI 和 Agent 应与工作台使用同一个 DSH 宿主用户及配置目录。Agent 工具对应参数是 `sourceId` 和 `proto`。省略来源时在本机执行。

## 调用与回放

以下 Bash 示例适用于快速入门中的 Echo 服务。

```sh
node src/cli.js grpcurl 127.0.0.1:50051 echo.v1.EchoService/Echo \
  --dir ./service --plaintext --data '{"text":"hello"}' \
  --check '{"pointer":"/text","equals":"hello","maxMs":1000}' \
  --name echo-smoke --save

node src/cli.js grpcurl --dir ./service --history
```

从历史结果取出 UUID，用它替换下面的 `CASE_UUID`。如用例需要鉴权，还可以用 `--metadata` 传入 JSON 键值对。

```sh
node src/cli.js grpcurl --dir ./service --case CASE_UUID
```

Windows PowerShell 可以通过标准输入传入请求，减少 JSON 引号转义。

```powershell
'{"text":"hello"}' | node src/cli.js grpcurl 127.0.0.1:50051 echo.v1.EchoService/Echo --dir .\service --plaintext --data '@'
```

CLI 将执行结果输出为 JSON。成功的进程退出码为 0，调用或断言失败为 1，CLI 参数解析等错误为 2。结果对象里的 `exitCode` 是外部工具的退出码，所以字段断言失败时它仍可能为 0。

## DSH Agent 工具

- `ilabrat_buf` 接受 `action: lint | build | schema` 与可选的 `dir`。
- `ilabrat_grpcurl` 支持发送、列历史和加载用例。发送时提供 `address`、`method` 和 JSON 文本 `data`。可选参数包括 `plaintext`、`metadata`、`check`、`name` 和 `save`。

可以直接告诉 Agent：“列出当前工作区里的 RPC 方法”，或“把 Echo 接口的 text 设为 hello，验证返回值并保存为用例”。

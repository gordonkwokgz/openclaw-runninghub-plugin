<div align="center">

# OpenClaw RunningHub 插件

[![中文](https://img.shields.io/badge/语言-中文-red.svg)](#中文版) [![English](https://img.shields.io/badge/Language-English-blue.svg)](#english-version)

[gordonkwokgz/openclaw-runninghub-plugin](https://github.com/gordonkwokgz/openclaw-runninghub-plugin)

</div>

## 中文版

一个 OpenClaw 插件，集成了 RunningHub API，启用基于云的 ComfyUI 工作流和 GPU 加速功能。

### 功能特色

- 🚀 与 RunningHub 云 GPU 服务的直接集成
- 🎨 支持 ComfyUI 工作流执行
- ⚡ 使用云 GPU 的快速图像生成
- 🔧 通过 nodeInfoList 进行动态参数修改
- 📋 任务状态监控和结果检索
- 🛠️ OpenClaw 的命令行界面

### 前置要求

- 已安装并运行的 [OpenClaw](https://github.com/openclaw/openclaw)
- RunningHub 账户及 API 访问权限
- RunningHub 的有效 API 密钥
- RunningHub 平台上的已发布工作流 ID

### 安装

#### 1. 克隆或下载插件

```bash
# 克隆仓库
git clone https://github.com/[your-username]/openclaw-runninghub-plugin.git
cd openclaw-runninghub-plugin

# 或下载并解压 zip 文件
```

#### 2. 安装依赖

```bash
npm install
```

#### 3. 配置插件

首先，复制模板配置文件：

```bash
cp runninghub-config-template.json runninghub-config.json
```

然后编辑 `runninghub-config.json` 填入您的凭据：

```json
{
  "apiKey": "YOUR_API_KEY_HERE",
  "defaultWorkflowId": "YOUR_WORKFLOW_ID_HERE", 
  "baseUrl": "https://www.runninghub.cn"
}
```

##### 获取您的凭据

1. **API 密钥**：
   - 登录您的 RunningHub 账户
   - 在仪表板的 API 部分导航
   - 复制您的 32 字符 API 密钥

2. **工作流 ID**：
   - 前往 RunningHub 上您所需的工作流
   - URL 将类似：`https://www.runninghub.cn/#/workflow/WORKFLOW_ID`
   - 从 URL 中提取 WORKFLOW_ID

⚠️ **重要**：请确保您的工作流在通过 API 使用之前已在浏览器中成功运行至少一次。

### 使用方法

#### 在 OpenClaw 环境中

安装后，该插件提供以下命令：

```javascript
// 检查插件状态
runninghub-status

// 使用默认设置执行工作流
runninghub-execute [workflowId]

// 使用自定义参数执行工作流
runninghub-execute [workflowId] '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "your prompt"}]}'

// 获取帮助
runninghub-help
```

#### 编程使用

```javascript
const { createRunningHubIntegration } = require('./advanced-runninghub-integration.js');

async function example() {
  try {
    // 创建集成实例
    const integration = await createRunningHubIntegration();
    
    // 使用动态参数执行工作流
    const result = await integration.executeWorkflowWithResult(
      'YOUR_WORKFLOW_ID',  // 替换为您的工作流 ID
      {
        nodeInfoList: [
          {
            nodeId: "10",              // 替换为您的节点 ID
            fieldName: "text",         // 替换为您的字段名
            fieldValue: "your prompt"  // 您的实际提示词
          }
        ],
        instanceType: "default",       // "default" (24G) 或 "plus" (48G)
        usePersonalQueue: false,
        addMetadata: false
      }
    );
    
    console.log('任务 ID:', result.taskId);
    console.log('状态:', result.status);
  } catch (error) {
    console.error('错误:', error.message);
  }
}

example();
```

### 配置选项

插件支持 `runninghub-config.json` 中的以下配置选项：

- `apiKey`: 您的 RunningHub API 密钥（必需）
- `defaultWorkflowId`: 未指定时使用的默认工作流（可选）
- `baseUrl`: RunningHub API 基础 URL（通常保持默认值）

### API 参数

#### nodeInfoList 结构

`nodeInfoList` 参数允许动态修改工作流参数：

```json
{
  "nodeInfoList": [
    {
      "nodeId": "NODE_ID",      // 工作流中的特定节点 ID
      "fieldName": "FIELD_NAME", // 该节点中的字段名
      "fieldValue": "VALUE"     // 要设置的值
    }
  ]
}
```

查找工作流中正确的 `nodeId` 和 `fieldName` 的方法：
1. 在 RunningHub 的网页界面中打开您的工作流
2. 识别您想要修改的节点
3. 使用浏览器开发者工具或工作流编辑器查找节点 ID 和字段名

#### 实例类型

- `"default"`: 标准实例，配备 24GB 显存
- `"plus"`: 高性能实例，配备 48GB 显存（如可用）

### 故障排除

#### 常见问题

1. **TOKEN_INVALID (412)**: 通常表示 API 密钥不正确或端点格式无效
2. **INVALID_WORKFLOW_ID**: 验证您的工作流 ID 是否正确以及工作流是否已发布
3. **Invalid node info (803)**: 检查您的 nodeInfoList 参数是否与您的工作流结构匹配
4. **INSUFFICIENT_BALANCE**: 确保您的 RunningHub 账户有足够的积分

#### 调试技巧

- 在使用 API 之前，确保您的工作流在浏览器中成功运行
- 验证所有节点 ID 和字段名是否与您的特定工作流匹配
- 从空的 nodeInfoList 开始测试基本功能
- 检查您的 API 密钥是否尚未过期或被撤销

### 安全考虑

- 切勿将您的实际 API 密钥提交到版本控制
- 安全地存储您的配置文件
- 查看插件所需的权限
- 定期监控您的 RunningHub 使用情况

### 许可证

MIT 许可证 - 详情请参见 LICENSE 文件。

---

## English Version

An OpenClaw plugin that integrates with RunningHub API to enable cloud-based ComfyUI workflows with GPU acceleration.

### Features

- 🚀 Direct integration with RunningHub's cloud GPU services
- 🎨 Support for ComfyUI workflow execution
- ⚡ Fast image generation using cloud GPUs
- 🔧 Dynamic parameter modification via nodeInfoList
- 📋 Task status monitoring and result retrieval
- 🛠️ Command-line interface for OpenClaw

### Prerequisites

- [OpenClaw](https://github.com/openclaw/openclaw) installed and running
- RunningHub account with API access
- Valid API key from RunningHub
- Published workflow ID on RunningHub platform

### Installation

#### 1. Clone or Download the Plugin

```bash
# Clone the repository
git clone https://github.com/[your-username]/openclaw-runninghub-plugin.git
cd openclaw-runninghub-plugin

# Or download and extract the zip file
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Configure the Plugin

First, copy the template configuration file:

```bash
cp runninghub-config-template.json runninghub-config.json
```

Then edit `runninghub-config.json` with your credentials:

```json
{
  "apiKey": "YOUR_API_KEY_HERE",
  "defaultWorkflowId": "YOUR_WORKFLOW_ID_HERE", 
  "baseUrl": "https://www.runninghub.cn"
}
```

##### Getting Your Credentials

1. **API Key**: 
   - Log in to your RunningHub account
   - Navigate to the API section in your dashboard
   - Copy your 32-character API key

2. **Workflow ID**:
   - Go to your desired workflow on RunningHub
   - The URL will look like: `https://www.runninghub.cn/#/workflow/WORKFLOW_ID`
   - Extract the WORKFLOW_ID from the URL

⚠️ **Important**: Make sure your workflow has been run successfully at least once in the browser before using it via the API.

### Usage

#### In OpenClaw Environment

Once installed, the plugin provides the following commands:

```javascript
// Check plugin status
runninghub-status

// Execute a workflow with default settings
runninghub-execute [workflowId]

// Execute a workflow with custom parameters
runninghub-execute [workflowId] '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "your prompt"}]}'

// Get help
runninghub-help
```

#### Programmatic Usage

```javascript
const { createRunningHubIntegration } = require('./advanced-runninghub-integration.js');

async function example() {
  try {
    // Create integration instance
    const integration = await createRunningHubIntegration();
    
    // Execute a workflow with dynamic parameters
    const result = await integration.executeWorkflowWithResult(
      'YOUR_WORKFLOW_ID',  // Replace with your workflow ID
      {
        nodeInfoList: [
          {
            nodeId: "10",              // Replace with your node ID
            fieldName: "text",         // Replace with your field name
            fieldValue: "your prompt"  // Your actual prompt
          }
        ],
        instanceType: "default",       // "default" (24G) or "plus" (48G)
        usePersonalQueue: false,
        addMetadata: false
      }
    );
    
    console.log('Task ID:', result.taskId);
    console.log('Status:', result.status);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

example();
```

### Configuration Options

The plugin supports the following configuration options in `runninghub-config.json`:

- `apiKey`: Your RunningHub API key (required)
- `defaultWorkflowId`: Default workflow to use when none is specified (optional)
- `baseUrl`: RunningHub API base URL (usually remains as default)

### API Parameters

#### nodeInfoList Structure

The `nodeInfoList` parameter allows dynamic modification of workflow parameters:

```json
{
  "nodeInfoList": [
    {
      "nodeId": "NODE_ID",      // The specific node ID in your workflow
      "fieldName": "FIELD_NAME", // The field name in that node
      "fieldValue": "VALUE"     // The value to set
    }
  ]
}
```

To find the correct `nodeId` and `fieldName` for your workflow:
1. Open your workflow in RunningHub's web interface
2. Identify the nodes you want to modify
3. Use browser developer tools or workflow editor to find node IDs and field names

#### Instance Types

- `"default"`: Standard instance with 24GB VRAM
- `"plus"`: High-performance instance with 48GB VRAM (if available)

### Troubleshooting

#### Common Issues

1. **TOKEN_INVALID (412)**: Usually indicates incorrect API key or invalid endpoint format
2. **INVALID_WORKFLOW_ID**: Verify your workflow ID is correct and the workflow is published
3. **Invalid node info (803)**: Check that your nodeInfoList parameters match your workflow structure
4. **INSUFFICIENT_BALANCE**: Ensure your RunningHub account has sufficient credits

#### Debugging Tips

- Make sure your workflow runs successfully in the browser before using the API
- Verify all node IDs and field names match your specific workflow
- Start with empty nodeInfoList to test basic functionality
- Check your API key hasn't expired or been revoked

### Security Considerations

- Never commit your actual API key to version control
- Store your configuration file securely
- Review permissions required by the plugin
- Monitor your RunningHub usage regularly

### License

MIT License - See LICENSE file for details.

### Contributing

Feel free to submit issues and enhancement requests. Pull requests are welcome!

---

This plugin enables seamless integration between OpenClaw and RunningHub's cloud GPU services, providing powerful AI workflow capabilities.
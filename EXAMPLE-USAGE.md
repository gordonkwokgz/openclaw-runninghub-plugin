<div align="center">

# 示例用法 / Example Usage

[![中文](https://img.shields.io/badge/语言-中文-red.svg)](#示例用法) [![English](https://img.shields.io/badge/Language-English-blue.svg)](#example-usage)

</div>

## 示例用法

这里有一些实用示例，展示如何在 OpenClaw 中使用 RunningHub 插件。

### 基础设置

首先，确保您具备以下条件：

1. 拥有 API 访问权限的 RunningHub 账户
2. 从 RunningHub 仪表板获取的 API 密钥
3. 已发布的工件 ID（例如，来自 URL：`https://www.runninghub.cn/#/workflow/WORKFLOW_ID`）

### 配置

创建您的 `runninghub-config.json`：

```json
{
  "apiKey": "your_32_character_api_key_here",
  "defaultWorkflowId": "your_workflow_id_here",
  "baseUrl": "https://www.runninghub.cn"
}
```

### 命令示例

#### 检查状态
```
runninghub-status
```

预期输出：
```
✅ RunningHub Connection: Healthy
👤 Account Type: Basic Member
💰 Balance: 100.00
🕒 Last Checked: 2025-01-31T23:00:00.000Z
```

#### 列出工作流
```
runninghub-list
```

#### 执行工作流（基础）
```
runninghub-execute 123456789
```

#### 执行带自定义参数的工作流
```
runninghub-execute 123456789 '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "A beautiful landscape at sunset"}]}'
```

#### 执行带附加选项的工作流
```
runninghub-execute 123456789 '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "A cyberpunk city"}], "instanceType": "default", "addMetadata": false}'
```

### 实际应用示例

#### 示例 1：文本到图像生成
```
runninghub-execute 2014002855044190210 '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "A majestic dragon flying over a medieval castle"}]}'
```

#### 示例 2：使用多个节点参数
```
runninghub-execute 123456789 '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "A beautiful portrait"}, {"nodeId": "11", "fieldName": "steps", "fieldValue": "30"}]}'
```

#### 示例 3：高性能实例
```
runninghub-execute 123456789 '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "Detailed architectural rendering"}], "instanceType": "plus"}'
```

### 预期响应

#### 成功执行响应
```
🚀 Workflow execution initiated!
🆔 Workflow ID: 123456789
⏱️ Request processed in: 0.52s
🏷️  Task ID: 2017614664518733825
📊 Status: RUNNING
```

#### 失败执行响应
```
❌ Error executing workflow: Invalid node info, please match workflow requirements
```

### 最佳实践

1. **从简单开始**：从空的 `nodeInfoList` 开始测试基本连接
2. **验证工作流**：确保您的工作流在浏览器中能成功运行
3. **节点映射**：仔细识别您特定工作流中的节点 ID 和字段名
4. **监控使用量**：跟踪您的 RunningHub 积分消耗
5. **错误处理**：注意错误代码以便故障排除

### 常见节点字段名

不同的工作流可能使用不同的字段名。常见的包括：
- `text` - 用于文本提示
- `positive` - 用于正向调节
- `negative` - 用于负向调节
- `prompt` - 通用提示字段
- `seed` - 随机种子值
- `steps` - 推理步数
- `cfg_scale` - 配置比例

始终在您的特定工作流中验证正确的字段名。

---

## Example Usage

Here are some practical examples of how to use the RunningHub plugin with OpenClaw.

### Basic Setup

First, ensure you have:

1. A RunningHub account with API access
2. Your API key from the RunningHub dashboard
3. A published workflow ID (e.g., from URL: `https://www.runninghub.cn/#/workflow/WORKFLOW_ID`)

### Configuration

Create your `runninghub-config.json`:

```json
{
  "apiKey": "your_32_character_api_key_here",
  "defaultWorkflowId": "your_workflow_id_here",
  "baseUrl": "https://www.runninghub.cn"
}
```

### Command Examples

#### Check Status
```
runninghub-status
```

Expected output:
```
✅ RunningHub Connection: Healthy
👤 Account Type: Basic Member
💰 Balance: 100.00
🕒 Last Checked: 2025-01-31T23:00:00.000Z
```

#### List Workflows
```
runninghub-list
```

#### Execute a Workflow (Basic)
```
runninghub-execute 123456789
```

#### Execute a Workflow with Custom Parameters
```
runninghub-execute 123456789 '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "A beautiful landscape at sunset"}]}'
```

#### Execute with Additional Options
```
runninghub-execute 123456789 '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "A cyberpunk city"}], "instanceType": "default", "addMetadata": false}'
```

### Real-World Examples

#### Example 1: Text-to-Image Generation
```
runninghub-execute 2014002855044190210 '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "A majestic dragon flying over a medieval castle"}]}'
```

#### Example 2: Using Multiple Node Parameters
```
runninghub-execute 123456789 '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "A beautiful portrait"}, {"nodeId": "11", "fieldName": "steps", "fieldValue": "30"}]}'
```

#### Example 3: High-Performance Instance
```
runninghub-execute 123456789 '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "Detailed architectural rendering"}], "instanceType": "plus"}'
```

### Expected Responses

#### Successful Execution Response
```
🚀 Workflow execution initiated!
🆔 Workflow ID: 123456789
⏱️ Request processed in: 0.52s
🏷️  Task ID: 2017614664518733825
📊 Status: RUNNING
```

#### Failed Execution Response
```
❌ Error executing workflow: Invalid node info, please match workflow requirements
```

### Best Practices

1. **Start Simple**: Begin with empty `nodeInfoList` to test basic connectivity
2. **Verify Workflow**: Ensure your workflow runs successfully in the browser first
3. **Node Mapping**: Carefully identify node IDs and field names in your specific workflow
4. **Monitor Usage**: Keep track of your RunningHub credit consumption
5. **Error Handling**: Pay attention to error codes for troubleshooting

### Common Node Field Names

Different workflows may use different field names. Common ones include:
- `text` - For text prompts
- `positive` - For positive conditioning
- `negative` - For negative conditioning
- `prompt` - General prompt field
- `seed` - Random seed value
- `steps` - Number of inference steps
- `cfg_scale` - Configuration scale

Always verify the correct field names in your specific workflow.
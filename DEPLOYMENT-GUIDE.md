<div align="center">

# OpenClaw RunningHub 插件部署指南

[![中文](https://img.shields.io/badge/语言-中文-red.svg)](#openclaw-runninghub-插件部署指南) [![English](https://img.shields.io/badge/Language-English-blue.svg)](#openclaw-runninghub-plugin-deployment-guide)

</div>

## OpenClaw RunningHub 插件部署指南

本指南解释了如何将 RunningHub 插件集成到您的 OpenClaw 系统中。

### 目录
1. [先决条件](#先决条件)
2. [安装](#安装)
3. [配置](#配置)
4. [与 OpenClaw 集成](#与-openclaw-集成)
5. [测试](#测试)
6. [故障排除](#故障排除)

### 先决条件

安装插件之前，请确保您具备：

- 已安装并运行的 OpenClaw
- Node.js (v14 或更高版本) 和 npm
- 具有 API 访问权限的 RunningHub 账户
- 来自 RunningHub 的有效 API 密钥和工作流 ID

### 安装

#### 方法 1：直接安装

1. 克隆或下载此仓库到您的 OpenClaw 工作区：
```bash
cd ~/.openclaw/workspace
git clone https://github.com/gordonkwokgz/openclaw-runninghub-plugin.git
# 或下载并提取 zip 文件
```

2. 导航到插件目录并安装依赖项：
```bash
cd openclaw-runninghub-plugin
npm install
```

3. 设置配置文件：
```bash
cp runninghub-config-template.json runninghub-config.json
```

#### 方法 2：手动安装

1. 在您的 OpenClaw 工作区中为插件创建一个新目录
2. 将所有插件文件复制到该目录
3. 在目录中运行 `npm install`

### 配置

1. 使用您的凭据编辑 `runninghub-config.json` 文件：
```json
{
  "apiKey": "YOUR_API_KEY_HERE",
  "defaultWorkflowId": "YOUR_WORKFLOW_ID_HERE",
  "baseUrl": "https://www.runninghub.cn"
}
```

2. 将 `YOUR_API_KEY_HERE` 替换为您的实际 RunningHub API 密钥
3. 将 `YOUR_WORKFLOW_ID_HERE` 替换为您的所需工作流 ID

**注意**：保护好您的 API 密钥，切勿将其提交到版本控制中。

### 与 OpenClaw 集成

#### 选项 1：直接插件加载

将插件添加到您的 OpenClaw 配置：

1. 找到您的 OpenClaw 配置文件（通常是 `~/.openclaw/config.json` 或类似文件）
2. 将插件添加到插件数组：
```json
{
  "plugins": [
    {
      "name": "runninghub",
      "path": "./workspace/openclaw-runninghub-plugin/runninghub-plugin.js",
      "enabled": true
    }
  ]
}
```

#### 选项 2：动态加载

您也可以在 OpenClaw 实例中动态加载插件：

```javascript
const RunningHubPlugin = require('./workspace/openclaw-runninghub-plugin/runninghub-plugin.js');
const runningHubPlugin = new RunningHubPlugin();

// 初始化插件
await runningHubPlugin.initialize();

// 将插件注册到 OpenClaw 的命令系统
// 实现取决于您的特定 OpenClaw 设置
```

#### 选项 3：模块注册

如果您的 OpenClaw 设置支持动态模块加载，您可以按以下方式注册插件：

1. 将插件文件放在您的 OpenClaw 模块目录中
2. 在您的启动脚本中注册插件：
```javascript
// 在您的 OpenClaw 启动脚本中
const registerModule = require('./module-system'); // 根据需要调整路径
const RunningHubPlugin = require('./modules/openclaw-runninghub-plugin/runninghub-plugin.js');

registerModule(new RunningHubPlugin());
```

### 测试

安装和配置后，测试插件：

1. **检查插件状态**：
   ```
   runninghub-status
   ```

2. **列出可用工作流**（如果已实现）：
   ```
   runninghub-list
   ```

3. **执行简单工作流**：
   ```
   runninghub-execute YOUR_WORKFLOW_ID
   ```

4. **执行带参数的工作流**：
   ```
   runninghub-execute YOUR_WORKFLOW_ID '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "test prompt"}]}'
   ```

### 使用示例

#### 基础用法
```
runninghub-status
runninghub-list
runninghub-help
```

#### 高级用法
```
# 使用自定义参数执行工作流
runninghub-execute 123456789 '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "a beautiful landscape"}], "instanceType": "default"}'

# 刷新工作流列表
runninghub-list --refresh
```

### 故障排除

#### 常见问题

1. **找不到插件**：确保您的 OpenClaw 配置中的插件路径正确
2. **身份验证错误**：验证您的 API 密钥是否正确且未过期
3. **工作流执行失败**：检查您的工作流 ID 是否有效且工作流在浏览器中运行
4. **配置错误**：确保您的 `runninghub-config.json` 文件是有效的 JSON

#### 调试步骤

1. 检查插件配置文件格式：
   ```bash
   node -e "console.log(JSON.parse(require('fs').readFileSync('./runninghub-config.json')))"
   ```

2. 独立测试配置：
   ```bash
   node -e "
   const { createRunningHubIntegration } = require('./advanced-runninghub-integration.js');
   (async () => {
     try {
       const integration = await createRunningHubIntegration();
       console.log('Integration successful');
     } catch (error) {
       console.error('Integration failed:', error.message);
     }
   })();
   "
   ```

3. 检查 OpenClaw 日志中与插件相关的任何错误消息。

### 安全注意事项

- 使用适当的文件权限安全地存储您的配置文件
- 切勿将您的 API 密钥提交到版本控制
- 定期监控您的 RunningHub 使用情况和账单
- 在生产环境中部署前审查插件代码

### 更新插件

要更新插件：

1. 备份您的配置：
   ```bash
   cp runninghub-config.json /backup/location/
   ```

2. 更新插件文件：
   ```bash
   cd openclaw-runninghub-plugin
   git pull origin main  # 如果使用 git
   # 或下载新版本
   ```

3. 如需要重新安装依赖项：
   ```bash
   npm install
   ```

4. 恢复您的配置：
   ```bash
   cp /backup/location/runninghub-config.json .
   ```

5. 重启 OpenClaw 以加载更新的插件。

### 支持

如果您遇到插件问题：

1. 查看 [README](./README.md) 获取使用说明
2. 验证您的 RunningHub 凭据是否正确
3. 确保您的 OpenClaw 安装兼容
4. 如有需要，在 GitHub 存储库中提交问题

---

## OpenClaw RunningHub Plugin Deployment Guide

This guide explains how to integrate the RunningHub plugin into your OpenClaw system.

### Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Integration with OpenClaw](#integration-with-openclaw)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

### Prerequisites

Before installing the plugin, ensure you have:

- OpenClaw installed and running
- Node.js (v14 or higher) and npm
- RunningHub account with API access
- Valid API key and workflow ID from RunningHub

### Installation

#### Method 1: Direct Installation

1. Clone or download this repository to your OpenClaw workspace:
```bash
cd ~/.openclaw/workspace
git clone https://github.com/gordonkwokgz/openclaw-runninghub-plugin.git
# or download and extract the zip file
```

2. Navigate to the plugin directory and install dependencies:
```bash
cd openclaw-runninghub-plugin
npm install
```

3. Set up the configuration file:
```bash
cp runninghub-config-template.json runninghub-config.json
```

#### Method 2: Manual Installation

1. Create a new directory for the plugin in your OpenClaw workspace
2. Copy all the plugin files to that directory
3. Run `npm install` in the directory

### Configuration

1. Edit the `runninghub-config.json` file with your credentials:
```json
{
  "apiKey": "YOUR_API_KEY_HERE",
  "defaultWorkflowId": "YOUR_WORKFLOW_ID_HERE",
  "baseUrl": "https://www.runninghub.cn"
}
```

2. Replace `YOUR_API_KEY_HERE` with your actual RunningHub API key
3. Replace `YOUR_WORKFLOW_ID_HERE` with your desired workflow ID

**Note**: Keep your API key secure and never commit it to version control.

### Integration with OpenClaw

#### Option 1: Direct Plugin Loading

Add the plugin to your OpenClaw configuration:

1. Locate your OpenClaw configuration file (usually `~/.openclaw/config.json` or similar)
2. Add the plugin to the plugins array:
```json
{
  "plugins": [
    {
      "name": "runninghub",
      "path": "./workspace/openclaw-runninghub-plugin/runninghub-plugin.js",
      "enabled": true
    }
  ]
}
```

#### Option 2: Dynamic Loading

You can also load the plugin dynamically in your OpenClaw instance:

```javascript
const RunningHubPlugin = require('./workspace/openclaw-runninghub-plugin/runninghub-plugin.js');
const runningHubPlugin = new RunningHubPlugin();

// Initialize the plugin
await runningHubPlugin.initialize();

// Register the plugin with OpenClaw's command system
// Implementation depends on your specific OpenClaw setup
```

#### Option 3: Module Registration

If your OpenClaw setup supports dynamic module loading, you can register the plugin as follows:

1. Place the plugin files in your OpenClaw modules directory
2. Register the plugin in your startup script:
```javascript
// In your OpenClaw startup script
const registerModule = require('./module-system'); // Adjust path as needed
const RunningHubPlugin = require('./modules/openclaw-runninghub-plugin/runninghub-plugin.js');

registerModule(new RunningHubPlugin());
```

### Testing

After installation and configuration, test the plugin:

1. **Check plugin status**:
   ```
   runninghub-status
   ```

2. **List available workflows** (if implemented):
   ```
   runninghub-list
   ```

3. **Execute a simple workflow**:
   ```
   runninghub-execute YOUR_WORKFLOW_ID
   ```

4. **Execute with parameters**:
   ```
   runninghub-execute YOUR_WORKFLOW_ID '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "test prompt"}]}'
   ```

### Usage Examples

#### Basic Usage
```
runninghub-status
runninghub-list
runninghub-help
```

#### Advanced Usage
```
# Execute workflow with custom parameters
runninghub-execute 123456789 '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "a beautiful landscape"}], "instanceType": "default"}'

# Refresh workflow list
runninghub-list --refresh
```

### Troubleshooting

#### Common Issues

1. **Plugin not found**: Ensure the plugin path is correct in your OpenClaw configuration
2. **Authentication errors**: Verify your API key is correct and hasn't expired
3. **Workflow execution fails**: Check that your workflow ID is valid and the workflow runs in the browser
4. **Configuration errors**: Ensure your `runninghub-config.json` file is valid JSON

#### Debugging Steps

1. Check the plugin configuration file format:
   ```bash
   node -e "console.log(JSON.parse(require('fs').readFileSync('./runninghub-config.json')))"
   ```

2. Test the configuration independently:
   ```bash
   node -e "
   const { createRunningHubIntegration } = require('./advanced-runninghub-integration.js');
   (async () => {
     try {
       const integration = await createRunningHubIntegration();
       console.log('Integration successful');
     } catch (error) {
       console.error('Integration failed:', error.message);
     }
   })();
   "
   ```

3. Check OpenClaw logs for any error messages related to the plugin.

### Security Considerations

- Store your configuration file securely with appropriate file permissions
- Never commit your API key to version control
- Regularly monitor your RunningHub usage and billing
- Review the plugin code before deployment in production environments

### Updating the Plugin

To update the plugin:

1. Backup your configuration:
   ```bash
   cp runninghub-config.json /backup/location/
   ```

2. Update the plugin files:
   ```bash
   cd openclaw-runninghub-plugin
   git pull origin main  # if using git
   # or download the new version
   ```

3. Reinstall dependencies if needed:
   ```bash
   npm install
   ```

4. Restore your configuration:
   ```bash
   cp /backup/location/runninghub-config.json .
   ```

5. Restart OpenClaw to load the updated plugin.

### Support

If you encounter issues with the plugin:

1. Check the [README](./README.md) for usage instructions
2. Verify your RunningHub credentials are correct
3. Ensure your OpenClaw installation is compatible
4. File an issue in the GitHub repository if needed

---

This guide provides a comprehensive overview of deploying the RunningHub plugin in your OpenClaw environment. Adjust paths and configurations according to your specific OpenClaw setup.
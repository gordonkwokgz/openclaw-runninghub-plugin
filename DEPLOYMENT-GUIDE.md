# OpenClaw RunningHub Plugin Deployment Guide

This guide explains how to integrate the RunningHub plugin into your OpenClaw system.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Integration with OpenClaw](#integration-with-openclaw)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before installing the plugin, ensure you have:

- OpenClaw installed and running
- Node.js (v14 or higher) and npm
- RunningHub account with API access
- Valid API key and workflow ID from RunningHub

## Installation

### Method 1: Direct Installation

1. Clone or download this repository to your OpenClaw workspace:
```bash
cd ~/.openclaw/workspace
git clone https://github.com/[your-username]/openclaw-runninghub-plugin.git
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

### Method 2: Manual Installation

1. Create a new directory for the plugin in your OpenClaw workspace
2. Copy all the plugin files to that directory
3. Run `npm install` in the directory

## Configuration

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

## Integration with OpenClaw

### Option 1: Direct Plugin Loading

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

### Option 2: Dynamic Loading

You can also load the plugin dynamically in your OpenClaw instance:

```javascript
const RunningHubPlugin = require('./workspace/openclaw-runninghub-plugin/runninghub-plugin.js');
const runningHubPlugin = new RunningHubPlugin();

// Initialize the plugin
await runningHubPlugin.initialize();

// Register the plugin with OpenClaw's command system
// Implementation depends on your specific OpenClaw setup
```

### Option 3: Module Registration

If your OpenClaw setup supports dynamic module loading, you can register the plugin as follows:

1. Place the plugin files in your OpenClaw modules directory
2. Register the plugin in your startup script:
```javascript
// In your OpenClaw startup script
const registerModule = require('./module-system'); // Adjust path as needed
const RunningHubPlugin = require('./modules/openclaw-runninghub-plugin/runninghub-plugin.js');

registerModule(new RunningHubPlugin());
```

## Testing

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

## Usage Examples

### Basic Usage
```
runninghub-status
runninghub-list
runninghub-help
```

### Advanced Usage
```
# Execute workflow with custom parameters
runninghub-execute 123456789 '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "a beautiful landscape"}], "instanceType": "default"}'

# Refresh workflow list
runninghub-list --refresh
```

## Troubleshooting

### Common Issues

1. **Plugin not found**: Ensure the plugin path is correct in your OpenClaw configuration
2. **Authentication errors**: Verify your API key is correct and hasn't expired
3. **Workflow execution fails**: Check that your workflow ID is valid and the workflow runs in the browser
4. **Configuration errors**: Ensure your `runninghub-config.json` file is valid JSON

### Debugging Steps

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

## Security Considerations

- Store your configuration file securely with appropriate file permissions
- Never commit your API key to version control
- Regularly monitor your RunningHub usage and billing
- Review the plugin code before deployment in production environments

## Updating the Plugin

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

## Support

If you encounter issues with the plugin:

1. Check the [README](./README.md) for usage instructions
2. Verify your RunningHub credentials are correct
3. Ensure your OpenClaw installation is compatible
4. File an issue in the GitHub repository if needed

---

This guide provides a comprehensive overview of deploying the RunningHub plugin in your OpenClaw environment. Adjust paths and configurations according to your specific OpenClaw setup.
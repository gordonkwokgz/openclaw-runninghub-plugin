# OpenClaw RunningHub Plugin

An OpenClaw plugin that integrates with RunningHub API to enable cloud-based ComfyUI workflows with GPU acceleration.

## Features

- 🚀 Direct integration with RunningHub's cloud GPU services
- 🎨 Support for ComfyUI workflow execution
- ⚡ Fast image generation using cloud GPUs
- 🔧 Dynamic parameter modification via nodeInfoList
- 📋 Task status monitoring and result retrieval
- 🛠️ Command-line interface for OpenClaw

## Prerequisites

- [OpenClaw](https://github.com/openclaw/openclaw) installed and running
- RunningHub account with API access
- Valid API key from RunningHub
- Published workflow ID on RunningHub platform

## Installation

### 1. Clone or Download the Plugin

```bash
# Clone the repository
git clone https://github.com/[your-username]/openclaw-runninghub-plugin.git
cd openclaw-runninghub-plugin

# Or download and extract the zip file
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure the Plugin

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

#### Getting Your Credentials

1. **API Key**: 
   - Log in to your RunningHub account
   - Navigate to the API section in your dashboard
   - Copy your 32-character API key

2. **Workflow ID**:
   - Go to your desired workflow on RunningHub
   - The URL will look like: `https://www.runninghub.cn/#/workflow/WORKFLOW_ID`
   - Extract the WORKFLOW_ID from the URL

⚠️ **Important**: Make sure your workflow has been run successfully at least once in the browser before using it via the API.

## Usage

### In OpenClaw Environment

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

### Programmatic Usage

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

## Configuration Options

The plugin supports the following configuration options in `runninghub-config.json`:

- `apiKey`: Your RunningHub API key (required)
- `defaultWorkflowId`: Default workflow to use when none is specified (optional)
- `baseUrl`: RunningHub API base URL (usually remains as default)

## API Parameters

### nodeInfoList Structure

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

### Instance Types

- `"default"`: Standard instance with 24GB VRAM
- `"plus"`: High-performance instance with 48GB VRAM (if available)

## Troubleshooting

### Common Issues

1. **TOKEN_INVALID (412)**: Usually indicates incorrect API key or invalid endpoint format
2. **INVALID_WORKFLOW_ID**: Verify your workflow ID is correct and the workflow is published
3. **Invalid node info (803)**: Check that your nodeInfoList parameters match your workflow structure
4. **INSUFFICIENT_BALANCE**: Ensure your RunningHub account has sufficient credits

### Debugging Tips

- Make sure your workflow runs successfully in the browser before using the API
- Verify all node IDs and field names match your specific workflow
- Start with empty nodeInfoList to test basic functionality
- Check your API key hasn't expired or been revoked

## Security Considerations

- Never commit your actual API key to version control
- Store your configuration file securely
- Review permissions required by the plugin
- Monitor your RunningHub usage regularly

## License

MIT License - See LICENSE file for details.

## Contributing

Feel free to submit issues and enhancement requests. Pull requests are welcome!

---

This plugin enables seamless integration between OpenClaw and RunningHub's cloud GPU services, providing powerful AI workflow capabilities.
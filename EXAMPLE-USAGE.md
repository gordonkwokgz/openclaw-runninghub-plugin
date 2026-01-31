# Example Usage

Here are some practical examples of how to use the RunningHub plugin with OpenClaw.

## Basic Setup

First, ensure you have:

1. A RunningHub account with API access
2. Your API key from the RunningHub dashboard
3. A published workflow ID (e.g., from URL: `https://www.runninghub.cn/#/workflow/WORKFLOW_ID`)

## Configuration

Create your `runninghub-config.json`:

```json
{
  "apiKey": "your_32_character_api_key_here",
  "defaultWorkflowId": "your_workflow_id_here",
  "baseUrl": "https://www.runninghub.cn"
}
```

## Command Examples

### Check Status
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

### List Workflows
```
runninghub-list
```

### Execute a Workflow (Basic)
```
runninghub-execute 123456789
```

### Execute a Workflow with Custom Parameters
```
runninghub-execute 123456789 '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "A beautiful landscape at sunset"}]}'
```

### Execute with Additional Options
```
runninghub-execute 123456789 '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "A cyberpunk city"}], "instanceType": "default", "addMetadata": false}'
```

## Real-World Examples

### Example 1: Text-to-Image Generation
```
runninghub-execute 2014002855044190210 '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "A majestic dragon flying over a medieval castle"}]}'
```

### Example 2: Using Multiple Node Parameters
```
runninghub-execute 123456789 '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "A beautiful portrait"}, {"nodeId": "11", "fieldName": "steps", "fieldValue": "30"}]}'
```

### Example 3: High-Performance Instance
```
runninghub-execute 123456789 '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "Detailed architectural rendering"}], "instanceType": "plus"}'
```

## Expected Responses

### Successful Execution Response
```
🚀 Workflow execution initiated!
🆔 Workflow ID: 123456789
⏱️ Request processed in: 0.52s
🏷️  Task ID: 2017614664518733825
📊 Status: RUNNING
```

### Failed Execution Response
```
❌ Error executing workflow: Invalid node info, please match workflow requirements
```

## Best Practices

1. **Start Simple**: Begin with empty `nodeInfoList` to test basic connectivity
2. **Verify Workflow**: Ensure your workflow runs successfully in the browser first
3. **Node Mapping**: Carefully identify node IDs and field names in your specific workflow
4. **Monitor Usage**: Keep track of your RunningHub credit consumption
5. **Error Handling**: Pay attention to error codes for troubleshooting

## Common Node Field Names

Different workflows may use different field names. Common ones include:
- `text` - For text prompts
- `positive` - For positive conditioning
- `negative` - For negative conditioning
- `prompt` - General prompt field
- `seed` - Random seed value
- `steps` - Number of inference steps
- `cfg_scale` - Configuration scale

Always verify the correct field names in your specific workflow.
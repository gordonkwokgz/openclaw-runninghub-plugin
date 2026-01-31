/**
 * RunningHub Plugin for OpenClaw
 * Integrates RunningHub's cloud ComfyUI workflows into OpenClaw
 */

const { AdvancedRunningHubIntegration, createRunningHubIntegration } = require('./advanced-runninghub-integration.js');
const path = require('path');

class RunningHubPlugin {
  constructor(options = {}) {
    this.name = 'runninghub';
    this.version = '1.0.0';
    this.description = 'RunningHub Cloud Workflow Integration for OpenClaw';
    
    this.integration = null;
    this.configPath = options.configPath || './runninghub-config.json';
    this.initialized = false;
  }

  /**
   * Initialize the plugin
   */
  async initialize() {
    try {
      this.integration = new AdvancedRunningHubIntegration(this.configPath);
      await this.integration.initialize();
      this.initialized = true;
      console.log('RunningHub plugin initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize RunningHub plugin:', error.message);
      return false;
    }
  }

  /**
   * Check if plugin is ready
   */
  isReady() {
    return this.initialized && this.integration !== null;
  }

  /**
   * Execute a workflow via RunningHub
   */
  async executeWorkflow(workflowId, inputs, options = {}) {
    if (!this.isReady()) {
      throw new Error('RunningHub plugin not initialized. Call initialize() first.');
    }

    try {
      const result = await this.integration.executeWorkflowWithResult(workflowId, inputs, options);
      return result;
    } catch (error) {
      console.error('Error executing workflow:', error);
      throw error;
    }
  }

  /**
   * Execute default workflow
   */
  async executeDefaultWorkflow(inputs, options = {}) {
    if (!this.isReady()) {
      throw new Error('RunningHub plugin not initialized. Call initialize() first.');
    }

    try {
      const result = await this.integration.executeWorkflowWithResult(null, inputs, options);
      return result;
    } catch (error) {
      console.error('Error executing default workflow:', error);
      throw error;
    }
  }

  /**
   * Get account information
   */
  async getAccountInfo() {
    if (!this.isReady()) {
      throw new Error('RunningHub plugin not initialized. Call initialize() first.');
    }

    try {
      const accountData = await this.integration.monitorAccount();
      return accountData;
    } catch (error) {
      console.error('Error getting account info:', error);
      throw error;
    }
  }

  /**
   * List available workflows
   */
  async listWorkflows(refresh = false) {
    if (!this.isReady()) {
      throw new Error('RunningHub plugin not initialized. Call initialize() first.');
    }

    try {
      const workflows = await this.integration.getCachedWorkflows(refresh);
      return workflows;
    } catch (error) {
      console.error('Error listing workflows:', error);
      throw error;
    }
  }

  /**
   * Handle OpenClaw command: runninghub-status
   */
  async handleStatusCommand(args) {
    if (!this.isReady()) {
      return '❌ RunningHub plugin not initialized. Please check configuration.';
    }

    try {
      const health = await this.integration.healthCheck();
      if (health.status === 'healthy') {
        const accountData = await this.getAccountInfo();
        return `✅ RunningHub Connection: Healthy\n` +
               `👤 Account Type: ${accountData.account?.accountType || 'Unknown'}\n` +
               `💰 Balance: ${accountData.balance?.available || 'N/A'}\n` +
               `🕒 Last Checked: ${health.timestamp}`;
      } else {
        return `❌ RunningHub Connection: Unhealthy\nError: ${health.error}`;
      }
    } catch (error) {
      return `❌ RunningHub Status Error: ${error.message}`;
    }
  }

  /**
   * Handle OpenClaw command: runninghub-execute
   */
  async handleExecuteCommand(args) {
    if (!this.isReady()) {
      return '❌ RunningHub plugin not initialized. Please check configuration.';
    }

    try {
      // Parse arguments - expecting workflowId and JSON inputs
      if (args.length === 0) {
        return '❌ Usage: runninghub-execute <workflowId> [inputs_json]\nExample: runninghub-execute 123456789 \'{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "a cat"}]}\'';
      }

      const workflowId = args[0];
      const inputsStr = args.slice(1).join(' ');
      let inputs = {};

      // If inputs are provided, parse them
      if (inputsStr.trim() !== '') {
        try {
          inputs = JSON.parse(inputsStr);
        } catch (parseError) {
          return `❌ Invalid JSON inputs: ${parseError.message}`;
        }
      }

      // Execute the workflow
      const startTime = Date.now();
      const result = await this.executeWorkflow(workflowId, inputs);
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      // Format response
      let response = `🚀 Workflow execution initiated!\n`;
      response += `🆔 Workflow ID: ${workflowId}\n`;
      response += `⏱️ Request processed in: ${duration}s\n`;
      response += `🏷️  Task ID: ${result.taskId || 'N/A'}\n`;
      response += `📊 Status: ${result.status || 'N/A'}\n`;

      if (result.errorCode) {
        response += `⚠️  Error Code: ${result.errorCode}\n`;
        response += `📝 Error Message: ${result.errorMessage}\n`;
      }

      return response;
    } catch (error) {
      return `❌ Error executing workflow: ${error.message}`;
    }
  }

  /**
   * Handle OpenClaw command: runninghub-list
   */
  async handleListCommand(args) {
    if (!this.isReady()) {
      return '❌ RunningHub plugin not initialized. Please check configuration.';
    }

    try {
      const refresh = args.includes('--refresh');
      const workflows = await this.listWorkflows(refresh);

      if (!workflows || workflows.length === 0) {
        return '📋 No workflows found.';
      }

      let response = `📋 Available Workflows (${workflows.length} total):\n\n`;
      for (let i = 0; i < Math.min(workflows.length, 10); i++) { // Limit to first 10
        const wf = workflows[i];
        response += `• ID: ${wf.id || wf.workflowId || 'N/A'}\n`;
        response += `  Name: ${wf.name || wf.title || 'Untitled'}\n`;
        response += `  Description: ${wf.description || 'No description'}\n\n`;
      }

      if (workflows.length > 10) {
        response += `... and ${workflows.length - 10} more workflows.`;
      }

      return response;
    } catch (error) {
      return `❌ Error listing workflows: ${error.message}`;
    }
  }

  /**
   * Handle OpenClaw command: runninghub-help
   */
  async handleHelpCommand(args) {
    return `🤖 RunningHub Plugin Commands:\n\n` +
           `• \`runninghub-status\` - Check connection status\n` +
           `• \`runninghub-list [--refresh]\` - List available workflows\n` +
           `• \`runninghub-execute <workflowId> [inputs_json]\` - Execute a workflow\n` +
           `• \`runninghub-help\` - Show this help message\n\n` +
           `Examples:\n` +
           `  runninghub-execute 123456789\n` +
           `  runninghub-execute 123456789 '{"nodeInfoList": [{"nodeId": "10", "fieldName": "text", "fieldValue": "a beautiful landscape"}]}'\n` +
           `  runninghub-list --refresh`;
  }

  /**
   * Process incoming command
   */
  async processCommand(command, args) {
    switch (command.toLowerCase()) {
      case 'runninghub-status':
        return await this.handleStatusCommand(args);
      case 'runninghub-execute':
        return await this.handleExecuteCommand(args);
      case 'runninghub-list':
        return await this.handleListCommand(args);
      case 'runninghub-help':
        return await this.handleHelpCommand(args);
      default:
        return `Unknown command: ${command}. Use 'runninghub-help' for available commands.`;
    }
  }

  /**
   * Get plugin info for OpenClaw registration
   */
  getPluginInfo() {
    return {
      name: this.name,
      version: this.version,
      description: this.description,
      commands: [
        { name: 'runninghub-status', description: 'Check RunningHub connection status' },
        { name: 'runninghub-list', description: 'List available workflows' },
        { name: 'runninghub-execute', description: 'Execute a workflow with given inputs' },
        { name: 'runninghub-help', description: 'Show RunningHub plugin help' }
      ]
    };
  }
}

// Export the plugin class
module.exports = RunningHubPlugin;

// Example usage
if (require.main === module) {
  (async () => {
    const plugin = new RunningHubPlugin();
    const success = await plugin.initialize();
    
    if (success) {
      console.log('Plugin initialized successfully');
      console.log(plugin.getPluginInfo());
    } else {
      console.log('Plugin initialization failed');
    }
  })();
}
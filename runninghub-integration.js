/**
 * RunningHub API Integration Module
 * This module provides functions to interact with the RunningHub API
 * Based on official documentation: https://www.runninghub.cn/runninghub-api-doc-cn/
 */

class RunningHubAPI {
  constructor(apiKey, baseUrl = 'https://api.runninghub.cn') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  /**
   * Execute a workflow by ID
   * Note: Target workflow must have been manually run successfully at least once on the web platform
   * @param {string} workflowId - The workflow ID to execute (e.g., 1850925505116598274 from https://www.runninghub.cn/#/workflow/1850925505116598274)
   * @param {Object} inputs - Input parameters for the workflow
   * @returns {Promise<Object>} Execution result
   */
  async executeWorkflow(workflowId, inputs = {}) {
    try {
      // Use the correct API endpoint from the official documentation
      const response = await fetch(`${this.baseUrl}/openapi/v2/run/workflow/${workflowId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          addMetadata: false,
          nodeInfoList: inputs.nodeInfoList || [],
          instanceType: inputs.instanceType || "default",
          usePersonalQueue: inputs.usePersonalQueue || false,
          webhookUrl: inputs.webhookUrl || ""
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error executing workflow:', error);
      throw error;
    }
  }

  /**
   * Get workflow execution status
   * @param {string} taskId - The task ID returned from executeWorkflow
   * @returns {Promise<Object>} Task status
   */
  async getTaskStatus(taskId) {
    try {
      // Using the correct v2 endpoint for task status from the documentation
      const response = await fetch(`${this.baseUrl}/openapi/v2/query`, {
        method: 'POST',  // According to documentation, it's a POST request
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          taskId: taskId
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting task status:', error);
      throw error;
    }
  }

  /**
   * Get user account info
   * @returns {Promise<Object>} Account information
   */
  async getAccountInfo() {
    try {
      // Note: Account info endpoint may not exist in v2, using v1 for now
      // If this doesn't work, we'll need to use workflow execution to test the API
      const response = await fetch(`${this.baseUrl}/api/v1/account/info`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting account info:', error);
      throw error;
    }
  }

  /**
   * List available workflows
   * @returns {Promise<Array>} List of workflows
   */
  async listWorkflows() {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/workflow/list`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error listing workflows:', error);
      throw error;
    }
  }

  /**
   * Get account balance and usage info
   * @returns {Promise<Object>} Balance and usage information
   */
  async getBalance() {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/account/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  /**
   * Get workflow result by task ID (with polling support)
   * @param {string} taskId - The task ID to check
   * @param {number} maxAttempts - Maximum number of polling attempts (default: 60)
   * @param {number} delayMs - Delay between polling attempts in milliseconds (default: 5000)
   * @returns {Promise<Object>} Final task result
   */
  async waitForResult(taskId, maxAttempts = 60, delayMs = 5000) {
    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.getTaskStatus(taskId);
      
      if (status.status === 'completed') {
        return status;
      } else if (status.status === 'failed' || status.status === 'error') {
        throw new Error(`Task failed: ${status.error || 'Unknown error'}`);
      }
      
      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    
    throw new Error(`Task did not complete within ${maxAttempts} attempts`);
  }
}

// Example usage function
async function exampleUsage() {
  // Note: Replace with actual API key and workflow ID
  const runningHub = new RunningHubAPI('YOUR_API_KEY_HERE');
  
  try {
    // Get account info
    const accountInfo = await runningHub.getAccountInfo();
    console.log('Account Info:', accountInfo);
    
    // Get account balance
    const balance = await runningHub.getBalance();
    console.log('Balance Info:', balance);
    
    // List workflows
    const workflows = await runningHub.listWorkflows();
    console.log('Available Workflows:', workflows);
    
    // Execute a workflow (replace with actual workflow ID and inputs)
    // const result = await runningHub.executeWorkflow('WORKFLOW_ID_HERE', {
    //   prompt: 'Example prompt',
    //   image_size: '512x512'
    // });
    // console.log('Execution Result:', result);
    
  } catch (error) {
    console.error('Example usage error:', error);
  }
}

module.exports = RunningHubAPI;

// Uncomment to run example
// exampleUsage();
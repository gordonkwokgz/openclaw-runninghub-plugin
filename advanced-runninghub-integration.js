/**
 * Advanced RunningHub Integration for OpenClaw
 * Provides sophisticated integration with RunningHub's cloud ComfyUI workflows
 */

const fs = require('fs').promises;
const path = require('path');

class AdvancedRunningHubIntegration {
  constructor(configPath = './runninghub-config.json') {
    this.configPath = configPath;
    this.apiClient = null;
    this.config = null;
  }

  /**
   * Initialize the integration
   */
  async initialize() {
    await this.loadConfig();
    await this.validateConfig();
    this.createApiClient();
  }

  /**
   * Load configuration from file
   */
  async loadConfig() {
    try {
      const configData = await fs.readFile(this.configPath, 'utf8');
      this.config = JSON.parse(configData);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('Configuration file not found, initializing with defaults...');
        await this.initializeConfig();
      } else {
        throw error;
      }
    }
  }

  /**
   * Initialize configuration with default values
   */
  async initializeConfig() {
    const defaultConfig = {
      apiKey: 'YOUR_API_KEY_HERE',
      defaultWorkflowId: 'YOUR_WORKFLOW_ID_HERE',
      baseUrl: 'https://www.runninghub.cn',
      pollingInterval: 5000,  // 5 seconds
      maxPollingAttempts: 60, // 5 minutes total
      defaultTimeout: 300000   // 5 minutes in ms
    };

    await fs.writeFile(this.configPath, JSON.stringify(defaultConfig, null, 2));
    console.log(`Configuration file created at ${this.configPath}`);
    console.log('Please update the configuration with your actual API key and workflow ID.');
    this.config = defaultConfig;
  }

  /**
   * Validate configuration values
   */
  async validateConfig() {
    if (!this.config.apiKey || this.config.apiKey === 'YOUR_API_KEY_HERE') {
      throw new Error('Please update your API key in the configuration file before using the integration.');
    }

    if (!this.config.defaultWorkflowId || this.config.defaultWorkflowId === 'YOUR_WORKFLOW_ID_HERE') {
      throw new Error('Please update your workflow ID in the configuration file before using the integration.');
    }

    if (!this.config.baseUrl) {
      this.config.baseUrl = 'https://api.runninghub.cn';
    }
  }

  /**
   * Create API client instance
   */
  createApiClient() {
    // Dynamically import the RunningHubAPI class
    const RunningHubAPI = require('./runninghub-integration.js');
    this.apiClient = new RunningHubAPI(this.config.apiKey, this.config.baseUrl);
  }

  /**
   * Execute a workflow with comprehensive error handling and result waiting
   */
  async executeWorkflowWithResult(workflowId = null, inputs = {}, options = {}) {
    if (!this.apiClient) {
      throw new Error('Integration not initialized. Call initialize() first.');
    }

    const targetWorkflowId = workflowId || this.config.defaultWorkflowId;
    const pollingInterval = options.pollingInterval || this.config.pollingInterval;
    const maxAttempts = options.maxPollingAttempts || this.config.maxPollingAttempts;

    try {
      // Execute the workflow
      console.log(`Executing workflow ${targetWorkflowId}...`);
      const executionResult = await this.apiClient.executeWorkflow(targetWorkflowId, inputs);

      if (!executionResult.taskId) {
        throw new Error('Workflow execution did not return a valid task ID');
      }

      console.log(`Task started with ID: ${executionResult.taskId}`);

      // Wait for the result
      console.log('Waiting for workflow completion...');
      const finalResult = await this.apiClient.waitForResult(
        executionResult.taskId,
        maxAttempts,
        pollingInterval
      );

      console.log('Workflow completed successfully');
      return finalResult;
    } catch (error) {
      console.error('Error executing workflow:', error);
      throw error;
    }
  }

  /**
   * Execute multiple workflows in parallel (based on account concurrency limits)
   */
  async executeWorkflowsParallel(workflowSpecs) {
    if (!this.apiClient) {
      throw new Error('Integration not initialized. Call initialize() first.');
    }

    // Get account info to determine concurrency limits
    const accountInfo = await this.apiClient.getAccountInfo();
    
    // Determine safe concurrency level
    // Note: This is simplified - real implementation would check account type
    const maxConcurrent = accountInfo.accountType === 'enterprise' ? 50 : 1;
    
    console.log(`Executing up to ${maxConcurrent} workflows concurrently...`);

    // Split workflow specs into batches based on concurrency limit
    const batches = [];
    for (let i = 0; i < workflowSpecs.length; i += maxConcurrent) {
      batches.push(workflowSpecs.slice(i, i + maxConcurrent));
    }

    const allResults = [];

    // Process each batch
    for (const batch of batches) {
      const batchPromises = batch.map(spec => 
        this.executeWorkflowWithResult(spec.workflowId, spec.inputs, spec.options)
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      allResults.push(...batchResults);
      
      // Small delay between batches to be respectful to the API
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return allResults;
  }

  /**
   * Monitor account usage and balance
   */
  async monitorAccount() {
    if (!this.apiClient) {
      throw new Error('Integration not initialized. Call initialize() first.');
    }

    try {
      const [accountInfo, balanceInfo] = await Promise.all([
        this.apiClient.getAccountInfo(),
        this.apiClient.getBalance()
      ]);

      return {
        account: accountInfo,
        balance: balanceInfo,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error monitoring account:', error);
      throw error;
    }
  }

  /**
   * Get and cache available workflows
   */
  async getCachedWorkflows(refresh = false) {
    const cachePath = './workflow-cache.json';
    
    if (!refresh) {
      try {
        const cacheData = await fs.readFile(cachePath, 'utf8');
        const cache = JSON.parse(cacheData);
        
        // Check if cache is still valid (less than 1 hour old)
        const cacheAge = Date.now() - new Date(cache.timestamp).getTime();
        if (cacheAge < 3600000) { // 1 hour in milliseconds
          return cache.workflows;
        }
      } catch (error) {
        // Cache doesn't exist or is invalid, continue to fetch fresh data
      }
    }

    // Fetch fresh data
    if (!this.apiClient) {
      throw new Error('Integration not initialized. Call initialize() first.');
    }

    const workflows = await this.apiClient.listWorkflows();
    
    // Cache the results
    await fs.writeFile(cachePath, JSON.stringify({
      workflows,
      timestamp: new Date().toISOString()
    }, null, 2));

    return workflows;
  }

  /**
   * Update configuration dynamically
   */
  async updateConfig(updates) {
    this.config = { ...this.config, ...updates };
    
    await fs.writeFile(this.configPath, JSON.stringify(this.config, null, 2));
    console.log('Configuration updated successfully');
    
    // Recreate API client if credentials changed
    if (updates.apiKey || updates.baseUrl) {
      this.createApiClient();
    }
  }

  /**
   * Perform health check of the integration
   */
  async healthCheck() {
    try {
      const accountInfo = await this.apiClient.getAccountInfo();
      return {
        status: 'healthy',
        accountInfo: {
          accountId: accountInfo.accountId,
          accountType: accountInfo.accountType,
          // Don't expose sensitive info like balance directly
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

/**
 * Helper function to create and initialize the integration
 */
async function createRunningHubIntegration(configPath) {
  const integration = new AdvancedRunningHubIntegration(configPath);
  await integration.initialize();
  return integration;
}

// Example usage within OpenClaw context
async function exampleUsage() {
  try {
    // Create and initialize the integration
    const rhIntegration = await createRunningHubIntegration();
    
    console.log('RunningHub integration initialized successfully');
    
    // Example: Execute a single workflow
    /*
    const result = await rhIntegration.executeWorkflowWithResult(
      'YOUR_WORKFLOW_ID', 
      {
        prompt: 'A futuristic cityscape at sunset',
        negative_prompt: 'blurry, low quality',
        steps: 30,
        cfg_scale: 7
      }
    );
    console.log('Workflow result:', result);
    */
    
    // Example: Monitor account
    const accountData = await rhIntegration.monitorAccount();
    console.log('Account monitoring result:', {
      accountType: accountData.account?.accountType,
      timestamp: accountData.timestamp
    });
    
    // Example: Get cached workflows
    const workflows = await rhIntegration.getCachedWorkflows();
    console.log(`Found ${workflows.length} available workflows`);
    
  } catch (error) {
    console.error('Example usage failed:', error.message);
  }
}

// Export the class and helper function
module.exports = {
  AdvancedRunningHubIntegration,
  createRunningHubIntegration
};

// Only run example if this file is executed directly
if (require.main === module) {
  exampleUsage();
}
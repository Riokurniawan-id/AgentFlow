export const AGENT_REGISTRY_ADDRESS = "0x5928548A91E7269c8BcB1B2e6DEFFe5cd40bd156";

export const AGENT_REGISTRY_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "hash", "type": "string" },
      { "internalType": "string", "name": "agentType", "type": "string" }
    ],
    "name": "createAgent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "agentCount",
    "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [ { "internalType": "uint256", "name": "id", "type": "uint256" } ],
    "name": "getAgent",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "hash", "type": "string" },
          { "internalType": "string", "name": "agentType", "type": "string" },
          { "internalType": "bool", "name": "active", "type": "bool" }
        ],
        "internalType": "struct AgentRegistry.Agent",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyAgents",
    "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ],
    "stateMutability": "view",
    "type": "function"
  }
]; 
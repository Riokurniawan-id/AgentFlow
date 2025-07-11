// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AgentRegistry {
    struct Agent {
        uint256 id;
        address owner;
        string name;
        string hash; // hash dari detail agent (off-chain)
        string agentType;
        bool active;
    }

    uint256 public agentCount;
    mapping(uint256 => Agent) public agents;
    mapping(address => uint256[]) public ownerToAgents;

    event AgentCreated(uint256 indexed id, address indexed owner, string name, string hash, string agentType);

    function createAgent(string memory name, string memory hash, string memory agentType) external {
        agentCount++;
        agents[agentCount] = Agent({
            id: agentCount,
            owner: msg.sender,
            name: name,
            hash: hash,
            agentType: agentType,
            active: true
        });
        ownerToAgents[msg.sender].push(agentCount);
        emit AgentCreated(agentCount, msg.sender, name, hash, agentType);
    }

    function getMyAgents() external view returns (uint256[] memory) {
        return ownerToAgents[msg.sender];
    }

    function getAgent(uint256 id) external view returns (Agent memory) {
        return agents[id];
    }
} 
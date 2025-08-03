# AgentFlow - Live on Lisk Sepolia

🔗 [Visit AgentFlow](https://ai-agent-flow-xi.vercel.app/)

![AgentFlow Banner](frontend-backend/public/LISK-BUILDER.png)

**AgentFlow** is a blockchain-integrated AI Agent management platform that enables decentralized creation, configuration, and deployment of AI agents. It supports integration with top AI providers like OpenAI and Google Gemini, using smart contracts (Lisk/EVM) to ensure data transparency and security.

---

## ✨ Key Features

* **AI Agent Management**: Create, customize, and manage AI agents with unique personalities.
* **AI Integration**: Supports OpenAI (GPT-3.5, GPT-4) & Google Gemini. Users can input their own API keys.
* **Blockchain Integration**: Register agents on-chain using smart contracts (MetaMask, Lisk).
* **Embed & Integration**: Generate embed code (iframe/widget/React) for integration into external websites.
* **Analytics & Monitoring**: Track usage statistics, performance, and chat logs for each agent.
* **Security & Transparency**: All agents are stored on the blockchain. Only the owner has control over their agents.

---

## 👨‍💼 Development Team

* **I PUTU RIO KURNIAWAN** – Fullstack Web Developer

---

## 🏗️ Architecture

### 1. Frontend + Backend (Monorepo - Next.js)

```
frontend + backend/
├── app/
│   ├── agents/           # Agent management
│   ├── analytics/        # Stats & monitoring
│   ├── api/chat/         # AI chat endpoint
│   ├── billing/          # Billing management
│   ├── chat/             # Agent tester
│   ├── create-agent/     # Agent creation form
│   ├── dashboard/        # Main dashboard
│   ├── embed/            # Agent embed widgets
│   └── profile/          # User profile
├── components/           # UI components (shadcn/ui, Radix, custom)
├── hooks/                # Custom React hooks
├── lib/                  # Service layer (AI, blockchain, store)
├── public/               # Static assets
├── styles/               # Tailwind styling
└── package.json          # Core dependencies (Next.js, React, OpenAI, Gemini, wagmi, Zustand, etc.)
```

### 2. Smart Contracts (Solidity + Hardhat)

```
smartcontract/
├── contracts/
│   └── AgentRegistry.sol # Main smart contract for agent registry
├── scripts/              # Deployment & utility scripts
├── deployment-info.json  # Contract deployment details
├── hardhat.config.ts     # Hardhat configuration
└── package.json          # Blockchain dependencies (Hardhat, OpenZeppelin)
```

---

## 🔗 Blockchain Integration

* **Smart Contract: AgentRegistry**

  * Each agent is registered on-chain with the following data: owner, name, detail hash (off-chain), agent type, and status.
  * Key functions:

    * `createAgent(name, hash, agentType)`: Registers a new agent.
    * `getMyAgents()`: Retrieves a list of the user’s agents.
    * `getAgent(id)`: Retrieves agent details by ID.
  * All agent interactions (create, update, query) are recorded on-chain to ensure transparency and integrity.

* **Wallet Integration**

  * MetaMask is used for signing and verifying agent ownership.
  * The user's wallet address acts as their unique identity on-chain.

---

## 🤖 AI Integration

* **Providers**: OpenAI (GPT-3.5, GPT-4, etc.), Google Gemini (Gemini 1.5, 2.0 Flash, etc.)
* **Features**:

  * Users can provide their own API keys.
  * Model selection and tuning parameters (temperature, max tokens).
  * API key validation and fallback mechanism if key is missing.
  * AI chat endpoint is directly linked with agents registered on the blockchain.

---

## 📦 Tech Stack

* **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui, Zustand
* **AI Integration**: OpenAI SDK, Google Generative AI SDK
* **Blockchain**: Solidity, Hardhat, MetaMask, wagmi, RainbowKit, Lisk/EVM-compatible
* **UI Libraries**: Radix UI, Lucide Icons

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* pnpm or npm
* MetaMask wallet
* Connection to Lisk/EVM testnet

### Local Development

```bash
pnpm install
pnpm dev
```

Or use `npm` if `pnpm` is not available.

### Build & Production

```bash
pnpm build
pnpm start
```

### Smart Contract Deployment

```bash
cd smartcontract
npm install
npx hardhat compile
npx hardhat run scripts/deploy.ts --network <network>
```

---

## 📄 License

MIT License


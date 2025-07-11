# 🎯 Charity Web3 Transparan

Sistem Charity Web3 transparan yang dibangun dengan smart contracts untuk mengelola campaign donasi secara terdesentralisasi dan transparan.

## 🌟 Fitur Utama

### ✅ **CharityFactory**
- Factory contract untuk membuat campaign donasi baru
- Mendukung campaign dengan ETH dan token ERC20
- Tracking campaign per owner dan token
- Platform fee management (0.5% default)
- Batch query untuk efisiensi

### ✅ **CharityCampaign**
- Contract individual untuk setiap campaign
- Donasi dengan ETH atau token ERC20
- Transparansi penuh - semua transaksi tercatat di blockchain
- Goal-based withdrawal (hanya jika target tercapai)
- Campaign management (update, pause/unpause)
- Progress tracking dan analytics

### ✅ **Keamanan & Transparansi**
- Reentrancy protection
- Access control dengan OpenZeppelin
- Platform fee otomatis (0.5%)
- Semua transaksi tercatat di blockchain
- Verifikasi donasi real-time

## 🏗️ Arsitektur Smart Contracts

```
CharityFactory
├── createCampaign() - Buat campaign ETH
├── createTokenCampaign() - Buat campaign token
├── getAllCampaigns() - Get semua campaign
├── getCampaignsByOwner() - Get campaign per owner
└── getActiveCampaigns() - Get campaign aktif

CharityCampaign (per campaign)
├── donate() - Donasi ETH
├── donateToken() - Donasi token
├── withdraw() - Withdraw jika goal tercapai
├── updateCampaign() - Update info campaign
└── getProgressPercentage() - Progress campaign
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm atau yarn
- Hardhat
- MetaMask atau wallet lain

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd charity-web3-transparan
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment**
```bash
cp .env.example .env
# Edit .env dengan private key dan RPC URL
```

4. **Compile contracts**
```bash
npm run compile
```

5. **Run tests**
```bash
npm test
```

6. **Deploy ke local network**
```bash
npm run node
npm run deploy:local
```

7. **Deploy ke testnet**
```bash
npm run deploy
```

## 📋 Smart Contract Functions

### CharityFactory

#### Campaign Creation
```solidity
// Buat campaign dengan ETH
function createCampaign(
    string memory _title,
    string memory _description,
    string memory _imageUrl,
    uint256 _goalAmount,
    uint256 _duration
) external returns (address)

// Buat campaign dengan token
function createTokenCampaign(
    string memory _title,
    string memory _description,
    string memory _imageUrl,
    uint256 _goalAmount,
    uint256 _duration,
    address _tokenAddress
) external returns (address)
```

#### Campaign Queries
```solidity
// Get semua campaign
function getAllCampaigns() external view returns (address[])

// Get campaign per owner
function getCampaignsByOwner(address _owner) external view returns (address[])

// Get campaign aktif
function getActiveCampaigns() external view returns (address[])

// Get campaign sukses
function getSuccessfulCampaigns() external view returns (address[])
```

### CharityCampaign

#### Donations
```solidity
// Donasi ETH
function donate(string memory _message) external payable

// Donasi token
function donateToken(uint256 _amount, string memory _message) external
```

#### Campaign Management
```solidity
// Withdraw jika goal tercapai
function withdraw() external onlyOwner onlyGoalReached

// Update campaign info
function updateCampaign(
    string memory _title,
    string memory _description,
    uint256 _goalAmount,
    uint256 _deadline
) external onlyOwner

// Toggle campaign status
function toggleCampaignStatus() external onlyOwner
```

#### Analytics
```solidity
// Progress dalam persentase
function getProgressPercentage() external view returns (uint256)

// Waktu tersisa
function getTimeRemaining() external view returns (uint256)

// Total donasi per address
function getDonorTotal(address _donor) external view returns (uint256)
```

## 🧪 Testing

Project ini dilengkapi dengan test suite yang komprehensif:

```bash
# Run semua tests
npm test

# Run test specific
npx hardhat test test/CharityCampaign.test.ts
npx hardhat test test/CharityFactory.test.ts
```

### Test Coverage
- ✅ Contract deployment
- ✅ Campaign creation (ETH & Token)
- ✅ Donations (ETH & Token)
- ✅ Withdrawals
- ✅ Campaign management
- ✅ Access control
- ✅ Error handling
- ✅ Analytics functions

## 🔧 Configuration

### Hardhat Config
```typescript
// hardhat.config.ts
const config: HardhatUserConfig = {
  solidity: "0.8.23",
  networks: {
    'lisk-sepolia': {
      url: 'https://rpc.sepolia-api.lisk.com',
      accounts: [process.env.WALLET_KEY as string],
      gasPrice: 500000000,
      chainId: 4202,
    },
  },
};
```

### Environment Variables
```bash
# .env
WALLET_KEY=your_private_key_here
RPC_URL=your_rpc_url_here
```

## 📊 Platform Fee

- **Default fee**: 0.5% (50 basis points)
- **Maximum fee**: 5% (500 basis points)
- **Fee destination**: Platform address
- **Fee calculation**: Applied on withdrawal

## 🔒 Security Features

### Reentrancy Protection
```solidity
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CharityCampaign is ReentrancyGuard {
    function withdraw() external onlyOwner onlyGoalReached nonReentrant {
        // Withdrawal logic
    }
}
```

### Access Control
```solidity
import "@openzeppelin/contracts/access/Ownable.sol";

contract CharityCampaign is Ownable {
    modifier onlyOwner() {
        require(msg.sender == owner(), "Not authorized");
        _;
    }
}
```

### Input Validation
```solidity
require(bytes(_title).length > 0, "Title tidak boleh kosong");
require(_goalAmount > 0, "Goal amount harus lebih dari 0");
require(_duration >= MIN_DURATION, "Duration terlalu pendek");
```

## 🌐 Frontend Integration

### Contract Addresses
Setelah deploy, Anda akan mendapatkan:
```json
{
  "charityFactory": "0x...",
  "mockToken": "0x...",
  "network": "lisk-sepolia",
  "deployer": "0x..."
}
```

### Web3 Integration Example
```javascript
// Connect to contracts
const charityFactory = new ethers.Contract(
  factoryAddress,
  factoryABI,
  signer
);

// Create campaign
const tx = await charityFactory.createCampaign(
  "Campaign Title",
  "Description",
  "image.jpg",
  ethers.parseEther("10"),
  30 * 24 * 60 * 60
);

// Donate to campaign
const campaign = new ethers.Contract(
  campaignAddress,
  campaignABI,
  signer
);

await campaign.donate("Support message", {
  value: ethers.parseEther("1")
});
```

## 📈 Roadmap

### Phase 1 ✅
- [x] Smart contract development
- [x] Basic testing
- [x] Deployment scripts

### Phase 2 🚧
- [ ] Frontend React/Next.js
- [ ] Web3 integration
- [ ] UI/UX design

### Phase 3 📋
- [ ] Advanced analytics
- [ ] Multi-chain support
- [ ] Mobile app

### Phase 4 🎯
- [ ] DAO governance
- [ ] Advanced features
- [ ] Community features

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@charityweb3.com
- 💬 Discord: [Charity Web3 Community](https://discord.gg/charityweb3)
- 📖 Documentation: [docs.charityweb3.com](https://docs.charityweb3.com)

## 🙏 Acknowledgments

- OpenZeppelin untuk smart contract libraries
- Hardhat untuk development framework
- Ethereum community untuk inspirasi
- Semua kontributor dan donatur

---

**Made with ❤️ for transparent charity**

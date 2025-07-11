# AgentFlow

Platform manajemen AI Agent yang terintegrasi dengan blockchain untuk membuat, mengelola, dan mendeploy AI agent secara terdesentralisasi.

## 🌟 Fitur Utama

### ✅ **Manajemen AI Agent**
- Buat AI agent dengan personality dan kemampuan yang unik
- Kelola dan konfigurasi agent secara real-time
- Deploy agent ke blockchain untuk keamanan dan transparansi

### ✅ **Integrasi Blockchain**
- Wallet integration dengan MetaMask
- Smart contract untuk manajemen agent
- Transaksi terdesentralisasi dan transparan

### ✅ **Embed & Integrasi**
- Generate embed code untuk website
- Floating chat widget
- React component integration
- Customizable theme dan styling

### ✅ **Analytics & Monitoring**
- Track performance agent
- Usage statistics
- Chat analytics
- Real-time monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm atau npm
- MetaMask wallet
- Lisk network connection

### Installation

1. **Install dependencies**
```bash
pnpm install
```

2. **Run development server**
```bash
pnpm dev
```

3. **Build for production**
```bash
pnpm build
```

4. **Start production server**
```bash
pnpm start
```

## 🏗️ Arsitektur

```
AgentFlow Frontend
├── app/ - Next.js app router
│   ├── dashboard/ - Dashboard utama
│   ├── agents/ - Manajemen agent
│   ├── create-agent/ - Form pembuatan agent
│   ├── chat/ - Testing agent
│   ├── analytics/ - Analytics dan monitoring
│   ├── billing/ - Manajemen billing
│   └── embed/ - Embed chat widget
├── components/ - Reusable components
├── lib/ - Utilities dan store
└── public/ - Static assets
```

## 🔧 Teknologi

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand
- **Blockchain**: Lisk SDK, MetaMask
- **UI Components**: Radix UI, Lucide Icons

## 📱 Pages & Features

### Dashboard
- Overview agent dan aktivitas
- Quick stats dan metrics
- Recent agents

### Agents Management
- List semua agent
- Edit dan konfigurasi
- Status management (active/inactive)
- Embed code generator

### Create Agent
- Form pembuatan agent
- Personality configuration
- Knowledge base setup
- Behavior settings

### Chat Testing
- Real-time chat dengan agent
- Test conversation flow
- Response validation

### Analytics
- Performance metrics
- Usage statistics
- Chat distribution
- Agent comparison

### Embed Integration
- HTML iframe embed
- Floating widget
- React component
- Customizable styling

## 🔐 Authentication

- MetaMask wallet connection
- Lisk address verification
- Session management
- Protected routes

## 🎨 Customization

- Dark/Light theme
- Custom color schemes
- Responsive design
- Mobile-friendly interface

## 📦 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t agentflow .
docker run -p 3000:3000 agentflow
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

Untuk dukungan dan pertanyaan:
- Create issue di GitHub
- Email: support@agentflow.com
- Documentation: docs.agentflow.com 
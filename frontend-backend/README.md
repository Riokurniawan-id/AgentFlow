# AgentFlow
![Banner AgentFlow](frontend%20+%20backend/public/LISK-BUILDER.png)
Platform manajemen AI Agent yang terintegrasi dengan blockchain untuk membuat, mengelola, dan mendeploy AI agent secara terdesentralisasi dengan dukungan AI providers seperti OpenAI dan Google Gemini.

## 🌟 Fitur Utama

### ✅ **Manajemen AI Agent**
- Buat AI agent dengan personality dan kemampuan yang unik
- Kelola dan konfigurasi agent secara real-time
- Deploy agent ke blockchain untuk keamanan dan transparansi
- **🆕 Integrasi AI Real-time dengan OpenAI & Google Gemini**

### ✅ **AI Integration**
- **🤖 Multiple AI Providers**: OpenAI (GPT-3.5, GPT-4) dan Google Gemini
- **🔑 User API Keys**: Pengguna dapat memasukkan API key mereka sendiri
- **⚙️ Flexible Configuration**: Pilih model, temperature, dan max tokens
- **🧪 API Key Testing**: Validasi API key sebelum penggunaan
- **🛡️ Fallback Mode**: Respons tetap bekerja tanpa API key

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

2. **Environment Setup** (Optional)
```bash
# Copy environment file
cp .env.example .env

# Add your default API keys (optional)
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
```

3. **Run development server**
```bash
pnpm dev
```

4. **Build for production**
```bash
pnpm build
```

5. **Start production server**
```bash
pnpm start
```

## 🤖 AI Configuration

### Supported Providers
- **OpenAI**: GPT-3.5-turbo, GPT-4, GPT-4-turbo, GPT-3.5-turbo-16k
- **Google Gemini**: Gemini 2.0 Flash, Gemini 1.5 Pro, Gemini 1.5 Flash

### Getting API Keys
1. **OpenAI**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. **Google Gemini**: [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

### Agent Configuration
1. Pilih AI Provider (OpenAI atau Gemini)
2. Pilih Model (opsional, menggunakan default jika kosong)
3. Masukkan API Key
4. Test API Key untuk validasi
5. Atur parameter (temperature, max tokens)

### Fallback Mode
Jika tidak ada API key, agent akan menggunakan respons fallback yang masih sesuai dengan personality yang dikonfigurasi.

## 🏗️ Arsitektur

```
AgentFlow Frontend
├── app/ - Next.js app router
│   ├── api/chat/ - AI chat API endpoint
│   ├── dashboard/ - Dashboard utama
│   ├── agents/ - Manajemen agent
│   ├── create-agent/ - Form pembuatan agent
│   ├── chat/ - Testing agent
│   ├── analytics/ - Analytics dan monitoring
│   ├── billing/ - Manajemen billing
│   └── embed/ - Embed chat widget
├── components/ - Reusable components
│   └── api-key-help.tsx - API key helper
├── lib/ - Utilities dan store
│   └── ai-service.ts - AI service layer
└── public/ - Static assets
```

## 🔧 Teknologi

- **Frontend**: Next.js 14, React 18, TypeScript
- **AI Integration**: OpenAI SDK, Google Generative AI SDK
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
# AgentFlow - AI Agent Management Platform

A modern web application for creating, managing, and embedding AI agents with support for multiple AI providers.

## Features

- 🤖 Create and manage AI agents with custom personalities
- 🌐 Embed agents into any website with customizable widgets
- 🔧 Support for multiple AI providers (OpenAI, Gemini)
- 📊 Analytics and chat tracking
- 🎨 Customizable themes and styling
- 🔒 Protected routes and user authentication
- 💾 Persistent data storage with Supabase

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **AI Providers**: OpenAI, Google Gemini
- **Authentication**: Custom implementation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key from the project settings

4. Create environment variables:
```bash
cp .env.local.example .env.local
```

5. Update `.env.local` with your configuration:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI API Keys
API_KEY_GEMINI_DEFAULT=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
```

### Database Setup

1. In your Supabase dashboard, go to the SQL Editor
2. Run the following SQL to create the agents table:

```sql
-- Create agents table
CREATE TABLE agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  personality TEXT NOT NULL,
  personality_type TEXT NOT NULL CHECK (personality_type IN ('custom', 'friendly', 'professional', 'technical', 'creative', 'formal')),
  knowledge_base JSONB NOT NULL,
  api_key TEXT,
  ai_provider TEXT CHECK (ai_provider IN ('openai', 'gemini')),
  ai_model TEXT,
  max_tokens INTEGER NOT NULL DEFAULT 1000,
  temperature DECIMAL(3,2) NOT NULL DEFAULT 0.7,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  chat_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_created_at ON agents(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can customize this based on your needs)
CREATE POLICY "Allow all operations" ON agents FOR ALL USING (true);

-- Create function to increment chat count
CREATE OR REPLACE FUNCTION increment(row_id UUID, x INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN x;
END;
$$ LANGUAGE plpgsql;
```

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Embedding Agents

### HTML Iframe
```html
<iframe 
  src="https://your-domain.com/embed/agent-id?theme=light&header=true&color=3b82f6"
  width="400"
  height="600"
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
  title="AI Agent Chatbot">
</iframe>
```

### Floating Widget
```html
<!-- Floating Chat Widget -->
<div id="ai-chat-widget-agent-id"></div>
<script>
  (function() {
    var widget = document.createElement('div');
    widget.innerHTML = `
      <div style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; width: 400px; height: 600px; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); overflow: hidden; display: none;" id="chat-widget-container">
        <iframe src="https://your-domain.com/embed/agent-id?theme=light&header=true&color=3b82f6" width="100%" height="100%" frameborder="0" title="AI Agent Chatbot"></iframe>
      </div>
      <button style="position: fixed; bottom: 20px; right: 20px; z-index: 10000; width: 60px; height: 60px; border-radius: 50%; background: #3b82f6; border: none; cursor: pointer; box-shadow: 0 4px 16px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;" onclick="toggleChatWidget()" id="chat-widget-button">💬</button>
    `;
    document.body.appendChild(widget);
    
    window.toggleChatWidget = function() {
      var container = document.getElementById('chat-widget-container');
      var button = document.getElementById('chat-widget-button');
      if (container.style.display === 'none') {
        container.style.display = 'block';
        button.innerHTML = '✕';
      } else {
        container.style.display = 'none';
        button.innerHTML = '💬';
      }
    };
  })();
</script>
```

## API Endpoints

### Get Agent
```
GET /api/agents/[agentId]
```

### Update Agent
```
PUT /api/agents/[agentId]
```

### Delete Agent
```
DELETE /api/agents/[agentId]
```

### Chat with Agent
```
POST /api/chat
Body: {
  message: string,
  agentId: string,
  personality: string,
  knowledgeBase: object,
  apiKey?: string,
  aiProvider?: string,
  aiModel?: string,
  maxTokens?: number,
  temperature?: number,
  conversationHistory?: array
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `API_KEY_GEMINI_DEFAULT` | Default Gemini API key | No |
| `OPENAI_API_KEY` | OpenAI API key | No |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team. 
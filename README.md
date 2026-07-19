# FIFA NEXUS AI - Official Match Day Concierge (FIFA World Cup 2026)

FIFA NEXUS AI is a premium, high-fidelity fan experience application designed to serve as the ultimate Match Day Concierge during the FIFA World Cup 2026. 

It provides real-time crowd analytics, 3D stadium twin maps, automated navigation routes, and an intelligent AI Concierge powered by **NVIDIA NIM API (Nemotron)**.

## Key Features
- 🏆 **Dynamic Custom Fan Themes**: Real-time theme adaptation matching the colors of your supported country (e.g. Argentina, Brazil, France, etc.) blended seamlessly with the official FIFA World Cup style.
- 💬 **AI Concierge**: High-speed, context-aware chatbot capable of rendering lists, tables, and bold markdown options, answering real-time stadium & match queries.
- 🧪 **API Playground**: Live chat playground and telemetry dashboard showcasing real-time API latency, HTTP response status, token counts, and retries.
- 🏟️ **MetLife Stadium 3D Twin**: Fully interactive Three.js 3D stadium representation detailing real-time crowd flows ("highest people way") and access gate congestion (Verizon, SAP, Pepsi gates).
- 🔒 **Secure Authentication**: Robust Supabase integration managing user profiles, preferences, protected routing guards, and session restoration.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3+)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Arpit599222/FIFA-NEXUS.git
   cd FIFA-NEXUS
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and `backend/` directory:
   ```env
   NVIDIA_API_KEY=your_nvidia_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the Application:
   ```bash
   npm run dev:all
   ```

*Note: All API keys and connection parameters are kept private and secure under `.gitignore` settings.*

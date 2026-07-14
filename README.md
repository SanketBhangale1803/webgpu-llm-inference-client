# webgpu-llm-inference-client

A modern, responsive chatbot application built with React and Vite, powered by WebLLM for running large language models directly in the browser.

## ✨ Features

- 🚀 **Client-side AI**: Run LLMs entirely in your browser with WebLLM
- ⚡ **Fast & Responsive**: Built with Vite for lightning-fast development and builds
- 🎨 **Modern UI**: Clean, intuitive chat interface
- 📱 **Mobile-friendly**: Responsive design that works on all devices
- 🔒 **Privacy-first**: All conversations happen locally in your browser
- 🛠️ **Developer-friendly**: Hot module replacement and modern tooling

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/WebLLM-Chatbot.git
   cd WebLLM-Chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the chatbot in action!

## 🏗️ Project Structure

```
WebLLM-Chatbot/
├── public/             # Static assets
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── utils/         # Utility functions
│   ├── styles/        # CSS/styling files
│   └── App.jsx        # Main app component
├── package.json       # Dependencies and scripts
└── vite.config.js     # Vite configuration
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🧠 How It Works

This chatbot leverages [WebLLM](https://webllm.mlc.ai/) to run large language models directly in your browser using WebAssembly and WebGPU. No server required!

### Key Technologies

- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Next-generation frontend tooling
- **WebLLM** - Browser-based LLM inference
- **ESLint** - Code quality and consistency

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Development Guidelines

- Follow the existing code style
- Run `npm run lint` before submitting
- Write clear commit messages
- Update documentation for new features

## 🐛 Troubleshooting

### Common Issues

**Browser Compatibility**: WebLLM requires a modern browser with WebAssembly and WebGPU support.

**Memory Issues**: Large language models require significant memory. Close other tabs if you experience performance issues.

**Loading Times**: Initial model loading may take time depending on your internet connection.

## 🙏 Acknowledgments

- [WebLLM](https://webllm.mlc.ai/) for making browser-based LLM inference possible
- [Vite](https://vitejs.dev/) for the amazing development experience
- [React](https://reactjs.org/) for the component architecture

⭐ Star this repository if you found it helpful!

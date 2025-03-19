# Tabspire

Tabspire is a Chrome extension that delivers daily inspiration with random scripture verses and beautiful background images each time you open a new tab. Built with React and TypeScript, it provides a serene and uplifting browsing experience.

## Features

- 📖 Random inspirational Bible verses
- 🖼️ Beautiful nature backgrounds from Unsplash
- 🚀 Fast loading with local caching
- 📱 Responsive design
- 🔄 Daily content refresh
- 💻 Offline support

## Prerequisites

Before you begin, ensure you have:
- Node.js (v14 or higher)
- npm (v6 or higher)
- A Chrome browser
- API keys for:
  - [Unsplash API](https://unsplash.com/developers)
  - [API.Bible](https://scripture.api.bible/)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tabspire.git
cd tabspire
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
REACT_APP_UNSPLASH_ACCESS_KEY=your_unsplash_api_key_here
REACT_APP_BIBLE_API_KEY=your_bible_api_key_here
```

## Development

To run the extension in development mode:

1. Start the development server:
```bash
npm start
```

2. Build the extension:
```bash
npm run build:extension
```

3. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `build` directory from your project

## Building for Production

1. Build the extension:
```bash
npm run build:extension
```

2. The `build` directory will contain your extension files

3. To create a ZIP file for the Chrome Web Store:
```bash
cd build
zip -r ../tabspire.zip *
```

## Project Structure

```
tabspire/
├── src/
│   ├── App.tsx           # Main application component
│   ├── App.css           # Styles for the app
│   ├── index.tsx         # Entry point
│   └── icon.svg          # Source icon file
├── public/
│   └── index.html        # HTML template
├── icons/                # Generated extension icons
├── scripts/
│   └── generate-icons.js # Icon generation script
├── manifest.json         # Extension manifest
├── package.json         # Project dependencies
└── README.md            # This file
```

## API Usage

The extension uses two main APIs:

1. **Unsplash API**
   - Used for fetching beautiful nature backgrounds
   - Rate limited to 50 requests per hour
   - Images are cached locally

2. **API.Bible**
   - Provides Bible verses and references
   - Supports multiple translations
   - Currently using ESV translation

## Local Storage

The extension uses Chrome's storage API to:
- Cache API responses
- Reduce API calls
- Provide offline functionality
- Store daily verses and backgrounds

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Unsplash](https://unsplash.com/)
- [API.Bible](https://scripture.api.bible/)
- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)

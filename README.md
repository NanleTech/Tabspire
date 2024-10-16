# Tabspire

Tabspire is a Chrome extension that delivers daily inspiration by displaying a random scripture or motivational message along with a beautiful background image every time you open a new tab. Customize your experience with future features and designs that keep you inspired throughout the day.

## Features

- Displays a random "In Him Scripture" each time a new tab is opened.
- Fetches beautiful background images from the Unsplash API.
- Easy customization for future enhancements.

## Technologies Used

- **HTML** for structure
- **CSS** for styling
- **JavaScript** for functionality
- **Babel** for transpiling modern JavaScript
- **Webpack** for module bundling
- **Unsplash API** for background images

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/tabspire.git
   cd tabspire
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Create a .env file**

   ```bash
   UNSPLASH_API_KEY=your_unsplash_api_key_here
   ```

4. **Build the Project**

   ```bash
       npx webpack --config webpack.config.js
   ```

5. **Load the Extension in Chrome**
   ```
   Open Chrome and go to chrome://extensions/.
   Enable "Developer mode" in the top right corner.
   Click on "Load unpacked" and select the directory where your project is located.
   ```

**Usage**
Every time you open a new tab, Tabspire will display a random scripture along with a beautiful background image. Enjoy your daily dose of inspiration!

**Contributing**
Contributions are welcome! If you have suggestions or improvements, please open an issue or submit a pull request.

**License**
This project is licensed under the MIT License. See the LICENSE file for details.

**Acknowledgments**
Unsplash for providing beautiful images.
Babel for helping us use modern JavaScript features.
Webpack for module bundling.

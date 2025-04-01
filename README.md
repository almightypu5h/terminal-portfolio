# 🖥️ Linux Terminal Portfolio

A sleek, interactive terminal-based portfolio website built with React and xterm.js

![Terminal Portfolio Screenshot](./src/assets/screenshot.png)

## ✨ Features

- **Authentic Terminal Experience**: Simulates a Linux terminal with authentic styling and behavior
- **Interactive Commands**: Navigate through portfolio content using familiar terminal commands
- **Responsive Design**: Automatically adapts to mobile phones, tablets, and desktop screens
- **Command History**: Navigate through previous commands using arrow keys
- **Tab Completion**: Complete commands with tab key
- **Custom ASCII Art**: Personalized welcome banner and neofetch display
- **Highlighted Text**: Important information stands out with color coding and formatting
- **Mobile-Friendly**: Optimized font sizes and interface elements for small screens
- **Touch Compatible**: Works well on touchscreen devices with swipe gestures and virtual keyboard
- **Enhanced Mobile Input**: Full-width keyboard button and improved touch input handling

## 🚀 Available Commands

### System Commands
- `clear` - Clear the terminal screen
- `echo [text]` - Display text in the terminal
- `date` - Show current date and time
- `whoami` - Display current user
- `uname` - Show system information
- `reboot` - Restart the terminal

### Portfolio Commands
- `about` - Display personal information
- `skills` - List technical skills by category
- `projects` - View project showcase
- `contact` - Show contact information with clickable links
- `resume` - View resume information

### Other Commands
- `help` - Display available commands
- `banner` - Show the welcome banner
- `neofetch` - Display system information in a stylized format
- `exit` - Exit the terminal

## 💻 Technologies Used

- React
- xterm.js
- JavaScript
- CSS
- Vite

## 📱 Responsive Design

The terminal portfolio is fully responsive across all devices:

- **Mobile Phones**: Optimized font size (12px) and layout for small screens
- **Tablets**: Adjusted font size (13-14px) for better readability on medium screens
- **Desktop**: Full experience with optimal font size (15px)
- **Touch Interface**:
  - Prominent virtual keyboard button for easy typing on mobile
  - Full-width keyboard activator at bottom of screen
  - Swipe left/right to navigate command history
  - Compact ASCII art banner and neofetch on mobile devices
  - Visual cues for touch interactions
  - iOS keyboard optimization
- **Special Considerations**:
  - iOS Safari viewport height fixes
  - Landscape mode optimizations
  - Custom scrollbar styling for better touch interaction
  - Reduced padding on smaller screens

## 🛠️ Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/terminal-portfolio.git
   ```

2. Navigate to the project directory:
   ```
   cd terminal-portfolio
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 🔧 Customization

You can easily customize the portfolio content by modifying the `portfolioContent` object in `src/components/LinuxTerminalPortfolio.jsx`:

```javascript
const portfolioContent = {
  about: "Your personal bio here",
  skills: {
    // Your skills by category
  },
  contact: {
    // Your contact information
  },
  // Other sections...
};
```

## 📱 Performance Optimizations

- Debounced window resize event handling
- Pre-computed terminal theme and content
- Batched write operations for better rendering
- Reduced scrollback buffer for lower memory usage
- Optimized command lookup and processing


## 👤 Author

[Ash](https://github.com/almightypu5h)
 

import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "@xterm/xterm/css/xterm.css";

/**
 * LinuxTerminalPortfolio - A React component that simulates a Linux terminal
 * for use as an interactive portfolio page.
 */
const LinuxTerminalPortfolio = () => {
  // DOM reference for the terminal container
  const terminalRef = useRef(null);

  // Terminal addons and state references
  const fitAddon = useRef(new FitAddon());
  const terminal = useRef(null);

  // Command input state
  const commandBuffer = useRef("");
  const history = useRef([]);
  const historyIndex = useRef(-1);

  // Terminal user and hostname display
  const user = "ash";
  const hostname = "portfolio";

  // Store portfolio content directly - pre-compute where possible
  const portfolioContent = {
    about: "Hello, my name is Ash and i like to build cool stuff.",
    skills: {
      frontend: ["JavaScript/TypeScript", "React", "Next.js", "HTML/CSS"],
      backend: ["Node.js", "Express", "Python", "Django"],
      blockchain: ["Solidity", "Web3"],
      devops: ["Docker", "Kubernetes", "CI/CD Pipelines"],
      cloud: ["AWS", "Cloud Infrastructure"]
    },
    contact: {
      email: "a83h@proton.me",
      work: "ashwindeshmukhwork@protonmail.com",
      github: "github.com/almightypu5h",
      twitter: "@a083h",
      telegram: "@a5hww"
    },
    resume: "500 - Internal Server Error - Resume not available at the moment.",
    projects: "404: Not Found - Good things take time."
  };
  
  // Pre-computed terminal theme
  const terminalTheme = {
        background: "#1E1E1E",
        foreground: "#F8F8F8",
        cursor: "#A0A0A0",
        black: "#000000",
        red: "#C51E14",
        green: "#1DC121",
        yellow: "#C7C329",
        blue: "#0A2FC4",
        magenta: "#C839C5",
        cyan: "#20C5C6",
        white: "#C7C7C7",
        brightBlack: "#686868",
        brightRed: "#FD6F6B",
        brightGreen: "#67F86F",
        brightYellow: "#FFFA72",
        brightBlue: "#6A76FB",
        brightMagenta: "#FD7CFC",
        brightCyan: "#68FDFE",
        brightWhite: "#FFFFFF"
  };

  // Debounce function for performance optimization
  const debounce = (func, wait) => {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm.js terminal with optimized options
    terminal.current = new Terminal({
      cursorBlink: true,
      theme: terminalTheme,
      fontFamily: "'Fira Code', 'Cascadia Code', 'Source Code Pro', monospace",
      fontSize: getFontSizeBasedOnDevice(), // Dynamically set font size based on device
      lineHeight: 1.2,
      scrollback: 1000, // Reduce scrollback for better performance
      cursorStyle: "block",
      allowTransparency: true,
    });

    // Load only necessary addons
    terminal.current.loadAddon(fitAddon.current);
    terminal.current.loadAddon(new WebLinksAddon());

    // Render terminal to DOM
    terminal.current.open(terminalRef.current);
    fitAddon.current.fit();

    // Handle window resize with debounce for performance
    const handleResize = debounce(() => {
      fitAddon.current.fit();
      // Update font size when window is resized
      if (terminal.current) {
        terminal.current.options.fontSize = getFontSizeBasedOnDevice();
        fitAddon.current.fit();
      }
    }, 100);
    window.addEventListener("resize", handleResize);

    // Add touch interface support for mobile
    addMobileTouchSupport();

    // Display welcome banner
    displayBanner();
    prompt();
    setupKeyHandlers();

    // Clean up on component unmount
    return () => {
      if (terminal.current) {
        terminal.current.dispose();
      }
      window.removeEventListener("resize", handleResize);
      
      // Remove touch event listeners
      const container = terminalRef.current;
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, []);

  /**
   * Returns appropriate font size based on device screen width
   */
  const getFontSizeBasedOnDevice = () => {
    // Get the current viewport width
    const width = window.innerWidth;
    
    // Font size breakpoints
    if (width < 480) {
      return 12; // Mobile phones
    } else if (width < 768) {
      return 13; // Larger phones / small tablets
    } else if (width < 1024) {
      return 14; // Tablets
    } else {
      return 15; // Desktop and larger screens
    }
  };

  /**
   * Displays the welcome banner with ASCII art
   */
  const displayBanner = () => {
    // Check if mobile device for smaller banner
    const isMobile = window.innerWidth < 480;
    
    // Batch write operations for better performance
    const bannerText = isMobile 
      ? [
          "\x1b[36m     _         _       ",
          "    / \\   ___| |__    ", 
          "   / _ \\ / __| '_ \\   ",
          "  / ___ \\\\__ \\ | | |  ",
          " /_/   \\_\\___/_| |_|  \x1b[0m",
          "\x1b[1;32mWelcome to Ash's Terminal!\x1b[0m",
          "Type \x1b[1;34mhelp\x1b[0m for commands.",
          "\x1b[1;31m IMPORTANT:\x1b[0m \x1b[1mPlease use the commands responsibly.\x1b[0m",
          "\x1b[1;33m FEEDBACK:\x1b[0m \x1b[1mFor suggestions or issues, contact \x1b[4ma83h@proton.me\x1b[0m\x1b[1m\x1b[0m",

        ]
      : [
          "\x1b[36m                 _     _         _                      _             _ ",
          "  __ _  ___| |__ ( )___   | |_ ___ _ __ _ __ ___ (_)_ __   __ _| |",
          " / _` |/ __| '_ \\|// __|  | __/ _ \\ '__| '_ ` _ \\| | '_ \\ / _` | |",
          "| (_| |\\__ \\ | | | \\__ \\  | ||  __/ |  | | | | | | | | | | (_| | |",
          " \\__,_||___/_| |_| |___/   \\__\\___|_|  |_| |_| |_|_|_| |_|\\__,_|_|\x1b[0m",
          "",
          "\x1b[1;32mWelcome to Ash's Terminal!\x1b[0m",
          "Type \x1b[1;34mhelp\x1b[0m to see available commands.",
          "\x1b[1;31m IMPORTANT:\x1b[0m \x1b[1mPlease use the commands responsibly.\x1b[0m",
          "\x1b[1;33m FEEDBACK:\x1b[0m \x1b[1mFor suggestions or issues, contact \x1b[4ma83h@proton.me\x1b[0m\x1b[1m\x1b[0m",
        ];
    
    terminal.current.write(bannerText.join("\r\n") + "\r\n");
  };

  /**
   * Displays the command prompt
   */
  const prompt = () => {
    terminal.current.write(`\r\n\x1b[1;32m${user}@${hostname}\x1b[0m:\x1b[1;34m~\x1b[0m$ `);
    commandBuffer.current = "";
  };

  /**
   * Set up terminal key event handlers
   */
  const setupKeyHandlers = () => {
    terminal.current.onKey(({ key, domEvent }) => {
      // Fast path for common actions
      switch (domEvent.key) {
        case "Enter":
        handleEnterKey();
          return;
        case "Backspace":
          if (commandBuffer.current.length > 0) {
            commandBuffer.current = commandBuffer.current.slice(0, -1);
            terminal.current.write("\b \b");
          }
          return;
        case "ArrowUp":
          if (history.current.length > 0 && historyIndex.current > 0) {
            historyIndex.current--;
            showHistoryCommand();
          }
          return;
        case "ArrowDown":
          if (historyIndex.current < history.current.length - 1) {
            historyIndex.current++;
            showHistoryCommand();
          } else if (historyIndex.current === history.current.length - 1) {
            historyIndex.current = history.current.length;
            clearCommandLine();
          }
          return;
        case "Tab":
          domEvent.preventDefault();
          handleTabCompletion();
          return;
      }

      // Handle ctrl combinations
      if (domEvent.ctrlKey) {
        switch (domEvent.key) {
          case "c":
            terminal.current.writeln("^C");
            prompt();
            return;
          case "l":
            terminal.current.clear();
            prompt();
            return;
        }
      }

      // Handle regular input - only process printable characters
      const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;
      if (printable) {
        commandBuffer.current += key;
        terminal.current.write(key);
      }
    });
  };

  /**
   * Handles Enter key press - processes the current command
   */
  const handleEnterKey = () => {
    terminal.current.writeln("");
    const input = commandBuffer.current.trim();

    if (input.length > 0) {
      // Add command to history
      history.current.push(input);
      historyIndex.current = history.current.length;

      // Process the command
      processCommand(input);
    } else {
      // Empty input, just show prompt again
      prompt();
    }
  };

  /**
   * Handle tab completion for commands
   */
  const handleTabCompletion = () => {
    const input = commandBuffer.current.trim();
    if (!input) return;

    // Only complete command names
    const args = input.split(" ");
    if (args.length === 1) {
      const possibleCommands = Object.keys(commands).filter(cmd =>
        cmd.startsWith(args[0])
      );

      if (possibleCommands.length === 1) {
        clearCommandLine();
        commandBuffer.current = possibleCommands[0];
        terminal.current.write(commandBuffer.current);
      } else if (possibleCommands.length > 1) {
        terminal.current.writeln("");
        terminal.current.writeln(possibleCommands.join("  "));
        prompt();
        terminal.current.write(input);
      }
    }
  };

  /**
   * Shows a command from history at the current history index
   */
  const showHistoryCommand = () => {
    clearCommandLine();
    commandBuffer.current = history.current[historyIndex.current];
    terminal.current.write(commandBuffer.current);
  };

  /**
   * Clears the current command line
   */
  const clearCommandLine = () => {
    // Clear the current input line
    terminal.current.write("\r\x1b[K"); // Carriage return and clear line
    terminal.current.write(`\x1b[1;32m${user}@${hostname}\x1b[0m:\x1b[1;34m~\x1b[0m$ `);
    commandBuffer.current = "";
  };

  /**
   * Processes and executes a command
   * @param {string} input - The command string to process
   */
  const processCommand = (input) => {
    const args = input.split(" ");
    const command = args[0].toLowerCase();
    const commandArgs = args.slice(1);

    // Direct lookup instead of conditional checks
    const commandFn = commands[command];
    if (commandFn) {
      commandFn(commandArgs);
    } else {
      terminal.current.writeln(`bash: ${command}: command not found`);
      prompt();
    }
  };

  /**
   * Command definitions - optimize by pre-computing repeated strings
   */
  const commands = {
    // Help command - shows available commands
    help: () => {
      // Use pre-formatted help text for better performance
      const helpText = [
        "Available Commands",
        "",
        "SYSTEM:",
        "  clear                  - Clear the terminal",
        "  echo [text]            - Display text",
        "  date                   - Display the current date and time",
        "  whoami                 - Display the current user",
        "  uname                  - Display system information",
        "  reboot                 - Restart the terminal",
        "",
        "PORTFOLIO:",
        "  projects               - List all projects",
        "  skills                 - Display technical skills",
        "  about                  - Display about Ash",
        "  contact                - Display contact information",
        "  resume                 - View resume",
        "",
        "OTHER:",
        "  banner                 - Display the welcome banner",
        "  neofetch               - Display system information",
        "  exit                   - Exit the terminal",
        "",
        "TIP: Use arrow up/down keys for command history."
      ].join("\r\n");
      
      terminal.current.writeln(helpText);
      prompt();
    },

    // Clear command - clears the terminal
    clear: () => {
      terminal.current.clear();
      prompt();
    },

    // ECHO command - display text
    echo: (args) => {
      terminal.current.writeln(args.join(" "));
      prompt();
    },

    // WHOAMI command - display current user
    whoami: () => {
      terminal.current.writeln(user);
      prompt();
    },

    // DATE command - display current date and time
    date: () => {
      terminal.current.writeln(new Date().toString());
      prompt();
    },

    // UNAME command - display system information
    uname: (args) => {
      if (args.includes("-a")) {
        terminal.current.writeln("Fedora Linux 41 (Workstation Edition) x86_64 JavaScript React");
      } else {
        terminal.current.writeln("Fedora Linux 41 (Workstation Edition)");
      }
      prompt();
  },

    // BANNER command - display the welcome banner
    banner: () => {
      displayBanner();
      prompt();
    },

    // EXIT command - close the terminal
    exit: () => {
      const exitMessage = "Goodbye! Thanks for visiting Ash's portfolio.\r\nSession ended. Refresh to restart.";
      terminal.current.writeln(exitMessage);

  setTimeout(() => {
    terminal.current.write("\r\nPress any key to restart...");
    const disposable = terminal.current.onKey(() => {
      window.location.reload();
      disposable.dispose();
    });
  }, 1000);
},

    // REBOOT command - restart the terminal
    reboot: () => {
      terminal.current.writeln("Rebooting system...");
      setTimeout(() => window.location.reload(), 1000);
    },

    // NEOFETCH command - display system information in a fancy way
    neofetch: () => {
      const osInfo = {
        OS: "Fedora Linux 41 (Workstation Edition)",
        Host: "terminal",
        Kernel: "Linux 6.13.7-200.fc41.x86_64",
        Uptime: "Always up",
        Shell: "bash",
        CPU: "11th Gen Intel® Core™ i3-1115G4 × 4",
        Memory: "8.0 GiB",
        User: user,
      };

      // Check if mobile device for smaller ASCII art
      const isMobile = window.innerWidth < 480;

      // Pre-compose output for better performance
      const asciiArt = isMobile
        ? [
            "\x1b[36m     _         _       ",
          "    / \\   ___| |__    ", 
          "   / _ \\ / __| '_ \\   ",
          "  / ___ \\\\__ \\ | | |  ",
          " /_/   \\_\\___/_| |_|  \x1b[0m",
          ].join("\r\n")
        : [
            "\x1b[36m       _       _        ", 
            "      / \\   ___| |__   ",
            "     / _ \\ / __| '_ \\  ",
            "    / ___ \\\\__ \\ | | | ",
            "   /_/   \\_\\___/_| |_| \x1b[0m"
          ].join("\r\n");
      
      const colorBlocks = isMobile
        ? "\x1b[30m■\x1b[31m■\x1b[32m■\x1b[33m■\x1b[34m■\x1b[35m■\x1b[36m■\x1b[37m■\x1b[0m\r\n\x1b[1;30m■\x1b[1;31m■\x1b[1;32m■\x1b[1;33m■\x1b[1;34m■\x1b[1;35m■\x1b[1;36m■\x1b[1;37m■\x1b[0m"
        : [
            "\x1b[30m███\x1b[31m███\x1b[32m███\x1b[33m███\x1b[34m███\x1b[35m███\x1b[36m███\x1b[37m███\x1b[0m",
            "\x1b[1;30m███\x1b[1;31m███\x1b[1;32m███\x1b[1;33m███\x1b[1;34m███\x1b[1;35m███\x1b[1;36m███\x1b[1;37m███\x1b[0m"
          ].join("\r\n");
      
      // Build system info based on screen size
      let systemInfo = `\x1b[1;36m${user}@portfolio\x1b[0m\r\n\x1b[1;36m---------------\x1b[0m\r\n`;
      
      // On mobile, show fewer system details
      const mobileEntries = ['OS', 'User', 'Shell', 'Uptime'];
      Object.entries(osInfo).forEach(([key, value]) => {
        if (!isMobile || mobileEntries.includes(key)) {
          systemInfo += `\x1b[1;33m${key}:\x1b[0m ${value}\r\n`;
        }
      });

      // Write with fewer operations
      terminal.current.writeln(asciiArt);
      terminal.current.writeln("");
      terminal.current.writeln(colorBlocks);
      terminal.current.writeln("");
      terminal.current.write(systemInfo);

    prompt();
  },

    // PROJECTS command - list all projects
    projects: () => {
      terminal.current.writeln("Projects");
      terminal.current.writeln("");
      terminal.current.writeln(portfolioContent.projects);
      prompt();
    },

      // SKILLS command - display technical skills
      skills: () => {
      terminal.current.writeln("Technical Skills");
      terminal.current.writeln("");
      
      // Pre-process categories for more efficient output
      let skillsOutput = "";
      Object.entries(portfolioContent.skills).forEach(([category, skillsList]) => {
        skillsOutput += `${category.charAt(0).toUpperCase() + category.slice(1)}:\r\n`;
        skillsList.forEach(skill => {
          skillsOutput += `  * ${skill}\r\n`;
        });
        skillsOutput += "\r\n";
      });
      
      terminal.current.write(skillsOutput);
        prompt();
      },

        // ABOUT command - show information about me
        about: () => {
      terminal.current.writeln("About Ash");
      terminal.current.writeln("");
      terminal.current.writeln(portfolioContent.about);
          prompt();
        },

          // CONTACT command - display contact information
          contact: () => {
      terminal.current.writeln("Contact Information");
      terminal.current.writeln("");
      
      // Pre-compose contact info for fewer write operations
      const contactText = [
        "Contact Links:",
        `Email:     ${portfolioContent.contact.email}`,
        `Work:      ${portfolioContent.contact.work}`, 
        `GitHub:    https://${portfolioContent.contact.github}`,
        `Twitter:   https://twitter.com/${portfolioContent.contact.twitter.replace('@', '')}`,
        `Telegram:  https://t.me/${portfolioContent.contact.telegram.replace('@', '')}`
      ].join("\r\n");
      
      terminal.current.writeln(contactText);
            prompt();
          },

            // RESUME command - view resume
            resume: () => {
      terminal.current.writeln("Resume");
      terminal.current.writeln("");
      terminal.current.writeln(portfolioContent.resume);
              prompt();
            },

                // HISTORY command - show command history
                history: () => {
      // Build history output in one string
      let historyOutput = history.current.map((cmd, index) => 
        `${index + 1}  ${cmd}`
      ).join("\r\n");
      
      terminal.current.writeln(historyOutput);
                      prompt();
    }
  };

  /**
   * Handle key input from the on-screen keyboard
   * @param {string} character - The character to process
   */
  const handleKeyInput = (character) => {
    // Add character to command buffer
    commandBuffer.current += character;
    
    // Write the character to the terminal
    terminal.current.write(character);
  };

  /**
   * Add touch interface support for mobile devices
   */
  const addMobileTouchSupport = () => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile || !terminalRef.current) return;
    
    const container = terminalRef.current;
    
    // Virtual keyboard state
    let virtualInput = null;
    const createVirtualKeyboard = () => {
      // Remove any existing virtual inputs first
      if (virtualInput && document.body.contains(virtualInput)) {
        document.body.removeChild(virtualInput);
      }
      
      // Create a visible input field for mobile
      virtualInput = document.createElement('input');
      virtualInput.setAttribute('type', 'text');
      virtualInput.setAttribute('placeholder', 'Type command...');
      virtualInput.className = 'mobile-virtual-input';
      virtualInput.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        padding: 12px 10px;
        background: rgba(30, 30, 30, 0.95);
        color: white;
        border: none;
        border-top: 1px solid #555;
        font-size: 16px;
        z-index: 1001;
        font-family: monospace;
      `;
      
      // Handle input events
      virtualInput.addEventListener('input', (e) => {
        // Clear current command line first
        clearCommandLine();
        
        // Then write the current input value
        const text = e.target.value;
        commandBuffer.current = text;
        terminal.current.write(text);
      });
      
      // Handle form submission (Enter key press)
      virtualInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleEnterKey();
          virtualInput.value = '';
        }
      });
      
      // Add to DOM
      document.body.appendChild(virtualInput);
      virtualInput.focus();
      
      return virtualInput;
    };
    
    // Toggle button to show/hide keyboard
    const toggleBtn = document.createElement('button');
    toggleBtn.innerText = '⌨️ Keyboard';
    toggleBtn.className = 'mobile-input-button';
    toggleBtn.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      border: 1px solid #444;
      border-radius: 5px;
      padding: 8px 12px;
      font-size: 14px;
      z-index: 1000;
      opacity: 0.9;
    `;
    
    // Toggle virtual keyboard
    let keyboardVisible = false;
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      keyboardVisible = !keyboardVisible;
      
      if (keyboardVisible) {
        // Show keyboard
        toggleBtn.innerText = '▼ Hide';
        createVirtualKeyboard();
      } else {
        // Hide keyboard
        toggleBtn.innerText = '⌨️ Keyboard';
        if (virtualInput && document.body.contains(virtualInput)) {
          document.body.removeChild(virtualInput);
        }
      }
    });
    
    // Add toggle button to container
    container.appendChild(toggleBtn);
    
    // Also create a tap area that covers most of the terminal
    const tapArea = document.createElement('div');
    tapArea.className = 'terminal-tap-area';
    tapArea.style.cssText = `
      position: fixed;
      top: 60px;
      left: 0;
      right: 0;
      bottom: 50px;
      z-index: 900;
      cursor: pointer;
    `;
    
    // Show keyboard when tapping anywhere in the terminal
    tapArea.addEventListener('click', () => {
      if (!keyboardVisible) {
        keyboardVisible = true;
        toggleBtn.innerText = '▼ Hide';
        createVirtualKeyboard();
      }
    });
    
    container.appendChild(tapArea);
    
    // Add touch event listeners for swipe navigation
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
  };
  
  // Track touch positions for swipe detection
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  
  /**
   * Handle touch start events
   */
  const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  };
  
  /**
   * Handle touch end events
   */
  const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    
    // Detect gesture
    handleGesture();
  };
  
  /**
   * Process touch gestures
   */
  const handleGesture = () => {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Minimum swipe distance (in pixels)
    const minSwipeDistance = 50;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          // Right swipe - show previous command
          if (historyIndex.current > 0) {
            historyIndex.current--;
            showHistoryCommand();
          }
        } else {
          // Left swipe - show next command
          if (historyIndex.current < history.current.length - 1) {
            historyIndex.current++;
            showHistoryCommand();
          } else {
            // At end of history, clear command line
            clearCommandLine();
          }
        }
      }
    } else {
      // Vertical swipe - could be used for scrolling
      // Implemented by default in the terminal
    }
  };

return (
  <div
    ref={terminalRef}
    className="terminal-container"
    style={{
      width: "100%",
      height: "100vh",
      backgroundColor: "#1E1E1E",
        padding: window.innerWidth < 768 ? "5px" : "10px", // Smaller padding on mobile
      boxSizing: "border-box",
      overflow: "hidden",
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)"
    }}
  />
);
};

export default LinuxTerminalPortfolio;
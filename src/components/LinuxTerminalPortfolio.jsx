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
      fontSize: 15,
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
    }, 100);
    window.addEventListener("resize", handleResize);

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
    };
  }, []);

  /**
   * Displays the welcome banner with ASCII art
   */
  const displayBanner = () => {
    // Batch write operations for better performance
    const bannerText = [
      "\x1b[36m                 _     _         _                      _             _ ",
      "  __ _  ___| |__ ( )___   | |_ ___ _ __ _ __ ___ (_)_ __   __ _| |",
      " / _` |/ __| '_ \\|// __|  | __/ _ \\ '__| '_ ` _ \\| | '_ \\ / _` | |",
      "| (_| |\\__ \\ | | | \\__ \\  | ||  __/ |  | | | | | | | | | | (_| | |",
      " \\__,_||___/_| |_| |___/   \\__\\___|_|  |_| |_| |_|_|_| |_|\\__,_|_|\x1b[0m",
      "",
      "\x1b[1;32mWelcome to Ash's Terminal!\x1b[0m",
      "Type \x1b[1;34mhelp\x1b[0m to see available commands.",
      "\x1b[1;31m⚠️  IMPORTANT:\x1b[0m \x1b[1mPlease use the commands responsibly.\x1b[0m",
      "\x1b[1;33m📝 FEEDBACK:\x1b[0m \x1b[1mFor suggestions or issues, contact \x1b[4ma83h@proton.me\x1b[0m\x1b[1m\x1b[0m",
    ].join("\r\n");
    
    terminal.current.write(bannerText + "\r\n");
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
        "\x1b[1;36m┌─────────────────────────────────────────┐\x1b[0m",
        "\x1b[1;36m│\x1b[0m           \x1b[1;37mAVAILABLE COMMANDS\x1b[0m           \x1b[1;36m│\x1b[0m",
        "\x1b[1;36m└─────────────────────────────────────────┘\x1b[0m",
        "",
        "\x1b[1;33m📊 SYSTEM:\x1b[0m",
        "  \x1b[1;32mclear\x1b[0m                  - Clear the terminal",
        "  \x1b[1;32mecho\x1b[0m [text]            - Display text",
        "  \x1b[1;32mdate\x1b[0m                   - Display the current date and time",
        "  \x1b[1;32mwhoami\x1b[0m                 - Display the current user",
        "  \x1b[1;32muname\x1b[0m                  - Display system information",
        "  \x1b[1;32mreboot\x1b[0m                 - Restart the terminal",
        "",
        "\x1b[1;35m💼 PORTFOLIO:\x1b[0m",
        "  \x1b[1;32mprojects\x1b[0m               - List all projects",
        "  \x1b[1;32mskills\x1b[0m                 - Display technical skills",
        "  \x1b[1;32mabout\x1b[0m                  - Display about Ash",
        "  \x1b[1;32mcontact\x1b[0m                - Display contact information",
        "  \x1b[1;32mresume\x1b[0m                 - View resume",
        "",
        "\x1b[1;34m🔧 OTHER:\x1b[0m",
        "  \x1b[1;32mbanner\x1b[0m                 - Display the welcome banner",
        "  \x1b[1;32mneofetch\x1b[0m               - Display Ash's system information",
        "  \x1b[1;32mexit\x1b[0m                   - Exit the terminal",
        "",
        "\x1b[1;33m💡 TIP:\x1b[0m Use arrow \x1b[1m↑\x1b[0m \x1b[1m↓\x1b[0m keys for command history."
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

      // Pre-compose output for better performance
      const asciiArt = [
        "\x1b[36m       _       _        ", 
        "      / \\   ___| |__   ",
        "     / _ \\ / __| '_ \\  ",
        "    / ___ \\\\__ \\ | | | ",
        "   /_/   \\_\\___/_| |_| \x1b[0m"
      ].join("\r\n");
      
      const colorBlocks = [
        "\x1b[30m███\x1b[31m███\x1b[32m███\x1b[33m███\x1b[34m███\x1b[35m███\x1b[36m███\x1b[37m███\x1b[0m",
        "\x1b[1;30m███\x1b[1;31m███\x1b[1;32m███\x1b[1;33m███\x1b[1;34m███\x1b[1;35m███\x1b[1;36m███\x1b[1;37m███\x1b[0m"
      ].join("\r\n");
      
      // Build system info in one go
      let systemInfo = `\x1b[1;36m${user}@portfolio\x1b[0m\r\n\x1b[1;36m---------------\x1b[0m\r\n`;
      Object.entries(osInfo).forEach(([key, value]) => {
        systemInfo += `\x1b[1;33m${key}:\x1b[0m ${value}\r\n`;
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
      terminal.current.writeln("\x1b[1;36m┌─────────────────────────────────────┐\x1b[0m");
      terminal.current.writeln("\x1b[1;36m│\x1b[0m           \x1b[1;37mMY PROJECTS\x1b[0m           \x1b[1;36m│\x1b[0m");
      terminal.current.writeln("\x1b[1;36m└─────────────────────────────────────┘\x1b[0m");
      terminal.current.writeln("");
      terminal.current.writeln("\x1b[1;33m" + portfolioContent.projects + "\x1b[0m");
      prompt();
    },

    // SKILLS command - display technical skills
    skills: () => {
      terminal.current.writeln("\x1b[1;36m┌─────────────────────────────────────┐\x1b[0m");
      terminal.current.writeln("\x1b[1;36m│\x1b[0m         \x1b[1;37mTECHNICAL SKILLS\x1b[0m         \x1b[1;36m│\x1b[0m");
      terminal.current.writeln("\x1b[1;36m└─────────────────────────────────────┘\x1b[0m");
      terminal.current.writeln("");
      
      // Pre-process categories for more efficient output
      let skillsOutput = "";
      Object.entries(portfolioContent.skills).forEach(([category, skillsList]) => {
        skillsOutput += `\x1b[1;33m${category.charAt(0).toUpperCase() + category.slice(1)}:\x1b[0m\r\n`;
        skillsList.forEach(skill => {
          skillsOutput += `  \x1b[1;32m•\x1b[0m ${skill}\r\n`;
        });
        skillsOutput += "\r\n";
      });
      
      terminal.current.write(skillsOutput);
      prompt();
    },

    // ABOUT command - show information about me
    about: () => {
      terminal.current.writeln("\x1b[1;36m┌─────────────────────────────────────┐\x1b[0m");
      terminal.current.writeln("\x1b[1;36m│\x1b[0m            \x1b[1;37mABOUT ASH\x1b[0m            \x1b[1;36m│\x1b[0m");
      terminal.current.writeln("\x1b[1;36m└─────────────────────────────────────┘\x1b[0m");
      terminal.current.writeln("");
      terminal.current.writeln(portfolioContent.about);
      prompt();
    },

    // CONTACT command - display contact information
    contact: () => {
      terminal.current.writeln("\x1b[1;36m┌─────────────────────────────────────┐\x1b[0m");
      terminal.current.writeln("\x1b[1;36m│\x1b[0m        \x1b[1;37mCONTACT INFORMATION\x1b[0m       \x1b[1;36m│\x1b[0m");
      terminal.current.writeln("\x1b[1;36m└─────────────────────────────────────┘\x1b[0m");
      terminal.current.writeln("");
      
      // Pre-compose contact info for fewer write operations
      const contactText = [
        "\x1b[1;33m🔗 Click the links below to contact me:",
        `\x1b[1;34m📧 Email:\x1b[0m     \x1b[1;36mmailto:${portfolioContent.contact.email}\x1b[0m`,
        `\x1b[1;34m💼 Work:\x1b[0m      \x1b[1;36m[click here for work email]\x1b[0m`, 
        `\x1b[1;34m🐙 GitHub:\x1b[0m    \x1b[1;36mhttps://${portfolioContent.contact.github}\x1b[0m`,
        `\x1b[1;34m🐦 Twitter:\x1b[0m   \x1b[1;36mhttps://twitter.com/${portfolioContent.contact.twitter.replace('@', '')}\x1b[0m`,
        `\x1b[1;34m✈️ Telegram:\x1b[0m  \x1b[1;36mhttps://t.me/${portfolioContent.contact.telegram.replace('@', '')}\x1b[0m`
      ].join("\r\n");
      
      terminal.current.writeln(contactText);
      prompt();
    },

    // RESUME command - view resume
    resume: () => {
      terminal.current.writeln("\x1b[1;36m┌─────────────────────────────────────┐\x1b[0m");
      terminal.current.writeln("\x1b[1;36m│\x1b[0m             \x1b[1;37mRESUME\x1b[0m              \x1b[1;36m│\x1b[0m");
      terminal.current.writeln("\x1b[1;36m└─────────────────────────────────────┘\x1b[0m");
      terminal.current.writeln("");
      terminal.current.writeln("\x1b[1;31m" + portfolioContent.resume + "\x1b[0m");
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

  return (
    <div
      ref={terminalRef}
      className="terminal-container"
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#1E1E1E",
        padding: "10px",
        boxSizing: "border-box",
        overflow: "hidden",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)"
      }}
    />
  );
};

export default LinuxTerminalPortfolio;
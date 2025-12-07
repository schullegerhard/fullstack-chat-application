import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import boxicons CSS
const boxiconsLink = document.createElement("link");
boxiconsLink.rel = "stylesheet";
boxiconsLink.href = "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css";
document.head.appendChild(boxiconsLink);

// Import fonts from Google Fonts
const fontsLink = document.createElement("link");
fontsLink.rel = "stylesheet";
fontsLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap";
document.head.appendChild(fontsLink);

// Set page title
const titleElement = document.createElement("title");
titleElement.textContent = "Cross-Chain Identity Vault";
document.head.appendChild(titleElement);

createRoot(document.getElementById("root")!).render(<App />);

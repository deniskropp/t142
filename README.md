<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Space Format Console

This project is a web-based console for interacting with the Space format, a meta-data format for LLM applications. It allows users to load and interact with different sections of a Gemini Space, such as prompts, context, and configurations.

View your app in AI Studio: https://ai.studio/apps/drive/1_Xk4-a1GvpKQdMKbdxqqHNIXuOCtPjBf

## ✨ Features

- **Load from local files:** Users can load `⫻` sections from their local file system.
- **Interactive UI:** A user-friendly interface to view and manage different sections.
- **Gemini Integration:** Powered by the Gemini API for advanced functionalities.
- **Syntax Highlighting:** Code sections are highlighted for better readability.

## 🚀 Tech Stack

- **Framework:** [React](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **AI:** [Gemini API](https://ai.google.dev/)
- **Icons:** [Lucide React](https://lucide.dev/guide/react)

## 📦 Project Structure

```
/
├── .gitignore
├── App.tsx
├── components/
│   └── SectionCard.tsx
├── index.html
├── index.tsx
├── metadata.json
├── package.json
├── README.md
├── services/
│   └── geminiService.ts
├── tsconfig.json
├── types.ts
├── utils/
│   └── parser.ts
└── vite.config.ts
```

##  local_development

**Prerequisites:**

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

**Installation:**

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/space-format-console.git
    cd space-format-console
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root directory and add your Gemini API key:

    ```
    GEMINI_API_KEY=your_gemini_api_key
    ```

**Running the application:**

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`.

### 📜 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Serves the production build locally for preview.

## 🤝 Contributing

Contributions are welcome! Here's how you can get started:

1.  **Fork the repository.**
2.  **Create a new branch:** `git checkout -b feature/your-feature-name`
3.  **Make your changes.**
4.  **Commit your changes:** `git commit -m "feat: add your feature"`
5.  **Push to the branch:** `git push origin feature/your-feature-name`
6.  **Create a pull request.**

###  conventions

- **Code Style:** We follow the standard TypeScript and React conventions. Please ensure your code is well-formatted and readable.
- **Commit Messages:** We use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format for our commit messages.
- **Pull Requests:** Please provide a detailed description of your changes in the pull request.

## ⚖️ License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
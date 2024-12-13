# QuantumCrypto Frontend

Welcome to the frontend repository of QuantumCrypto! This project aims to
gamify quantum cryptography protocols for quantum computing education. The
frontend is built with React, Next.js, Tailwind CSS,
and [Zustand](https://github.com/pmndrs/zustand).

## Introduction

QuantumCrypto is an innovative framework designed to provide an interactive
multiplayer learning experience for understanding quantum cryptography
protocols and quantum computing concepts.

## Prerequisites

- Node.js version 18.17 or higher. You can install this using Homebrew ('brew install node'). Alternatively, you can install Node Version Manager (NVM) which is a tool that let's you install and switch between different versions of Node.js.
- npm (this should come bundled with Node.js)
- Git

## Running Locally

To run the QuantumCrypto frontend locally, follow these steps:

1. Clone this repository to your local machine

2. Navigate to the project directory:
   ```
   cd quantumcrypto-frontend
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Create a .env.local file following the .env.sample file included in the repo. This file contains the URL addresses of the backend API and the WebSocket. Their values will depend on where you run the backend application. For example, your 'NEXT_PUBLIC_API_URL' might be 'http://localhost:8000' and the 'NEXT_PUBLIC_WEBSOCKET_URL' might be 'ws://localhost:8000/ws'.
   

6. Open your browser and visit `http://localhost:3000` to view the
   QuantumCrypto frontend.

**Note:** Make sure to also run the backend server locally for full
functionality. You can find the backend
repository [here](https://github.com/algolab-quantique/quantumcrypto-backend).

## Useful VS Code extensions

These are the VS Code extensions you should have installed to make your life easier with this project:
- Tailwind CSS IntelliSense
- Simple React Snippets
- Prettier
- Color info

## Contributing

We welcome contributions from the community to help improve QuantumCrypto. If
you'd like to contribute, please follow these guidelines:

1. Fork the repository and create a new branch for your feature or fix.

2. Make your changes and ensure that the code follows the project's coding
   standards.

3. Write tests for your changes to maintain code quality.

4. Submit a pull request with a clear description of your changes and their
   purpose.

5. Your pull request will be reviewed by the project maintainers, and any
   necessary feedback will be provided.

Thank you for contributing to QuantumCrypto! We appreciate your support in
making quantum computing education accessible and engaging for all.

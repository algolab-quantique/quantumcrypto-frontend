# QuantumCrypto Frontend

Welcome to the frontend repository of QuantumCrypto! This project aims to
gamify quantum cryptography protocols for quantum computing education. The
frontend is built with React, Next.js, Tailwind CSS,
and [Zustand](https://github.com/pmndrs/zustand).

## Introduction

QuantumCrypto is an innovative framework designed to provide an interactive
multiplayer learning experience for understanding quantum cryptography
protocols and quantum computing concepts.

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

4. Check for build errors (recommended):
   ```
   npm run build
   ```
   This ensures your code has no syntax errors, linting issues, or build problems before development.

5. Start the development server:
   ```
   npm run dev
   ```

6. Open your browser and visit `http://localhost:3000` to view the
   QuantumCrypto frontend.

**Note:**
- Make sure to also run the backend server locally for full
functionality. You can find the backend repository [here](https://github.com/algolab-quantique/quantumcrypto-backend).

- Confirm that .env.local is present and contains the right values whenever you set up the project; otherwise the frontend will fail to reach the API or WebSocket server.

To connect the frontend to the backend, create a `.env.local` file in the project root (or update it if it already exists):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:8000
```

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
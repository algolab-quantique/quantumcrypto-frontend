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

## Running the full stack (for multiplayer)

Solo mode works with the frontend alone — the whole protocol is simulated in your browser.
**Multiplayer needs the backend running.**

1. **Start the backend** — follow "Running Locally" in the
   [backend repo](https://github.com/algolab-quantique/quantumcrypto-backend).
   (It needs Redis as well; the steps are there.)

2. **Connect the frontend** — copy the template:

   ```bash
   cp .env.example .env.local
   ```

   The defaults already point at a backend running locally on port 8000, so
   usually there is nothing to change. `.env.example` explains what each variable
   does — including why `NEXT_PUBLIC_WEBSOCKET_URL` must end in `/ws`.

   `.env.local` is **git-ignored on purpose**: it is your own machine's config.
   Never commit it — in production these values come from the host instead.

3. **Start the frontend** — `npm run dev`, then open http://localhost:3000

**Testing multiplayer on one machine:** every tab of the same browser shares the same
`localStorage`, so two tabs are **not** two players — the second overwrites the first.
Use a normal window plus an incognito window (or two different browsers).

### Test mode (developers)

By default the app uses **production** photon counts, which are the values students should
see. While developing you may want fewer photons so a game finishes faster. Uncomment this
line in your own `.env.local` and restart `npm run dev`:

```env
NEXT_PUBLIC_QC_TEST_MODE=true
```

`.env.local` is git-ignored, so this affects only your machine and can never reach
production. Leaving it out is what gives you production values — see `lib/test-mode.ts`.

## Deploying

`npm run build` produces a standard Next.js 14 production build, and `npm start` serves it. Any
host that runs Next.js works — Vercel, AWS Amplify, Netlify, a container, or your own Node
server. Node.js 18.17+ is required.

The only host-specific step is setting `NEXT_PUBLIC_API_URL` and
`NEXT_PUBLIC_WEBSOCKET_URL` in your host's environment
**before the build runs**: they are `NEXT_PUBLIC_*`, so they are baked into the client bundle at
build time. Changing them later requires a rebuild. Use `https://` and `wss://` in production.

Before deploying, run the same three checks CI runs on every push:

```bash
npm test          # unit tests (Vitest)
npx tsc --noEmit  # type check
npm run lint
```

> **Algolab teammates:** our own production deployment uses a separate private repository and is
> documented there, not here — ask the team for `DEPLOYMENT_GUIDE.md`.

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
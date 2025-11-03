# Cashu BRRR 💸

**Print your own money with Cashu ecash!**

There are no central banks if everyone is a central bank.

## Features

- 🖨️ **Print physical cashu notes** - Create beautiful printable ecash notes
- 🎨 **Customizable designs** - Multiple templates (Comic, Custom, Mountainlake)
- ⚡ **Lightning & Ecash payments** - Flexible payment options
- 📄 **QR code optimization** - Smart denomination suggestions for readable QR
  codes
- 🗂️ **Print history** - Reprint previous notes easily

## How to use

1. Go to `http://brrr.gandlaf.com`
2. Select the cashu mint you want to use
3. Select the denomination and number of notes you want to print
4. Pay using ecash or lightning
5. Design and Customize your notes
6. Printer goes brrr

## Requirements

- Node.js (v18+)
- npm

## Running local development environment

1. Fork and Clone the repository
   ```bash
   git clone https://github.com/yourusername/cashu-brrr.git
   cd cashu-brrr
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Building for production

1. Build the application
   ```bash
   npm run build
   ```

2. The build artifacts will be in the `dist` directory

3. Preview the production build
   ```bash
   npm run preview
   ```

## Project Structure

```
src/
├── types/              # TypeScript type definitions
├── core/               # Business logic
├── components/         # UI components
├── features/           # Feature modules
├── lib/                # Utilities & legacy code
└── state/              # State management
```

## License

This project is licensed under the GNU General Public License v3.0 - see the
[LICENSE](LICENSE) file for details.

### GNU GPL v3.0

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

## Credits

Built with ❤️ for the Cashu community

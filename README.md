# Cashu BRRR 💸

**Print your own money with Cashu ecash!**

There are no central banks if everyone is a central bank.

## Features

- 🖨️ **Print physical cashu notes** - Create beautiful printable ecash notes
- 🎨 **Customizable designs** - Multiple templates (Comic, Custom, Mountainlake)
- ⚡ **Lightning & Ecash payments** - Flexible payment options
- 📄 **QR code optimization** - Smart denomination suggestions for readable QR
  codes
- � **Print history** - Reprint previous notes easily
- �️ **Mountainlake mint default** - Pre-configured with trusted mint

## How to use

1. Go to `http://brrr.gandlaf.com`
2. Select the cashu mint you want to use
3. Select the denomination and number of notes you want to print
4. Design and Customize your notes
5. Pay using ecash or lightning
6. Printer goes brrr

## Requirements

- Node.js (v18+)
- npm

## Running local development environment

1. Clone the repository
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

## Testing

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

## Architecture

The codebase uses a modern, modular architecture:

- **Modular Note Templates**: Composable note components (QR, Logo, Text,
  Denomination)
- **Storage Abstraction**: Support for LocalStorage and Pubky
- **Type Safety**: Strict TypeScript throughout
- **Testing**: Comprehensive test coverage with Vitest
- **State Management**: Centralized Svelte stores

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed documentation.

## Migration Guide

If you're upgrading from the legacy codebase, see [MIGRATION.md](MIGRATION.md)
for step-by-step instructions.

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

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture and design patterns
- [MIGRATION.md](MIGRATION.md) - Migration guide from legacy code
- [REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md) - Summary of refactoring work

## Contributing

We welcome contributions! Please:

1. Follow the architecture patterns in `ARCHITECTURE.md`
2. Add tests for new features
3. Maintain type safety
4. Update documentation as needed

## License

MIT

## Credits

Built with ❤️ for the Cashu community

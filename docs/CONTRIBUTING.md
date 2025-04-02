# Contributing Guidelines

Thank you for your interest in contributing to the Yemen Property Rental Platform! This document outlines the process for contributing to the project and provides guidelines to make it easier for you to make contributions.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a positive environment for everyone.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/property-rental-platform.git
   cd property-rental-platform
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up your environment** following the [Installation Guide](INSTALLATION.md)
5. **Create a branch** for your contribution:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. **Implement your changes** following the coding standards below
2. **Test your changes** thoroughly
3. **Commit your changes** with clear, descriptive commit messages:
   ```bash
   git commit -m "feat: add new feature for property filtering"
   ```
4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create a Pull Request** from your fork to the main repository

## Coding Standards

### General Guidelines

- Follow the existing code style and patterns
- Write self-documenting code with clear variable and function names
- Keep functions small and focused on a single responsibility
- Add comments only when necessary to explain complex logic

### TypeScript Guidelines

- Always use TypeScript types and interfaces
- Avoid `any` type when possible
- Use functional components with React hooks
- Use interface definitions for component props
- Add JSDoc comments to interfaces and components

### CSS Guidelines

- Use Tailwind CSS for styling
- Follow the existing component styling patterns
- Ensure responsive design works on all screen sizes
- Test styles across different browsers

### Git Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Changes that don't affect code functionality (formatting, etc.)
- `refactor:` - Code changes that neither fix a bug nor add a feature
- `perf:` - Performance improvements
- `test:` - Adding or correcting tests
- `chore:` - Changes to the build process or auxiliary tools

## Pull Request Process

1. **Update the documentation** if needed
2. **Ensure all tests pass** before submitting
3. **Link any related issues** in your PR description
4. **Write a clear PR description** explaining the purpose and implementation details
5. **Be responsive** to feedback and questions during the review process
6. **Squash commits** before merging if requested by maintainers

## Testing Guidelines

- Write tests for new features and bug fixes
- Ensure existing tests continue to pass
- For frontend components, include tests for different states and user interactions
- For backend functions, test edge cases and error conditions

## Bug Reports and Feature Requests

- Use the GitHub Issues tab to report bugs or request features
- Check if a similar issue already exists before creating a new one
- For bug reports, include detailed steps to reproduce, expected behavior, and actual behavior
- For feature requests, explain the use case and benefits clearly

## Code Review

- All code changes require review before merging
- Reviewers will check for code quality, test coverage, and adherence to these guidelines
- Address review comments promptly
- Request additional reviews when necessary

## Recognition

Contributors will be acknowledged in the project's README.md and/or CONTRIBUTORS.md file.

## Questions?

If you have any questions about contributing, feel free to open an issue marked as a question or contact the maintainers directly.

Thank you for contributing to the Yemen Property Rental Platform! 
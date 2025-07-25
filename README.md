# Web Components with Lit

A modern web components library built with Lit, providing reusable, lightweight, and framework-agnostic components for web applications.

## Description

This project demonstrates the power of Web Components using the Lit library to create custom elements that work across different frameworks and vanilla JavaScript applications. Lit provides a simple and fast way to build web components with declarative templates, reactive properties, and a component lifecycle.

## Main Features

- ⚡ **Fast & Lightweight**: Built with Lit for optimal performance
- 🧩 **Framework Agnostic**: Works with React, Vue, Angular, or vanilla JS
- 🎨 **Customizable**: Easy to theme and style with CSS custom properties
- 📱 **Responsive**: Mobile-first design approach
- ♿ **Accessible**: Built with accessibility best practices
- 🔄 **Reactive**: Automatic re-rendering when properties change
- 📦 **Tree Shakable**: Import only what you need
- 🌐 **Modern Browser Support**: Uses modern web standards

## Installation

### Prerequisites

Make sure you have Node.js installed (version 16 or higher recommended):

```bash
node --version
npm --version
```

### Install Dependencies

```bash
# Clone the repository
git clone <your-repository-url>
cd <project-name>

# Install dependencies
npm install
```

## Getting Started

### Development Server

Start the development server with hot reloading:

```bash
npm run dev
```

The development server will start at `http://localhost:3000` (or another available port).

### Build for Production

Create an optimized production build:

```bash
npm run build
```

The built files will be generated in the `dist` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
├── src/
│   ├── components/          # Web components
│   │   ├── my-button.ts
│   │   ├── my-card.ts
│   │   └── index.ts
│   ├── styles/             # Global styles and themes
│   │   ├── global.css
│   │   └── tokens.css
│   ├── utils/              # Utility functions
│   └── index.ts            # Main entry point
├── demo/                   # Demo pages and examples
├── dist/                   # Built files (generated)
├── public/                 # Static assets
├── package.json
├── vite.config.js          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── README.md
```

## Usage

### Basic Example

```javascript
// Import the component
import './src/components/my-button.js';

// Use in HTML
<my-button variant="primary" size="large">
  Click me!
</my-button>
```

### With Properties

```javascript
// Set properties programmatically
const button = document.querySelector('my-button');
button.disabled = true;
button.loading = false;
button.addEventListener('click', (e) => {
  console.log('Button clicked!', e.detail);
});
```

### In React

```jsx
import React from 'react';
import './src/components/my-button.js';

function App() {
  const handleClick = (e) => {
    console.log('Button clicked!', e.detail);
  };

  return (
    <div>
      <my-button 
        variant="secondary" 
        onClick={handleClick}
      >
        React Button
      </my-button>
    </div>
  );
}
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reloading |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run storybook` | Start Storybook for component development |
| `npm run analyze` | Analyze bundle size |

## Component Development

### Creating a New Component

1. Create a new TypeScript file in `src/components`:

```typescript
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-component')
export class MyComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }
  `;

  @property({ type: String })
  title = '';

  render() {
    return html`
      <h2>${this.title}</h2>
      <slot></slot>
    `;
  }
}
```

2. Export the component in `src/components/index.ts`:

```typescript
export './my-component.js';
```

### Styling Components

Components can be styled using:
- Lit's `css` template literal for component styles
- CSS custom properties for theming
- External stylesheets
- Tailwind CSS (if configured)

## Testing

Run the test suite:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Resources

- [Lit Documentation](https://lit.dev/)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)
- [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)

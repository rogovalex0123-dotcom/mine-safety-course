# Web Development Skill: JavaScript, CSS, and HTML

## Overview
This skill provides comprehensive guidance for creating modern, standards-compliant web applications using HTML, CSS, and JavaScript. Follow these practices to produce clean, maintainable, and performant code.

## HTML Best Practices

### Document Structure
- Always use HTML5 doctype: `<!DOCTYPE html>`
- Include proper `<meta>` tags for charset, viewport, and description
- Use semantic HTML5 elements: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`
- Maintain proper heading hierarchy (h1 → h2 → h3, etc.)

### Accessibility
- Include `alt` attributes on all images
- Use `aria-label` and `aria-describedby` for enhanced accessibility
- Ensure proper form labeling with `<label for="id">` or wrapping labels
- Use `role` attributes when semantic elements aren't sufficient
- Maintain keyboard navigation support with proper `tabindex` values
- Ensure color contrast meets WCAG standards

### Best Practices
- Keep markup clean and minimal
- Use data attributes for JavaScript hooks: `data-action="submit"`
- Avoid inline styles and scripts
- Use meaningful IDs and class names
- Validate HTML using W3C validator principles

## CSS Best Practices

### Organization and Structure
- Use a consistent methodology (BEM, SMACSS, or utility-first)
- Order properties logically: positioning → box model → typography → visual → misc
- Group related styles together
- Use CSS custom properties (variables) for maintainability

### Modern CSS Features
- Prefer Flexbox and Grid for layouts
- Use CSS custom properties: `--primary-color: #007bff;`
- Leverage modern pseudo-classes: `:is()`, `:where()`, `:has()`
- Use logical properties: `margin-inline`, `padding-block`
- Implement `clamp()` for responsive typography
- Use `aspect-ratio` for maintaining proportions

### Responsive Design
- Mobile-first approach with `min-width` media queries
- Use relative units: `rem`, `em`, `%`, `vw`, `vh`
- Create fluid typography with `clamp()`
- Test across multiple viewport sizes
- Use `container queries` for component-level responsiveness when appropriate

### Performance
- Minimize specificity conflicts
- Avoid `!important` unless absolutely necessary
- Use shorthand properties where appropriate
- Optimize selectors for performance
- Minimize repaints and reflows
- Use `will-change` sparingly for animations

### Naming Conventions
```css
/* BEM Example */
.block {}
.block__element {}
.block--modifier {}

/* Utility Classes */
.mt-4 { margin-top: 1rem; }
.flex { display: flex; }
```

## JavaScript Best Practices

### Code Quality
- Use `const` by default, `let` when reassignment is needed, avoid `var`
- Follow consistent naming conventions:
  - camelCase for variables and functions
  - PascalCase for classes and constructors
  - UPPER_SNAKE_CASE for constants
- Write self-documenting code with clear variable names
- Add comments for complex logic, not obvious code
- Keep functions small and single-purpose

### Modern JavaScript (ES6+)
- Use arrow functions for callbacks and methods
- Leverage destructuring for objects and arrays
- Use template literals for string interpolation
- Employ spread/rest operators
- Use optional chaining: `obj?.prop?.nested`
- Use nullish coalescing: `value ?? defaultValue`
- Implement async/await for asynchronous code
- Use modules (import/export) for code organization

### DOM Manipulation
- Cache DOM queries in variables
- Use `querySelector` and `querySelectorAll`
- Prefer event delegation for dynamic elements
- Remove event listeners when no longer needed
- Use `DocumentFragment` for batch DOM updates
- Minimize reflows and repaints

### Event Handling
```javascript
// Event delegation
document.addEventListener('click', (e) => {
  if (e.target.matches('.button')) {
    handleButtonClick(e);
  }
});

// Remove listeners
const handler = () => console.log('clicked');
element.addEventListener('click', handler);
element.removeEventListener('click', handler);
```

### Error Handling
- Use try-catch blocks for error-prone code
- Provide meaningful error messages
- Handle promise rejections
- Validate user input
- Use optional chaining to prevent errors

### Performance
- Debounce/throttle expensive operations
- Use `requestAnimationFrame` for animations
- Lazy load images and content
- Minimize DOM manipulations
- Use Web Workers for heavy computations
- Implement code splitting when appropriate

### Security
- Sanitize user input to prevent XSS
- Use `textContent` instead of `innerHTML` when possible
- Validate data on both client and server
- Use Content Security Policy headers
- Avoid `eval()` and `Function()` constructor

## File Structure Examples

### Single Page Application
```
project/
├── index.html
├── css/
│   ├── main.css
│   ├── components.css
│   └── utilities.css
├── js/
│   ├── main.js
│   ├── components/
│   │   ├── header.js
│   │   └── footer.js
│   └── utils/
│       ├── api.js
│       └── helpers.js
└── assets/
    ├── images/
    └── fonts/
```

## Complete Example Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Page description">
  <title>Page Title</title>
  <style>
    /* CSS Custom Properties */
    :root {
      --primary-color: #007bff;
      --secondary-color: #6c757d;
      --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --spacing-unit: 1rem;
    }

    /* Reset */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    /* Base Styles */
    body {
      font-family: var(--font-family);
      line-height: 1.6;
      color: #333;
    }

    /* Layout */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--spacing-unit);
    }

    /* Components */
    .button {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .button:hover {
      background-color: #0056b3;
    }

    /* Responsive */
    @media (min-width: 768px) {
      .container {
        padding: 0 2rem;
      }
    }
  </style>
</head>
<body>
  <header>
    <nav class="container">
      <h1>Site Title</h1>
    </nav>
  </header>

  <main class="container">
    <section>
      <h2>Section Title</h2>
      <button class="button" data-action="submit">Click Me</button>
    </section>
  </main>

  <footer class="container">
    <p>&copy; 2024 Company Name</p>
  </footer>

  <script>
    // JavaScript Module Pattern
    const App = (() => {
      // Private variables
      const config = {
        apiUrl: '/api',
        timeout: 5000
      };

      // Private methods
      const handleClick = (event) => {
        const action = event.target.dataset.action;
        if (action === 'submit') {
          console.log('Button clicked');
        }
      };

      // Initialize
      const init = () => {
        // Event delegation
        document.addEventListener('click', (e) => {
          if (e.target.matches('.button')) {
            handleClick(e);
          }
        });
      };

      // Public API
      return {
        init
      };
    })();

    // Start application
    document.addEventListener('DOMContentLoaded', App.init);
  </script>
</body>
</html>
```

## Common Patterns

### Fetching Data
```javascript
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
```

### Form Validation
```javascript
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  if (validateForm(data)) {
    submitForm(data);
  }
});

function validateForm(data) {
  // Validation logic
  return true;
}
```

### Debounce Function
```javascript
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Usage
const searchInput = document.querySelector('#search');
const debouncedSearch = debounce((e) => {
  console.log('Search:', e.target.value);
}, 300);

searchInput.addEventListener('input', debouncedSearch);
```

### Local Storage Helper
```javascript
const Storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },
  
  remove(key) {
    localStorage.removeItem(key);
  }
};
```

## Testing Checklist

### Cross-Browser Testing
- Test in Chrome, Firefox, Safari, and Edge
- Check mobile browsers (iOS Safari, Chrome Mobile)
- Verify polyfills for older browsers if needed

### Performance Testing
- Check Lighthouse scores
- Optimize images and assets
- Minimize JavaScript bundle size
- Use browser DevTools Performance tab

### Accessibility Testing
- Use screen reader to test navigation
- Check keyboard-only navigation
- Verify color contrast ratios
- Test with accessibility tools (axe, WAVE)

## Common Pitfalls to Avoid

1. **Not declaring variables**: Always use `const` or `let`
2. **Memory leaks**: Remove event listeners and clear timers
3. **Blocking the main thread**: Use async operations for heavy tasks
4. **Ignoring null/undefined**: Use optional chaining and null checks
5. **Poor error handling**: Always catch and handle errors appropriately
6. **Inline styles**: Keep CSS separate from HTML
7. **Over-nesting**: Keep HTML and CSS flat when possible
8. **Not minifying production code**: Always optimize for production
9. **Ignoring accessibility**: Build accessible interfaces from the start
10. **Not testing on real devices**: Emulators don't catch everything

## Resources

- MDN Web Docs: Comprehensive JavaScript, HTML, CSS reference
- Can I Use: Browser compatibility checking
- CSS-Tricks: Modern CSS techniques and patterns
- JavaScript.info: In-depth JavaScript tutorials
- Web.dev: Performance and best practices guidance

## Version Notes

This skill is optimized for modern browsers (2023+) and assumes ES6+ JavaScript support. For legacy browser support, consider using Babel transpilation and appropriate polyfills.

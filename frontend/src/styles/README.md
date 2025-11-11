# CSS Helpers and Utilities Guide

This guide explains how to use the CSS helpers and utilities available in the project to maintain consistency and avoid code duplication.

## 📁 File Structure

```
src/styles/
├── tokens.css          # Design tokens (variables)
├── global.css          # Global styles and imports
├── mixins.scss         # Sass mixins for reusable patterns
└── utilities.css       # Utility classes for common patterns
```

## 🎨 Design Tokens (`tokens.css`)

All design values are centralized in `tokens.css` and should be used instead of hardcoded values:

```css
/* ❌ Don't do this */
.title {
  color: #333;
  margin-bottom: 16px;
  font-size: 18px;
}

/* ✅ Do this */
.title {
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
  font-size: var(--text-lg);
}
```

## 🧩 Sass Mixins (`mixins.scss`)

### When to Use Sass Mixins

Convert your CSS module to SCSS (`.module.scss`) when you need:

- Complex responsive breakpoints
- Reusable pattern combinations
- Advanced styling logic

### Available Mixins

#### Responsive Breakpoints

```scss
@use "../../../../styles/mixins" as m;

.component {
  // Mobile styles

  @include m.tablet-up {
    // Tablet and above
  }

  @include m.desktop-up {
    // Desktop and above
  }

  @include m.mobile-only {
    // Mobile only
  }
}
```

#### Layout Patterns

```scss
.section {
  @include m.section-layout; // Standard section margin
}

.title {
  @include m.section-title; // Standard section title
}

.grid {
  @include m.flex-grid(var(--spacing-md)); // Flex grid with gap
}

.card {
  @include card-container; // Card styling with hover
}
```

#### Typography

```scss
  @include m.card-container; // Card styling with hover
}

.memberName {
  @include m.member-name; // Standard member name styling
}

.memberRole {
  @include m.member-role; // Standard member role styling
}

.heroText {
  @include m.hero-text(var(--text-xl)); // Hero text with shadow
}

.truncatedText {
  @include m.text-truncate(2); // Truncate to 2 lines
}
```

#### Image Mixins

```scss
.poster {
  @include m.aspect-image("2/3"); // Poster aspect ratio
  @include m.hover-zoom-image(1.05); // Hover zoom effect
}

.imageFallback {
  @include m.image-fallback-container; // Missing image placeholder
}
```

#### Interactive Mixins

```scss
.interactiveElement {
  @include m.focus-outline(var(--color-primary)); // Accessible focus
  @include m.hover-lift(4px); // Hover lift effect
```

#### Images

```scss
.poster {
  @include aspect-image("2/3"); // Poster aspect ratio
  @include hover-zoom-image(1.05); // Hover zoom effect
}

.fallback {
  @include image-fallback-container; // Missing image placeholder
}
```

#### Interactions

```scss
.button {
  @include focus-outline(var(--color-primary)); // Accessible focus
  @include hover-lift(4px); // Hover lift effect
}
```

### Example: Converting CSS to SCSS

**Before (CSS Module):**

```css
.castCard {
  flex: 1;
  min-width: 150px;
}

@media (max-width: 575.99px) {
  .castCard {
    min-width: calc(50% - 8px);
  }
}

@media (min-width: 768px) {
  .castCard {
    min-width: calc(25% - 16px);
  }
}

.memberName {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}
```

**After (SCSS Module):**

```scss
@import "../../../../styles/mixins";

.castCard {
  flex: 1;
  min-width: 150px;

  @include m.mobile-only {
    min-width: calc(50% - var(--spacing-sm));
  }

  @include m.desktop-up {
    min-width: calc(25% - var(--spacing-md));
  }
}

.memberName {
  @include m.member-name;
}
```

## 🛠️ CSS Utilities (`utilities.css`)

### When to Use Utility Classes

Use utilities for:

- Simple, single-purpose styling
- Consistent spacing and layout
- Quick prototyping
- Avoiding inline styles

### Available Utilities

#### Layout

```html
<div class="u-flex u-flex-center u-flex-gap-md">
  <span>Centered content with gap</span>
</div>

<div class="u-grid-auto-fit">
  <div>Auto-fit grid items</div>
</div>
```

#### Spacing

```html
<h1 class="u-margin-bottom-lg">Title with large bottom margin</h1>
<div class="u-padding-md">Content with medium padding</div>
```

#### Typography

```html
<h2 class="u-text-truncate-2">Long title that truncates after 2 lines</h2>
<p class="u-member-name">Consistent member name styling</p>
<span class="u-member-role">Consistent role styling</span>
```

#### Images

```html
<img class="u-aspect-poster u-hover-zoom" src="poster.jpg" alt="Movie poster" />
<div class="u-image-fallback u-aspect-square">
  <span>No image available</span>
</div>
```

#### Interactions

```html
<button class="u-interactive u-hover-lift u-focus-outline">
  Interactive button
</button>
```

#### Responsive

```html
<div class="u-text-center-mobile">Mobile center, desktop left</div>
<span class="u-hide-mobile">Hidden on mobile</span>
<span class="u-show-mobile u-hide-desktop-up">Mobile only</span>
```

## 📋 Best Practices

### 1. Choose the Right Tool

| Use Case              | Tool                  | Example                         |
| --------------------- | --------------------- | ------------------------------- |
| Simple spacing/layout | CSS Utilities         | `u-margin-bottom-lg`            |
| Complex responsive    | Sass Mixins           | `@include m.desktop-up { ... }` |
| Component-specific    | CSS Modules           | `.componentSpecificStyle`       |
| Design values         | CSS Custom Properties | `var(--spacing-lg)`             |

### 2. Naming Conventions

```scss
// ❌ Don't use generic names
.content {
}
.box {
}
.item {
}

// ✅ Use descriptive, scoped names
.movieCardContent {
}
.castMemberBox {
}
.reviewListItem {
}
```

### 3. Combine Approaches

```scss
@use "../../../../styles/mixins" as m;

.movieCard {
  @include m.card-container; // Mixin for complex styling

  @include m.desktop-up {
    // Mixin for responsive
    max-width: 300px;
  }
}

.movieTitle {
  @include member-name; // Mixin for typography
}
```

```html
<div class="movieCard u-margin-bottom-md">
  <!-- Class + utility -->
  <h3 class="movieTitle u-text-truncate-2">Long Movie Title</h3>
</div>
```

### 4. Import Order

```scss
// 1. Sass mixins (when needed)
@import "../../../../styles/mixins";

// 2. Component-specific styles
.component {
  // styles here
}

// 3. Responsive overrides
@include m.desktop-up {
  .component {
    // responsive styles
  }
}
```

## 🔄 Migration Guide

### Step 1: Identify Patterns

Look for repeating:

- Media queries
- Typography styles
- Layout patterns
- Spacing values

### Step 2: Choose Approach

- **Sass mixins**: Complex patterns, multiple properties
- **CSS utilities**: Simple patterns, single purpose

### Step 3: Refactor Incrementally

```scss
// Before
.title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

// Step 1: Use design tokens
.title {
  font-size: var(--text-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
}

// Step 2: Use mixin (if pattern repeats)
.title {
  @include section-title;
}
```

## 🎯 Benefits

### Code Reduction

- **Before**: 50+ lines of repetitive CSS
- **After**: 5 lines with mixins/utilities

### Consistency

- Standardized spacing, typography, and responsive behavior
- Design token usage across all components

### Maintainability

- Change breakpoints in one place
- Update typography scale globally
- Consistent hover/focus states

### Developer Experience

- Faster development with pre-built patterns
- Less decision fatigue
- Self-documenting code

## 🚀 Examples in Practice

### Component with Full Pattern Usage

```scss
@import "../../../../styles/mixins";

.movieSection {
  @include section-layout;

  .sectionTitle {
    @include section-title;
  }

  .movieGrid {
    @include responsive-grid(200px, 300px);

    .movieCard {
      @include card-container;

      .poster {
        @include aspect-image("2/3");
        @include hover-zoom-image();
      }

      .movieTitle {
        @include member-name;
        @include text-truncate(2);
      }

      .movieYear {
        @include m.member-role;
      }

      @include m.desktop-up {
        &:hover {
          @include m.hover-lift();
        }
      }
    }
  }
}
```

This approach eliminates code duplication while maintaining flexibility and readability! 🎉

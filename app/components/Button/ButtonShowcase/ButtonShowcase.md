# Button Showcase Component

This component demonstrates the different states and sizes of the reusable `Button` component.

## Usage

Import and use the `ButtonShowcase` component in your project:

```jsx
import ButtonShowcase from './ButtonShowcase';

export default function App() {
    return (
        <div>
            <ButtonShowcase />
        </div>
    );
}
```

## Button Variations

The showcase includes buttons in three sizes: **Large**, **Medium**, and **Small**. Each size has the following states:

- **Selected**
    - Default
    - Focused
    - Disabled
- **Unselected**
    - Default
    - Focused
    - Disabled

### Example:

```jsx
<Button size='large' selected>
  Large Selected
</Button>

<Button size='medium' disabled>
  Medium Disabled
</Button>

<Button size='small'>
  Small Default
</Button>
```

## Styling

The component uses CSS modules. You can customize styles in `ButtonShowcase.module.css`.

---

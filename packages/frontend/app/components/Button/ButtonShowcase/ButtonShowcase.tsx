import React, { useState } from 'react';

// SimpleButton Component (your original component with CSS modules)
const SimpleButton = ({
    bg = 'accent1',
    hoverBg,
    className = '',
    ...props
}) => {
    const capitalize = (value) =>
        value.charAt(0).toUpperCase() + value.slice(1);

    // Using CSS modules classes
    const bgClass = styles[bg];
    const hoverClass = hoverBg ? styles[`hover${capitalize(hoverBg)}`] : '';

    return (
        <button
            className={`${styles.simpleButton} ${bgClass} ${hoverClass} ${className}`}
            {...props}
        />
    );
};

// Main Showcase Component
export default function ButtonShowcase() {
    const [showCode, setShowCode] = useState({});

    const backgroundColors = [
        'green',
        'red',
        'accent1',
        'accent2',
        'accent3',
        'accent4',
        'accent5',
        'dark1',
        'dark2',
        'dark3',
        'dark4',
        'dark5',
        'dark6',
    ];

    const toggleCode = (section) => {
        setShowCode((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const CodeBlock = ({ children, title }) => (
        <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
                <span>{title}</span>
                <button
                    className={styles.copyBtn}
                    onClick={() => navigator.clipboard.writeText(children)}
                >
                    Copy
                </button>
            </div>
            <pre className={styles.codeContent}>
                <code>{children}</code>
            </pre>
        </div>
    );

    return (
        <div className={styles.showcase}>
            <div className={styles.showcaseHeader}>
                <h1>SimpleButton Component Showcase</h1>
                <p>
                    A comprehensive guide to using the SimpleButton component
                    with all its variations, states, and hover effects.
                </p>
            </div>

            {/* Basic Usage */}
            <section className={styles.showcaseSection}>
                <div className={styles.sectionHeader}>
                    <h2>Basic Usage</h2>
                    <button
                        className={styles.toggleCode}
                        onClick={() => toggleCode('basic')}
                    >
                        {showCode.basic ? 'Hide Code' : 'Show Code'}
                    </button>
                </div>

                <div className={styles.buttonGrid}>
                    <div className={styles.buttonDemo}>
                        <SimpleButton>Default Button</SimpleButton>
                        <span className={styles.buttonLabel}>
                            Default (accent1)
                        </span>
                    </div>
                </div>

                {showCode.basic && (
                    <CodeBlock title='Basic Usage'>
                        {`<SimpleButton>Default Button</SimpleButton>
<SimpleButton bg="accent2">Custom Background</SimpleButton>`}
                    </CodeBlock>
                )}
            </section>

            {/* All Background Colors */}
            <section className={styles.showcaseSection}>
                <div className={styles.sectionHeader}>
                    <h2>Background Colors</h2>
                    <button
                        className={styles.toggleCode}
                        onClick={() => toggleCode('backgrounds')}
                    >
                        {showCode.backgrounds ? 'Hide Code' : 'Show Code'}
                    </button>
                </div>

                <div className={styles.buttonGrid}>
                    {backgroundColors.map((color) => (
                        <div key={color} className={styles.buttonDemo}>
                            <SimpleButton bg={color}>{color}</SimpleButton>
                            <span className={styles.buttonLabel}>
                                bg="{color}"
                            </span>
                        </div>
                    ))}
                </div>

                {showCode.backgrounds && (
                    <CodeBlock title='Background Colors'>
                        {`// All available background colors
${backgroundColors.map((color) => `<SimpleButton bg="${color}">${color}</SimpleButton>`).join('\n')}`}
                    </CodeBlock>
                )}
            </section>

            {/* Custom Hover States */}
            <section className={styles.showcaseSection}>
                <div className={styles.sectionHeader}>
                    <h2>Custom Hover States</h2>
                    <p>Hover over these buttons to see custom hover colors</p>
                    <button
                        className={styles.toggleCode}
                        onClick={() => toggleCode('hover')}
                    >
                        {showCode.hover ? 'Hide Code' : 'Show Code'}
                    </button>
                </div>

                <div className={styles.buttonGrid}>
                    <div className={styles.buttonDemo}>
                        <SimpleButton bg='dark1' hoverBg='green'>
                            Dark → Green
                        </SimpleButton>
                        <span className={styles.buttonLabel}>
                            bg="dark1" hoverBg="green"
                        </span>
                    </div>
                    <div className={styles.buttonDemo}>
                        <SimpleButton bg='accent1' hoverBg='red'>
                            Accent1 → Red
                        </SimpleButton>
                        <span className={styles.buttonLabel}>
                            bg="accent1" hoverBg="red"
                        </span>
                    </div>
                    <div className={styles.buttonDemo}>
                        <SimpleButton bg='green' hoverBg='accent2'>
                            Green → Accent2
                        </SimpleButton>
                        <span className={styles.buttonLabel}>
                            bg="green" hoverBg="accent2"
                        </span>
                    </div>
                    <div className={styles.buttonDemo}>
                        <SimpleButton bg='dark6' hoverBg='accent4'>
                            Dark6 → Accent4
                        </SimpleButton>
                        <span className={styles.buttonLabel}>
                            bg="dark6" hoverBg="accent4"
                        </span>
                    </div>
                </div>

                {showCode.hover && (
                    <CodeBlock title='Custom Hover States'>
                        {`<SimpleButton bg="dark1" hoverBg="green">Dark → Green</SimpleButton>
<SimpleButton bg="accent1" hoverBg="red">Accent1 → Red</SimpleButton>
<SimpleButton bg="green" hoverBg="accent2">Green → Accent2</SimpleButton>`}
                    </CodeBlock>
                )}
            </section>

            {/* Disabled States */}
            <section className={styles.showcaseSection}>
                <div className={styles.sectionHeader}>
                    <h2>Disabled States</h2>
                    <p>
                        All buttons show the same disabled appearance regardless
                        of their background color
                    </p>
                    <button
                        className={styles.toggleCode}
                        onClick={() => toggleCode('disabled')}
                    >
                        {showCode.disabled ? 'Hide Code' : 'Show Code'}
                    </button>
                </div>

                <div className={styles.buttonGrid}>
                    <div className={styles.buttonDemo}>
                        <SimpleButton disabled>Disabled Default</SimpleButton>
                        <span className={styles.buttonLabel}>disabled</span>
                    </div>
                    <div className={styles.buttonDemo}>
                        <SimpleButton bg='green' disabled>
                            Disabled Green
                        </SimpleButton>
                        <span className={styles.buttonLabel}>
                            bg="green" disabled
                        </span>
                    </div>
                    <div className={styles.buttonDemo}>
                        <SimpleButton bg='accent2' disabled>
                            Disabled Accent2
                        </SimpleButton>
                        <span className={styles.buttonLabel}>
                            bg="accent2" disabled
                        </span>
                    </div>
                    <div className={styles.buttonDemo}>
                        <SimpleButton bg='red' hoverBg='green' disabled>
                            Disabled with Hover
                        </SimpleButton>
                        <span className={styles.buttonLabel}>
                            disabled (hover ignored)
                        </span>
                    </div>
                </div>

                {showCode.disabled && (
                    <CodeBlock title='Disabled States'>
                        {`<SimpleButton disabled>Disabled Button</SimpleButton>
<SimpleButton bg="green" disabled>Disabled Green</SimpleButton>
<SimpleButton bg="accent2" disabled>Disabled Accent2</SimpleButton>`}
                    </CodeBlock>
                )}
            </section>

            {/* Interactive Demo */}
            <section className={styles.showcaseSection}>
                <div className={styles.sectionHeader}>
                    <h2>Interactive Demo</h2>
                    <p>Click these buttons to see them in action</p>
                </div>

                <div className={styles.buttonGrid}>
                    <div className={styles.buttonDemo}>
                        <SimpleButton onClick={() => alert('Primary action!')}>
                            Primary Action
                        </SimpleButton>
                        <span className={styles.buttonLabel}>
                            onClick handler
                        </span>
                    </div>
                    <div className={styles.buttonDemo}>
                        <SimpleButton
                            bg='green'
                            onClick={() => alert('Success!')}
                        >
                            Success
                        </SimpleButton>
                        <span className={styles.buttonLabel}>
                            Success button
                        </span>
                    </div>
                    <div className={styles.buttonDemo}>
                        <SimpleButton bg='red' onClick={() => alert('Danger!')}>
                            Danger
                        </SimpleButton>
                        <span className={styles.buttonLabel}>
                            Danger button
                        </span>
                    </div>
                </div>
            </section>

            {/* Props Documentation */}
            <section className={styles.showcaseSection}>
                <div className={styles.sectionHeader}>
                    <h2>Props Documentation</h2>
                </div>

                <div className={styles.propsTable}>
                    <div className={styles.propsHeader}>
                        <span>Prop</span>
                        <span>Type</span>
                        <span>Default</span>
                        <span>Description</span>
                    </div>
                    <div className={styles.propsRow}>
                        <code>bg</code>
                        <span>BackgroundColor</span>
                        <code>'accent1'</code>
                        <span>Background color of the button</span>
                    </div>
                    <div className={styles.propsRow}>
                        <code>hoverBg</code>
                        <span>BackgroundColor</span>
                        <code>undefined</code>
                        <span>
                            Custom hover background color (overrides default
                            hover)
                        </span>
                    </div>
                    <div className={styles.propsRow}>
                        <code>className</code>
                        <span>string</span>
                        <code>''</code>
                        <span>Additional CSS classes</span>
                    </div>
                    <div className={styles.propsRow}>
                        <code>...props</code>
                        <span>ButtonHTMLAttributes</span>
                        <code>-</code>
                        <span>
                            All standard button props (onClick, disabled, etc.)
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );
}

// CSS Modules styles object simulation
const styles = {
    // SimpleButton styles (your original styles)
    simpleButton: 'simple-button',
    green: 'bg-green',
    red: 'bg-red',
    accent1: 'bg-accent1',
    accent2: 'bg-accent2',
    accent3: 'bg-accent3',
    accent4: 'bg-accent4',
    accent5: 'bg-accent5',
    dark1: 'bg-dark1',
    dark2: 'bg-dark2',
    dark3: 'bg-dark3',
    dark4: 'bg-dark4',
    dark5: 'bg-dark5',
    dark6: 'bg-dark6',
    hoverGreen: 'hover-green',
    hoverRed: 'hover-red',
    hoverAccent1: 'hover-accent1',
    hoverAccent2: 'hover-accent2',
    hoverAccent3: 'hover-accent3',
    hoverAccent4: 'hover-accent4',
    hoverAccent5: 'hover-accent5',
    hoverDark1: 'hover-dark1',
    hoverDark2: 'hover-dark2',
    hoverDark3: 'hover-dark3',
    hoverDark4: 'hover-dark4',
    hoverDark5: 'hover-dark5',
    hoverDark6: 'hover-dark6',

    // Showcase styles
    showcase: 'showcase',
    showcaseHeader: 'showcase-header',
    showcaseSection: 'showcase-section',
    sectionHeader: 'section-header',
    buttonGrid: 'button-grid',
    buttonDemo: 'button-demo',
    buttonLabel: 'button-label',
    toggleCode: 'toggle-code',
    codeBlock: 'code-block',
    codeHeader: 'code-header',
    codeContent: 'code-content',
    copyBtn: 'copy-btn',
    propsTable: 'props-table',
    propsHeader: 'props-header',
    propsRow: 'props-row',
};

// Inject styles
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = cssText;
    document.head.appendChild(styleElement);
}

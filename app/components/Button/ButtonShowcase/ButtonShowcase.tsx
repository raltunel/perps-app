import Button from '~/components/Button/Button';
import type { Route } from '../../../+types/root';
import styles from './ButtonShowcase.module.css';
export function meta({}: Route.MetaArgs) {
    return [
        { title: 'BUTTON SHOWCASE' },
        { name: 'description', content: 'Welcome to React Router!' },
    ];
}

export default function ButtonShowcase() {
    return (
        <div className={styles.container}>
            <h1>Button Showcase</h1>
            <div className={styles.grid}>
                {/* Large Buttons */}
                <div className={styles.buttonGroup}>
                    <h2>Large</h2>
                    <h3>SELECTED</h3>
                    <Button size='large' selected>
                        Large Default
                    </Button>
                    <Button size='large' selected>
                        Large Focused
                    </Button>
                    <Button size='large' selected disabled>
                        Large Disabled
                    </Button>
                    <h3>UNSELECTED</h3>
                    <Button size='large'>Large Default</Button>
                    <Button size='large'>Large Focused</Button>
                    <Button size='large' disabled>
                        Large Disabled
                    </Button>
                </div>

                {/* Medium Buttons */}
                <div className={styles.buttonGroup}>
                    <h2>Medium</h2>
                    <h3>SELECTED</h3>

                    <Button size='medium' selected>
                        Medium Default
                    </Button>
                    <Button size='medium' selected>
                        Medium Focused
                    </Button>
                    <Button size='medium' selected disabled>
                        Medium Disabled
                    </Button>
                    <h3>UNSELECTED</h3>

                    <Button size='medium'>Medium Default</Button>
                    <Button size='medium'>Medium Focused</Button>
                    <Button size='medium' disabled>
                        Medium Disabled
                    </Button>
                </div>

                {/* Small Buttons */}
                <div className={styles.buttonGroup}>
                    <h2>Small</h2>
                    <h3>SELECTED</h3>

                    <Button size='small' selected>
                        Small Default
                    </Button>
                    <Button size='small' selected>
                        Small Focused
                    </Button>
                    <Button size='small' selected disabled>
                        Small Disabled
                    </Button>
                    <h3>UNSELECTED</h3>

                    <Button size='small'>Small Default</Button>
                    <Button size='small'>Small Focused</Button>
                    <Button size='small' disabled>
                        Small Disabled
                    </Button>
                </div>
            </div>
        </div>
    );
}

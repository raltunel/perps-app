import styles from './DocWrapper.module.css';

interface DocWrapperProps {
    children: React.ReactNode;
    title: string;
}

function DocWrapper(props: DocWrapperProps) {
    const { children, title } = props;

    return (
        <div className={`${styles.container}`}>
            <div className={styles.innerContainer}>
                <header>{title}</header>
                <div className={styles.docContent}>{children}</div>
            </div>
        </div>
    );
}
export default DocWrapper;

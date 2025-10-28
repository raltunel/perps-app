import styles from './DocWrapper.module.css';

interface DocWrapperProps {
    children: React.ReactNode;
    title: string;
}

function DocWrapper(props: DocWrapperProps) {
    const { children, title } = props;

    return (
        <div className={`${styles.container} ${styles.fullScreen} `}>
            <header>{title}</header>
            <div className={styles.content}>{children}</div>
        </div>
    );
}
export default DocWrapper;

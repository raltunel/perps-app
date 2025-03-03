// import styles from './testpage.module.css';
import { useModal } from '../../hooks/useModal';

interface propsIF {

}

// main react fn
export default function testpage(props: propsIF) {
    false && props;

    const [isModalOpen, open, close] = useModal(true);

    return (
        <div>
            <button onClick={open}>Open Modal</button>
            <button onClick={close}>Close Modal</button>
            <h3>Modal is: {isModalOpen.toString()}</h3>
        </div>
    );
}
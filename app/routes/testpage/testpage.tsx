// import styles from './testpage.module.css';
import { useModal, type useModalIF } from '../../hooks/useModal';

interface propsIF {

}

// main react fn
export default function testpage(props: propsIF) {
    false && props;

    const modalControl: useModalIF = useModal();

    return (
        <div>
            <button onClick={modalControl.open}>Open Modal</button>
            <button onClick={modalControl.close}>Close Modal</button>
            <h3>Modal is: {modalControl.isOpen.toString()}</h3>
        </div>
    );
}
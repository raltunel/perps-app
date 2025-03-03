// import styles from './testpage.module.css';
import { useModal, type useModalMethods } from '../../hooks/useModal';

interface propsIF {

}

// main react fn
export default function testpage(props: propsIF) {
    false && props;

    const [isModalOpen, open, close]: useModalMethods = useModal(3500);

    return (
        <div>
            <button onClick={open}>Open Modal</button>
            <button onClick={close}>Close Modal</button>
            <h3>Modal is: {isModalOpen.toString()}</h3>
        </div>
    );
}
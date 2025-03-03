import Modal from "~/components/Modal/Modal";
import { type useModalIF, useModal } from "~/hooks/useModal";

interface propsIF {

}

// main react fn
export default function testpage(props: propsIF) {
    false && props;

    const MODAL_ID = 'my_modal';

    const modalControl: useModalIF = useModal('closed');

    return (
        <div>
            <button onClick={() => modalControl.open()}>Open Modal</button>
            {modalControl.isOpen && <Modal
                idForDOM={MODAL_ID}
            >
                <p>hi there!!</p>
                <button onClick={modalControl.close}>Close Me</button>
            </Modal>
            }
        </div>
    );
}
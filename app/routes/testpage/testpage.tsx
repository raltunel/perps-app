import Modal from "~/components/Modal/Modal";
import Options from "~/components/Options/Options";
import { type useModalIF, useModal } from "~/hooks/useModal";

interface propsIF {

}

// main react fn
export default function testpage(props: propsIF) {
    false && props;

    const modalControl: useModalIF = useModal('closed');

    return (
        <div>
            <button onClick={() => modalControl.open()}>Open Modal</button>
            {modalControl.isOpen && (
                <Modal close={modalControl.close}>
                    <Options modalControl={modalControl} />
                </Modal>
            )}
        </div>
    );
}
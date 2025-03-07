import AppOptions from "~/components/AppOptions/AppOptions";
import Modal from "~/components/Modal/Modal";
import { type useModalIF, useModal } from "~/hooks/useModal";

interface propsIF {

}

// main react fn
export default function testpage(props: propsIF) {
    false && props;

    const modalControl: useModalIF = useModal('closed');

    return (
        <div>
            {/* interactable to open modal on user action */}
            <button onClick={() => modalControl.open()}>Open Modal</button>
            {/* format to insantiate modal in the DOM */}
            {modalControl.isOpen && (
                <Modal close={modalControl.close}>
                    <AppOptions modalControl={modalControl} />
                </Modal>
            )}
        </div>
    );
}

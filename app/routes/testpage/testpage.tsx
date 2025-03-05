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
                    <section
                        style={{
                            backgroundColor: 'orange',
                            height: '500px',
                            width: '300px',
                            outline: '3px solid green',
                        }}
                    >
                        <button onClick={modalControl.close}>Close</button>
                        <h2>Options Menu!</h2>
                    </section>
                </Modal>
            )}
        </div>
    );
}

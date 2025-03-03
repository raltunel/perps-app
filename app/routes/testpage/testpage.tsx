import Modal from "~/components/Modal/Modal";

interface propsIF {

}

// main react fn
export default function testpage(props: propsIF) {
    false && props;

    const MODAL_ID = 'my_modal';

    function toggleModal(): void {
        const dialog = document.getElementById(MODAL_ID) as HTMLDialogElement;
        if (dialog?.open) {
            dialog.close();
        } else {
            dialog.showModal();
        }
    }

    return (
        <div>
            <button onClick={() => toggleModal()}>Open Modal</button>
            <Modal
                idForDOM={MODAL_ID}
                close={toggleModal}
            />
        </div>
    );
}
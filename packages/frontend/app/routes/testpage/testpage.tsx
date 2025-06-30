import Announcement from '~/components/Announcement/Announcement';

export default function testpage() {
    return (
        <div>
            <Announcement
                type='update'
                position='bottom-right'
                // onClose={onClose}
                // className={className}
            >
                <div>this is just testing the Announcement</div>
            </Announcement>
        </div>
    );
}

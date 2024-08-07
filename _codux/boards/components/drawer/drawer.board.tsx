import { createBoard } from '@wixc3/react-board';
import { Drawer } from '~/components/drawer/drawer';
import { useState } from 'react';

export default createBoard({
    name: 'Drawer',
    Board: () => {
        const [isOpen, setIsOpen] = useState(true);
        return (
            <div>
                <button onClick={() => setIsOpen(true)}>Toggle Drawer</button>
                {isOpen && (
                    <Drawer title="Title" onClose={() => setIsOpen(false)}>
                        <div>this is content</div>
                    </Drawer>
                )}
            </div>
        );
    },
    tags: ['Component'],
    isSnippet: true,
});

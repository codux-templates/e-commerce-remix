import { createBoard } from '@wixc3/react-board';
import { useState } from 'react';
import { Drawer } from '~/components/drawer/drawer';

export default createBoard({
    name: 'Drawer',
    Board: () => {
        const [isOpen, setIsOpen] = useState(true);
        return (
            <div>
                <button onClick={() => setIsOpen(true)}>Toggle Drawer</button>

                <Drawer title="Title" onClose={() => setIsOpen(false)} isOpen={isOpen}>
                    <div>this is a drawer inner content</div>
                </Drawer>
            </div>
        );
    },
    tags: ['Component'],
    isSnippet: true,
});

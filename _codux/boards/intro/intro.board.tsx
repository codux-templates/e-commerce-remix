import { createBoard } from '@wixc3/react-board';
import styles from './intro.module.scss';

export default createBoard({
    name: '🌱 Intro',
    Board: () => (
        <div className={styles.container}>
            <div className={styles.content}>
                <p className={styles.title}>
                    HOW TO USE <br /> E-COMMERCE STARTER?
                </p>
                <p className={styles.description}>
                    Welcome to Codux e-commerce starter. <br /> This template was built to help you create your own
                    store easily. Use Codux to design your website the way you want, and Wix Headless e-commerce
                    services to manage your store.
                    <a href={'https://help.codux.com/kb/en/article/kb37137'}>
                        <button className="introButton">Learn more</button>
                    </a>
                </p>
            </div>
        </div>
    ),
    environmentProps: {
        windowWidth: 1024,
        windowHeight: 768,
    },
});

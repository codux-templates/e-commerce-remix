import { createBoard } from '@wixc3/react-board';
import commonStyles from '~/styles/common-styles.module.scss';
import styles from './intro.module.scss';

export default createBoard({
    name: '🌱 Intro',
    Board: () => (
        <div className={styles.container}>
            <p className={styles.myStyle}>
                HOW TO USE <br /> E-COMMERCE STARTER?
            </p>
            <p className={styles.myParagraph}>
                Welcome to Codux e-commerce starter. <br /> This template was built to help you
                create your own store easily. Use Codux to design your website the way you want, and
                Wix Headless e-commerce services to manage your store.
                <a href={'https://help.codux.com/kb/en/article/kb37137'}>
                    <button className={commonStyles.introButton}>Learn more</button>
                </a>
            </p>
        </div>
    ),
    isSnippet: false,
    environmentProps: {
        windowWidth: 1024,
        windowHeight: 768,
        canvasWidth: 1024,
        canvasHeight: 768,
    },
});

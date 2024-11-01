import { createBoard, Variant } from '@wixc3/react-board';
import classNames from 'classnames';
import styles from '~/src/styles/ui-kit-typography.module.scss';

export default createBoard({
    name: 'UI Kit - Typography',
    Board: () => (
        <div className={styles.container}>
            <div>
                <span className={styles.uikit}>UI Kit</span>
                <span className={styles.foundation}>{' | '}Foundation</span>
                <hr className={styles.hrSolid} />
                <h3 className={styles.sectionTitle}>Typography</h3>
            </div>

            <h4 className={styles.sectionHeader}>HEADING</h4>
            <Variant name="Heading 1">
                <h1 className={styles.heading1}>Heading 1</h1>
            </Variant>
            <p className={classNames(styles.variantName, styles.headlinesSpacing)}>
                --heading1:<span className={styles.fontDetails}> DM Sans (100) / 65px / 1.2</span>
            </p>

            <Variant name="Heading 2">
                <h2 className={classNames(styles.heading2)}>HEADING 2</h2>
            </Variant>
            <p className={classNames(styles.variantName, styles.headlinesSpacing)}>
                --heading2:<span className={styles.fontDetails}> DM Sans (200) / 45px / 1.2</span>
            </p>

            <Variant name="Heading 3">
                <h3 className={classNames(styles.heading3)}>Heading 3</h3>
            </Variant>
            <p className={classNames(styles.variantName, styles.headlinesSpacing)}>
                --heading3:<span className={styles.fontDetails}> DM Sans (900)/ 42px/ 1</span>
            </p>

            <Variant name="Heading 6">
                <h6 className={classNames(styles.heading6)}>Heading 6</h6>
            </Variant>
            <p className={classNames(styles.variantName, styles.headlinesSpacing)}>
                --heading6:<span className={styles.fontDetails}> DM Sans (700)/ 16px/ 1.4 </span>
            </p>

            <hr className={styles.hrLight} />
            <h4 className={classNames(styles.sectionHeader)}>PARAGRAPH</h4>

            <Variant name="Large Paragraph">
                <p className={classNames(styles.largeParagraph)}>Large text</p>
            </Variant>
            <p className={classNames(styles.variantName, styles.paragraphSpacing)}>
                --large-paragraph:<span className={styles.fontDetails}> DM Sans (400)/ 52px/ 1.6</span>
            </p>

            <Variant name="Bold Paragraph">
                <p className={styles.boldParagraph}>The quick brown fox jumps over the lazy dog. 0123456789</p>
            </Variant>
            <p className={classNames(styles.variantName, styles.paragraphSpacing)}>
                --bold-paragraph:<span className={styles.fontDetails}> DM Sans (1000) / 24px / 1.4</span>
            </p>

            <Variant name="Paragraph 1">
                <p className={styles.paragraph1}>The quick brown fox jumps over the lazy dog. 0123456789</p>
            </Variant>
            <p className={classNames(styles.variantName, styles.paragraphSpacing)}>
                --paragraph1:
                <span className={styles.fontDetails}> DM Sans (300) / 20px / 1.3</span>
            </p>

            <Variant name="Paragraph 2">
                <p className={styles.paragraph2}>The quick brown fox jumps over the lazy dog. 0123456789</p>
            </Variant>
            <p className={classNames(styles.variantName, styles.paragraphSpacing)}>
                --paragraph2:<span className={styles.fontDetails}> DM Sans (200) / 16px / 1.4</span>
            </p>

            <Variant name="Paragraph 3">
                <p className={styles.paragraph3}>The quick brown fox jumps over the lazy dog. 0123456789</p>
            </Variant>
            <p className={classNames(styles.variantName, styles.paragraphSpacing)}>
                --paragraph3:<span className={styles.fontDetails}> DM Sans (400) / 12px / 18px</span>
            </p>
        </div>
    ),
    isSnippet: true,
    environmentProps: {
        windowWidth: 320,
        windowHeight: 606,
    },
    tags: ['UI Kit'],
});

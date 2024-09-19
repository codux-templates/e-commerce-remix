import { NavLink } from '@remix-run/react';
import { createBoard, Variant } from '@wixc3/react-board';
import classNames from 'classnames';
import { MemoryRouter } from 'react-router-dom';
import discordIcon from '~/assets/svg/discord.svg';
import facebookIcon from '~/assets/svg/facebook.svg';
import githubIcon from '~/assets/svg/github.svg';
import mediumIcon from '~/assets/svg/medium.svg';
import twitterxIcon from '~/assets/svg/twitterx.svg';
import youtubeIcon from '~/assets/svg/youtube.svg';
import commonStyles from '~/styles/common-styles.module.scss';
import styles from '~/styles/ui-kit-buttons.module.scss';

export default createBoard({
    name: 'UI Kit - Buttons',
    Board: () => (
        <MemoryRouter>
            <div className={styles.container}>
                <div>
                    <span className={styles.uikit}>UI Kit</span>
                    <span className={styles.coreComponents}>{' | '}Core Components</span>
                    <hr className={styles.hrSolid} />
                    <h3 className={styles.sectionTitle}>Buttons</h3>
                </div>

                <h4 className={styles.sectionHeader}>THEMED</h4>

                <div className={classNames(styles.buttonsContainer, styles.itemSpacing)}>
                    <div>
                        <Variant name="Primary Button">
                            <button className={classNames(commonStyles.primaryButton)}>Primary</button>
                        </Variant>
                        <span className={styles.buttonLabel}>Primary</span>
                    </div>

                    <div>
                        <Variant name="Secondary Button">
                            <button className={classNames(commonStyles.secondaryButton)}>Secondary</button>
                        </Variant>
                        <span className={styles.buttonLabel}>Secondary</span>
                    </div>
                </div>
                <hr className={styles.hrLight} />
                <h4 className={styles.sectionHeader}>MENU</h4>
                <Variant name="Menu">
                    <div className={classNames(styles.menu, styles.itemSpacing)}>
                        <NavLink to="/" className={({ isActive }) => classNames({ [styles.active]: isActive })}>
                            Home
                        </NavLink>
                        <NavLink to="/about" className={({ isActive }) => classNames({ [styles.active]: isActive })}>
                            About
                        </NavLink>
                    </div>
                </Variant>
                <hr className={styles.hrLight} />
                <h4 className={styles.sectionHeader}>SOCIAL</h4>
                <Variant name="Social Media Row">
                    <div className={classNames(styles.iconsContainer, styles.menu)}>
                        <Variant name="X Icon">
                            <a href="/">
                                <img className={styles.icon} src={twitterxIcon} alt="twitter" />
                            </a>
                        </Variant>
                        <Variant name="Facebook Icon">
                            <a href="/about">
                                <img className={styles.icon} src={facebookIcon} alt="facebook" />
                            </a>
                        </Variant>
                        <Variant name="Discord Icon">
                            <a href="/">
                                <img className={styles.icon} src={discordIcon} alt="discord" />
                            </a>
                        </Variant>
                        <Variant name="Youtube Icon">
                            <a href="/">
                                <img className={styles.icon} src={youtubeIcon} alt="youtube" />
                            </a>
                        </Variant>
                        <Variant name="Medium Icon">
                            <a href="/">
                                <img className={styles.icon} src={mediumIcon} alt="medium" />
                            </a>
                        </Variant>
                        <Variant name="Github Icon">
                            <a href="/">
                                <img className={styles.icon} src={githubIcon} alt="github" />
                            </a>
                        </Variant>
                    </div>
                </Variant>
            </div>
        </MemoryRouter>
    ),
    isSnippet: true,
    environmentProps: {
        windowWidth: 321,
        windowHeight: 462,
    },
    tags: ['UI Kit'],
});

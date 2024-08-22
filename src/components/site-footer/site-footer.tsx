import classNames from 'classnames';
import discordIcon from '~/assets/svg/discord.svg';
import facebookIcon from '~/assets/svg/facebook.svg';
import githubIcon from '~/assets/svg/github.svg';
import mediumIcon from '~/assets/svg/medium.svg';
import twitterxIcon from '~/assets/svg/twitterx.svg';
import youtubeIcon from '~/assets/svg/youtube.svg';
import styles from './site-footer.module.scss';

export interface FooterProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const Footer = ({ className }: FooterProps) => {
    return (
        <div className={classNames(styles.root, className)}>
            <div className={styles.details}>
                <div>Contact Jane Doe</div>
                <div className={styles.small}>
                    Mail: info@mysite.com
                    <br />
                    Tel: 123-456-7890
                    <br />
                    500 Terry Francine Street,
                    <br />
                    San Francisco, CA 94158
                </div>
            </div>
            <div className={styles.social}>
                <a href="/">
                    <img className={styles.icon} src={twitterxIcon} alt="twitter" />
                </a>
                <a href="/">
                    <img className={styles.icon} src={facebookIcon} alt="facebook" />
                </a>
                <a href="/">
                    <img className={styles.icon} src={discordIcon} alt="discord" />
                </a>
                <a href="/">
                    <img className={styles.icon} src={youtubeIcon} alt="youtube" />
                </a>
                <a href="/">
                    <img className={styles.icon} src={mediumIcon} alt="medium" />
                </a>
                <a href="/">
                    <img className={styles.icon} src={githubIcon} alt="github" />
                </a>
            </div>
        </div>
    );
};

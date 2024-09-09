import cx from 'classnames';
import styles from './new-component.module.scss';

export interface NewComponentProps {
    className?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const NewComponent = ({ className }: NewComponentProps) => {
    return <div className={cx(styles.root, className)}>NewComponent</div>;
};

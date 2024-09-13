import classNames from 'classnames';
import commonStyles from '~/styles/common-styles.module.scss';
import styles from './error-component.module.scss';

export interface ErrorComponentProps {
    title: string;
    message?: string;
    actionButtonText?: string;
    onActionButtonClick?: () => void;
}

export const ErrorComponent = ({
    title,
    message,
    actionButtonText,
    onActionButtonClick,
}: ErrorComponentProps) => {
    const shouldRenderActionButton = actionButtonText && onActionButtonClick;

    return (
        <div className={styles.root}>
            <h1 className={styles.title}>{title}</h1>
            {message && <div className={styles.message}>{message}</div>}
            {shouldRenderActionButton && (
                <button
                    className={classNames(commonStyles.primaryButton, styles.actionButton)}
                    onClick={onActionButtonClick}
                >
                    {actionButtonText}
                </button>
            )}
        </div>
    );
};

export interface UnsafeRichTextProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    children: string | undefined;
}

/**
 * This component is using `dangerouslySetInnerHTML` property to render formatted text.
 * DO NOT use this for rendering text that comes from uncontrolled sources.
 */
export const UnsafeRichText = ({ children, ...rest }: UnsafeRichTextProps) => {
    return children ? (
        <div
            {...rest}
            dangerouslySetInnerHTML={{
                __html: children,
            }}
        ></div>
    ) : undefined;
};

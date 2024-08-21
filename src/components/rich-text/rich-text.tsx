export interface RichTextProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    children: string | undefined;
}

export const RichText = ({ children, ...rest }: RichTextProps) => {
    return children ? (
        <div
            {...rest}
            dangerouslySetInnerHTML={{
                __html: children,
            }}
        ></div>
    ) : undefined;
};

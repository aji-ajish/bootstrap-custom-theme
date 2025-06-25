import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default function save({ attributes }) {
  const {
    cardHeader,
    cardFooter,
    hasHeader,
    hasFooter,
    customClass,
    customId,
    headerClass,
    bodyClass,
    footerClass,
  } = attributes;

  const blockProps = useBlockProps.save({
    className: `card ${customClass || ""}`,
    id: customId || undefined,
  });

  return (
    <div {...blockProps}>
      {hasHeader && (
        <div className={`card-header ${headerClass || ""}`}>{cardHeader}</div>
      )}
      <div className={`card-body ${bodyClass || ""}`}>
        <InnerBlocks.Content />
      </div>
      {hasFooter && (
        <div className={`card-footer ${footerClass || ""}`}>
          {cardFooter}
        </div>
      )}
    </div>
  );
}

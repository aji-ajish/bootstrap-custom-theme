import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default function save({ attributes }) {
  const { cardHeader, cardFooter, hasHeader, hasFooter, customClass, customId } = attributes;


  const blockProps = useBlockProps.save({
  className: `card ${customClass || ""}`,
  id: customId || undefined,
});


  return (
    <div {...blockProps}>
      {hasHeader && <div className="card-header">{cardHeader}</div>}
      <div className="card-body">
        <InnerBlocks.Content />
      </div>
      {hasFooter && <div className="card-footer">{cardFooter}</div>}
    </div>
  );
}

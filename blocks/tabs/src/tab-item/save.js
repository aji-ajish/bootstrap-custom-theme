import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

export default function Save({ attributes }) {
  const { title } = attributes;

  return (
    <div {...useBlockProps.save()}>
      <div className="tab-header">
        <RichText.Content tagName="h4" value={title} />
      </div>
      <div className="tab-body">
        <InnerBlocks.Content />
      </div>
    </div>
  );
}

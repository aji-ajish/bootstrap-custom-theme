import {
  useBlockProps,
  RichText,
  InnerBlocks
} from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
  const { title } = attributes;

  return (
    <div {...useBlockProps()}>
      <div className="tab-header">
        <RichText
          tagName="h4"
          value={title}
          onChange={(val) => setAttributes({ title: val })}
          placeholder="Enter tab title"
        />
      </div>
      <div className="tab-body">
        <InnerBlocks
          allowedBlocks={['core/paragraph', 'core/image', 'core/heading']}
          renderAppender={InnerBlocks.ButtonBlockAppender}
        />
      </div>
    </div>
  );
}

import {
  useBlockProps,
  RichText,
  InnerBlocks
} from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
  const { title, tabId } = attributes;

  const blockProps = useBlockProps();

  // Generate a unique ID for each tab
  const tabContentId = tabId || `tab-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div {...blockProps}>
      <div className="tab-header">
        <RichText
          tagName="button"
          className="nav-link"
          value={title}
          onChange={(val) => setAttributes({ title: val })}
          placeholder="Enter tab title"
          type="button"
          data-bs-toggle="tab"
          data-bs-target={`#${tabContentId}`}
          aria-selected="false"
        />
      </div>
      <div className="tab-body" id={tabContentId}>
        <InnerBlocks
          allowedBlocks={['core/paragraph', 'core/image', 'core/heading']}
          renderAppender={InnerBlocks.ButtonBlockAppender}
        />
      </div>
    </div>
  );
}

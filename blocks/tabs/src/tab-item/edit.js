import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
  const { title, tabId } = attributes;

  const blockProps = useBlockProps();

  // Generate a unique ID for each tab
  const tabContentId = tabId || `tab-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div {...blockProps}>
      <div className="nav-item" role="presentation">
        <button
          className="nav-link"
          id={`${tabContentId}-tab`}
          data-bs-toggle="tab"
          data-bs-target={`#${tabContentId}`}
          type="button"
          role="tab"
          aria-controls={tabContentId}
          aria-selected="false"
        >
          <RichText
            tagName="span"
            value={title}
            onChange={(val) => setAttributes({ title: val })}
            placeholder="Enter tab title"
          />
        </button>
      </div>
      <div className="tab-pane fade" id={tabContentId} role="tabpanel" aria-labelledby={`${tabContentId}-tab`}>
        <InnerBlocks
          allowedBlocks={['core/paragraph', 'core/image', 'core/heading']}
          renderAppender={InnerBlocks.ButtonBlockAppender}
        />
      </div>
    </div>
  );
}

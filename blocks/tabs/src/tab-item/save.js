import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

export default function Save({ attributes }) {
  const { title, tabId } = attributes;

  const tabContentId = tabId || `tab-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div {...useBlockProps.save()}>
      <div className="tab-header">
        <RichText.Content
          tagName="button"
          className="nav-link"
          value={title}
          data-bs-toggle="tab"
          data-bs-target={`#${tabContentId}`}
          aria-selected="false"
        />
      </div>
      <div className="tab-body" id={tabContentId}>
        <InnerBlocks.Content />
      </div>
    </div>
  );
}

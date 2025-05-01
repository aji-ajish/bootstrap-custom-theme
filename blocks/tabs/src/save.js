import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save({ attributes }) {
  const { orientation, style } = attributes;

  return (
    <div {...useBlockProps.save()}>
      {style === 'tabs' && (
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <InnerBlocks.Content />
        </ul>
      )}

      {style === 'pills' && (
        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <InnerBlocks.Content />
        </ul>
      )}

      {style === 'vertical' && (
        <div className="d-flex">
          <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <InnerBlocks.Content />
          </div>
          <div className="tab-content" id="v-pills-tabContent">
            <InnerBlocks.Content />
          </div>
        </div>
      )}
    </div>
  );
}

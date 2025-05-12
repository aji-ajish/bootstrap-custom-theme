import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const Save = ({ attributes, clientId }) => {
  const { tabStyle, customClass } = attributes;
  
  return (
    <div {...useBlockProps.save()}>
      <ul className={`nav ${tabStyle} ${customClass || ''}`.trim()} role="tablist">
        <InnerBlocks.Content />
      </ul>
    </div>
  );
};

export default Save;
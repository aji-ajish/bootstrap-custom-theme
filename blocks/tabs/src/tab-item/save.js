import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
  const { customId, title } = attributes;
  const blockProps = useBlockProps.save({
    className: 'nav-item'
  });

  return (
    <>
      <li {...blockProps} role="presentation">
        <button
          className="nav-link"
          id={`${customId}-tab`}
          data-bs-toggle="tab"
          data-bs-target={`#${customId}`}
          type="button"
          role="tab"
          aria-controls={customId}
        >
          {title}
        </button>
      </li>
      <div 
        className="tab-pane fade" 
        id={customId} 
        role="tabpanel" 
        aria-labelledby={`${customId}-tab`}
      >
        <InnerBlocks.Content />
      </div>
    </>
  );
};

export default Save;
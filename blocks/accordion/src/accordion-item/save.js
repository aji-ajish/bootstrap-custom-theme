import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
  const { title, itemId, isOpen, customClass } = attributes;
  
  const headingId = `heading-${itemId}`;
  const collapseId = `collapse-${itemId}`;

  return (
    <div className={`accordion-item ${customClass || ''}`}>
      <h2 className="accordion-header" id={headingId}>
        <button
          className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#${collapseId}`}
          aria-expanded={isOpen ? 'true' : 'false'}
          aria-controls={collapseId}
        >
          {title}
        </button>
      </h2>
      <div
        id={collapseId}
        className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
        aria-labelledby={headingId}
      >
        <div className="accordion-body">
          <InnerBlocks.Content />
        </div>
      </div>
    </div>
  );
};

export default Save;

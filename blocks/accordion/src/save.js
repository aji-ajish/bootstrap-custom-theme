import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
  const { accordionType, customId, customClass } = attributes;
  
  const accordionClasses = [
    'accordion',
    accordionType === 'flush' ? 'accordion-flush' : '',
    customClass || ''
  ].filter(Boolean).join(' ');

  // Use stable ID generated in edit
  const accordionId = customId;

  // Infer alwaysOpen from accordionType
  const alwaysOpen = accordionType === 'always-open';

  return (
    <div {...useBlockProps.save()}>
      <div 
        className={accordionClasses} 
        id={accordionId}
        data-always-open={alwaysOpen ? 'true' : 'false'}
      >
        <InnerBlocks.Content />
      </div>
    </div>
  );
};

export default Save;

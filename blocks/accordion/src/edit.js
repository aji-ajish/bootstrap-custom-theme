import { __ } from '@wordpress/i18n';
import { 
  Button, 
  PanelBody, 
  SelectControl, 
  TextControl
} from '@wordpress/components';
import { 
  useBlockProps, 
  InnerBlocks, 
  InspectorControls 
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

const ALLOWED_BLOCKS = ['bootstrap-custom-theme/accordion-item'];

const Edit = ({ attributes, setAttributes, clientId }) => {
  const { accordionType, customId, customClass } = attributes;
  
  // Generate and set a stable unique customId if empty
  React.useEffect(() => {
    if (!customId) {
      setAttributes({ customId: `accordion-${Math.random().toString(36).substr(2, 9)}` });
    }
  }, [customId, setAttributes]);

  // Get inner block count reactively
  const innerBlockOrder = useSelect(
    (select) => select('core/block-editor').getBlockOrder(clientId),
    [clientId]
  );
  
  const innerBlockCount = innerBlockOrder?.length || 0;

  const { insertBlock } = useDispatch('core/block-editor');

  const addNewItem = () => {
    const newItem = createBlock('bootstrap-custom-theme/accordion-item', {
      title: `Accordion Item ${innerBlockCount + 1}`,
      itemId: `accordion-item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isOpen: innerBlockCount === 0 && accordionType !== 'always-open' // open first item by default only for non-always-open
    });
    insertBlock(newItem, innerBlockCount, clientId);
  };

  return (
    <div {...useBlockProps()}>
      <InspectorControls>
        <PanelBody title={__('Accordion Settings')}>
          <SelectControl
            label={__('Accordion Type')}
            value={accordionType}
            options={[
              { label: __('Default Accordion'), value: 'default' },
              { label: __('Flush Accordion'), value: 'flush' },
              { label: __('Always Open Accordion'), value: 'always-open' }
            ]}
            onChange={(value) => setAttributes({ accordionType: value })}
          />
          <TextControl
            label={__('Custom ID')}
            value={customId}
            onChange={(value) => setAttributes({ customId: value })}
            help={__('Unique ID for the accordion (required for proper functionality)')}
          />
          <TextControl
            label={__('Custom Class')}
            value={customClass}
            onChange={(value) => setAttributes({ customClass: value })}
          />
          <Button
            variant="primary"
            onClick={addNewItem}
            style={{ marginTop: '10px' }}
          >
            {__('Add New Item')}
          </Button>
        </PanelBody>
      </InspectorControls>

      <div className="accordion-editor-wrapper">
        <InnerBlocks 
          allowedBlocks={ALLOWED_BLOCKS}
          renderAppender={false}
        />
      </div>
    </div>
  );
};

export default Edit;

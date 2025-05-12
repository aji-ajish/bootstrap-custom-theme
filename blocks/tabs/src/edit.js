import { __ } from '@wordpress/i18n';
import { Button, PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';
import classnames from 'classnames';

const ALLOWED_BLOCKS = ['bootstrap-custom-theme/tab-item'];

const Edit = ({ attributes, setAttributes, clientId }) => {
  const { orientation, tabStyle, customClass, customId } = attributes;

  const { insertBlock } = useDispatch('core/block-editor');
  const { innerBlockCount } = useSelect(
    (select) => ({
      innerBlockCount: select('core/block-editor').getBlockOrder(clientId).length,
    }),
    [clientId]
  );

  const addNewTab = () => {
    const newTab = createBlock('bootstrap-custom-theme/tab-item', {
      title: `Tab ${innerBlockCount + 1}`,
      customId: `tab-${Date.now()}`,
    });
    insertBlock(newTab, innerBlockCount, clientId);
  };

  useEffect(() => {
    // Initialize Bootstrap tabs in editor
    if (typeof bootstrap?.Tab !== 'undefined') {
      const tabElms = document.querySelectorAll('[data-bs-toggle="tab"]');
      tabElms.forEach(tabEl => {
        tabEl.addEventListener('click', (e) => {
          e.preventDefault();
          new bootstrap.Tab(tabEl).show();
        });
      });
    }
  }, [innerBlockCount]);

  return (
    <div {...useBlockProps()}>
      <InspectorControls>
        <PanelBody title={__('Tabs Settings')} initialOpen={true}>
          <SelectControl
            label={__('Tab Style')}
            value={tabStyle}
            options={[
              { label: 'Tabs', value: 'nav-tabs' },
              { label: 'Pills', value: 'nav-pills' },
            ]}
            onChange={(value) => setAttributes({ tabStyle: value })}
          />
          <SelectControl
            label={__('Orientation')}
            value={orientation}
            options={[
              { label: 'Horizontal', value: 'horizontal' },
              { label: 'Vertical', value: 'vertical' },
            ]}
            onChange={(value) => setAttributes({ orientation: value })}
          />
          <TextControl
            label={__('Custom ID')}
            value={customId}
            onChange={(value) => setAttributes({ customId: value })}
          />
          <TextControl
            label={__('Custom Class')}
            value={customClass}
            onChange={(value) => setAttributes({ customClass: value })}
          />
          <Button
            variant="primary"
            onClick={addNewTab}
            style={{ marginTop: '10px' }}
          >
            {__('Add New Tab')}
          </Button>
        </PanelBody>
      </InspectorControls>

      <div className={classnames('nav', tabStyle, customClass, {
        'flex-column': orientation === 'vertical'
      })} role="tablist">
        <InnerBlocks 
          allowedBlocks={ALLOWED_BLOCKS}
          orientation="horizontal"
          renderAppender={false}
        />
      </div>
    </div>
  );
};

export default Edit;
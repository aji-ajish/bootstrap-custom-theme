import {
  useBlockProps,
  InspectorControls,
  InnerBlocks
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const { orientation, style } = attributes;

  const blockProps = useBlockProps();

  const ALLOWED_BLOCKS = ['bootstrap-custom-theme/tab-item'];

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title="Tab Settings" initialOpen={true}>
          <SelectControl
            label="Orientation"
            value={orientation}
            options={[
              { label: 'Horizontal', value: 'horizontal' },
              { label: 'Vertical', value: 'vertical' }
            ]}
            onChange={(val) => setAttributes({ orientation: val })}
          />
          <SelectControl
            label="Tab Style"
            value={style}
            options={[
              { label: 'Tabs', value: 'tabs' },
              { label: 'Pills', value: 'pills' }
            ]}
            onChange={(val) => setAttributes({ style: val })}
          />
        </PanelBody>
      </InspectorControls>

      <div className={`tabs-container ${orientation === 'vertical' ? 'd-flex' : ''}`}>
        {style === 'tabs' && (
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <InnerBlocks
              allowedBlocks={ALLOWED_BLOCKS}
              orientation="horizontal"
              renderAppender={InnerBlocks.ButtonBlockAppender}
            />
          </ul>
        )}

        {style === 'pills' && (
          <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <InnerBlocks
              allowedBlocks={ALLOWED_BLOCKS}
              orientation="horizontal"
              renderAppender={InnerBlocks.ButtonBlockAppender}
            />
          </ul>
        )}

        {style === 'vertical' && (
          <div className="d-flex">
            <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
              <InnerBlocks
                allowedBlocks={ALLOWED_BLOCKS}
                orientation="vertical"
                renderAppender={InnerBlocks.ButtonBlockAppender}
              />
            </div>
            <div className="tab-content" id="v-pills-tabContent">
              <InnerBlocks.Content />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

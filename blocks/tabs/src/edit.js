import {
  useBlockProps,
  InspectorControls,
  InnerBlocks
} from '@wordpress/block-editor';
import { PanelBody, SelectControl, Button } from '@wordpress/components';

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

      <div className={`tabs-container nav-${style} ${orientation === 'vertical' ? 'row' : ''}`}>
        <InnerBlocks
          allowedBlocks={ALLOWED_BLOCKS}
          orientation="horizontal"
          renderAppender={InnerBlocks.ButtonBlockAppender}
        />
      </div>
    </div>
  );
}

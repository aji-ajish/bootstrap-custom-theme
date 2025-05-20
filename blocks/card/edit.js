import { __ } from '@wordpress/i18n';
import {
  PanelBody,
  ToggleControl,
  SelectControl,
  TextControl,
} from '@wordpress/components';
import {
  useBlockProps,
  InspectorControls,
  InnerBlocks,
} from '@wordpress/block-editor';

const ALLOWED_BLOCKS = [ 'core/paragraph', 'core/heading', 'core/image', 'core/button', 'core/list' ];

const CardEdit = ({ attributes, setAttributes }) => {
  const {
    customId,
    customClass,
    border,
    background,
    textColor,
    width,
    showHeader,
    showFooter,
    imagePosition,
  } = attributes;

  const blockProps = useBlockProps();

  // Compose Bootstrap classes
  const classes = [
    'card',
    border ? `border-${border}` : '',
    background ? `bg-${background}` : '',
    textColor ? `text-${textColor}` : '',
    width ? `w-${width}` : '',
    customClass || ''
  ].filter(Boolean).join(' ');

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Card Settings')}>
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
          <SelectControl
            label={__('Border Style')}
            value={border}
            options={[
              { label: __('None'), value: '' },
              { label: __('Primary'), value: 'primary' },
              { label: __('Secondary'), value: 'secondary' },
              { label: __('Success'), value: 'success' },
              { label: __('Danger'), value: 'danger' },
              { label: __('Warning'), value: 'warning' },
              { label: __('Info'), value: 'info' },
              { label: __('Light'), value: 'light' },
              { label: __('Dark'), value: 'dark' },
            ]}
            onChange={(value) => setAttributes({ border: value })}
          />
          <SelectControl
            label={__('Background Color')}
            value={background}
            options={[
              { label: __('None'), value: '' },
              { label: __('Primary'), value: 'primary' },
              { label: __('Secondary'), value: 'secondary' },
              { label: __('Success'), value: 'success' },
              { label: __('Danger'), value: 'danger' },
              { label: __('Warning'), value: 'warning' },
              { label: __('Info'), value: 'info' },
              { label: __('Light'), value: 'light' },
              { label: __('Dark'), value: 'dark' },
              { label: __('White'), value: 'white' },
            ]}
            onChange={(value) => setAttributes({ background: value })}
          />
          <SelectControl
            label={__('Text Color')}
            value={textColor}
            options={[
              { label: __('None'), value: '' },
              { label: __('Primary'), value: 'primary' },
              { label: __('Secondary'), value: 'secondary' },
              { label: __('Success'), value: 'success' },
              { label: __('Danger'), value: 'danger' },
              { label: __('Warning'), value: 'warning' },
              { label: __('Info'), value: 'info' },
              { label: __('Light'), value: 'light' },
              { label: __('Dark'), value: 'dark' },
              { label: __('Body'), value: 'body' },
              { label: __('Muted'), value: 'muted' },
            ]}
            onChange={(value) => setAttributes({ textColor: value })}
          />
          <SelectControl
            label={__('Width')}
            value={width}
            options={[
              { label: __('Auto'), value: '' },
              { label: __('25%'), value: '25' },
              { label: __('50%'), value: '50' },
              { label: __('75%'), value: '75' },
              { label: __('100%'), value: '100' },
            ]}
            onChange={(value) => setAttributes({ width: value })}
          />
          <ToggleControl
            label={__('Show Header')}
            checked={showHeader}
            onChange={(value) => setAttributes({ showHeader: value })}
          />
          <ToggleControl
            label={__('Show Footer')}
            checked={showFooter}
            onChange={(value) => setAttributes({ showFooter: value })}
          />
          <SelectControl
            label={__('Image Position')}
            value={imagePosition}
            options={[
              { label: __('None'), value: 'none' },
              { label: __('Top'), value: 'top' },
              { label: __('Bottom'), value: 'bottom' },
            ]}
            onChange={(value) => setAttributes({ imagePosition: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps} id={customId || undefined} className={classes}>
        {imagePosition === 'top' && (
          <div className="card-img-top">
            <InnerBlocks
              allowedBlocks={['core/image']}
              templateLock={false}
              template={[['core/image']]}
            />
          </div>
        )}

        {showHeader && (
          <div className="card-header">
            <InnerBlocks
              allowedBlocks={['core/heading', 'core/paragraph']}
              templateLock={false}
              template={[['core/heading', { placeholder: __('Card Header') }]]}
            />
          </div>
        )}

        <div className="card-body">
          <InnerBlocks
            allowedBlocks={ALLOWED_BLOCKS}
            templateLock={false}
            template={[['core/paragraph', { placeholder: __('Card content...') }]]}
          />
        </div>

        {showFooter && (
          <div className="card-footer">
            <InnerBlocks
              allowedBlocks={['core/paragraph', 'core/heading']}
              templateLock={false}
              template={[['core/paragraph', { placeholder: __('Card Footer') }]]}
            />
          </div>
        )}

        {imagePosition === 'bottom' && (
          <div className="card-img-bottom">
            <InnerBlocks
              allowedBlocks={['core/image']}
              templateLock={false}
              template={[['core/image']]}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CardEdit;

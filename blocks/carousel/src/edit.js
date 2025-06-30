import { __ } from '@wordpress/i18n';
import {
  PanelBody,
  ToggleControl,
  RangeControl,
  Button
} from '@wordpress/components';
import {
  useBlockProps,
  InnerBlocks,
  InspectorControls
} from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';

const ALLOWED_BLOCKS = ['bootstrap-custom-theme/carousel-item'];

const Edit = ({ attributes, setAttributes, clientId }) => {
  const {
    carouselId,
    showControls,
    showIndicators,
    autoplay,
    interval,
    fade,
    darkVariant
  } = attributes;

  const { insertBlocks } = useDispatch('core/block-editor');
  const innerBlocks = useSelect(
    (select) => select('core/block-editor').getBlocks(clientId),
    [clientId]
  );

  // Generate a unique carousel ID once
  useEffect(() => {
    if (!carouselId) {
      setAttributes({
        carouselId: `carousel-${Math.random().toString(36).substr(2, 9)}`
      });
    }
  }, [carouselId, setAttributes]);

  const addNewSlide = () => {
    const newSlide = createBlock('bootstrap-custom-theme/carousel-item', {
      slideId: `slide-${Date.now()}`,
      isActive: innerBlocks.length === 0,
      imageUrl: '',
      imageAlt: '',
      captionHeading: '',
      captionText: '',
      showCaption: true
    });

    console.log('Creating slide:', newSlide);
    insertBlocks(newSlide, innerBlocks.length, clientId);
  };

  return (
    <div {...useBlockProps()}>
      <InspectorControls>
        <PanelBody title={__('Carousel Settings')}>
          <ToggleControl
            label={__('Show Controls')}
            checked={showControls}
            onChange={(value) => setAttributes({ showControls: value })}
          />
          <ToggleControl
            label={__('Show Indicators')}
            checked={showIndicators}
            onChange={(value) => setAttributes({ showIndicators: value })}
          />
          <ToggleControl
            label={__('Autoplay')}
            checked={autoplay}
            onChange={(value) => setAttributes({ autoplay: value })}
          />
          {autoplay && (
            <RangeControl
              label={__('Autoplay Interval (ms)')}
              value={interval}
              onChange={(value) => setAttributes({ interval: value })}
              min={1000}
              max={10000}
              step={500}
            />
          )}
          <ToggleControl
            label={__('Fade Transition')}
            checked={fade}
            onChange={(value) => setAttributes({ fade: value })}
          />
          <ToggleControl
            label={__('Dark Variant')}
            checked={darkVariant}
            onChange={(value) => setAttributes({ darkVariant: value })}
          />
          <Button
            variant="primary"
            onClick={addNewSlide}
            style={{ marginTop: '16px' }}
          >
            {__('Add New Slide')}
          </Button>
        </PanelBody>
      </InspectorControls>

      <div
        className={`carousel ${darkVariant ? 'carousel-dark' : ''}`}
        style={{ border: '1px dashed #ccc', padding: '20px' }}
      >
        <InnerBlocks
          allowedBlocks={ALLOWED_BLOCKS}
          templateLock={false}
          renderAppender={false}
        />
      </div>
    </div>
  );
};

export default Edit;

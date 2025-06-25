import { __ } from '@wordpress/i18n';
import {
  PanelBody,
  MediaUpload,
  MediaUploadCheck,
  TextControl,
  ToggleControl,
  Button
} from '@wordpress/components';
import {
  useBlockProps,
  InspectorControls
} from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
  const {
    imageUrl,
    imageAlt,
    captionHeading,
    captionText,
    showCaption,
    isActive
  } = attributes;

  const blockProps = useBlockProps({
    className: `carousel-item ${isActive ? 'active' : ''}`
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Slide Settings')}>
          <ToggleControl
            label={__('Show Slide')}
            checked={isActive}
            onChange={(val) => setAttributes({ isActive: val })}
          />
          <MediaUploadCheck>
            <MediaUpload
              onSelect={(media) =>
                setAttributes({
                  imageUrl: media.url,
                  imageAlt: media.alt
                })
              }
              allowedTypes={['image']}
              render={({ open }) => (
                <Button onClick={open}>{__('Select Slide Image')}</Button>
              )}
            />
          </MediaUploadCheck>
          <ToggleControl
            label={__('Show Caption')}
            checked={showCaption}
            onChange={(val) => setAttributes({ showCaption: val })}
          />
          {showCaption && (
            <>
              <TextControl
                label={__('Caption Heading')}
                value={captionHeading}
                onChange={(val) => setAttributes({ captionHeading: val })}
              />
              <TextControl
                label={__('Caption Text')}
                value={captionText}
                onChange={(val) => setAttributes({ captionText: val })}
              />
            </>
          )}
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        {imageUrl ? (
          <img src={imageUrl} alt={imageAlt} className="d-block w-100" />
        ) : (
          <p>{__('Slide – please choose image')}</p>
        )}
        {showCaption && (captionHeading || captionText) && (
          <div className="carousel-caption d-none d-md-block">
            {captionHeading && <h5>{captionHeading}</h5>}
            {captionText && <p>{captionText}</p>}
          </div>
        )}
      </div>
    </>
  );
}

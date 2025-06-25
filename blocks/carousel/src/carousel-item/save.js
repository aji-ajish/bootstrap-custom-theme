import { useBlockProps } from '@wordpress/block-editor';

export default function Save({ attributes }) {
  const {
    imageUrl,
    imageAlt,
    captionHeading,
    captionText,
    showCaption,
    isActive
  } = attributes;

  const blockProps = useBlockProps.save({
    className: `carousel-item ${isActive ? 'active' : ''}`
  });

  return (
    <div {...blockProps}>
      {imageUrl && <img src={imageUrl} alt={imageAlt} className="d-block w-100" />}
      {showCaption && (captionHeading || captionText) && (
        <div className="carousel-caption d-none d-md-block">
          {captionHeading && <h5>{captionHeading}</h5>}
          {captionText && <p>{captionText}</p>}
        </div>
      )}
    </div>
  );
}

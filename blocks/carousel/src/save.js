import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save({ attributes }) {
  const {
    carouselId,
    showControls,
    showIndicators,
    autoplay,
    interval,
    fade,
    darkVariant
  } = attributes;

  const dataAttrs = {
    'data-bs-ride': autoplay ? 'carousel' : undefined,
    'data-bs-interval': autoplay ? interval : undefined,
    'data-bs-pause': autoplay ? 'hover' : undefined
  };

  return (
    <div {...useBlockProps.save()}>
      <div
        id={carouselId}
        className={`carousel slide ${fade ? 'carousel-fade' : ''} ${
          darkVariant ? 'carousel-dark' : ''
        }`}
        {...dataAttrs}
      >
        {showIndicators && (
          <div className="carousel-indicators">
            <InnerBlocks.Content />
          </div>
        )}
        <div className="carousel-inner">
          <InnerBlocks.Content />
        </div>
        {showControls && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target={`#${carouselId}`}
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target={`#${carouselId}`}
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

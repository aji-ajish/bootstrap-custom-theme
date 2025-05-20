import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const CardSave = ({ attributes }) => {
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

  const classes = [
    'card',
    border ? `border-${border}` : '',
    background ? `bg-${background}` : '',
    textColor ? `text-${textColor}` : '',
    width ? `w-${width}` : '',
    customClass || ''
  ].filter(Boolean).join(' ');

  const blockProps = useBlockProps.save({
    id: customId || undefined,
    className: classes,
  });

  return (
    <div {...blockProps}>
      {imagePosition === 'top' && (
        <div className="card-img-top">
          <InnerBlocks.Content />
        </div>
      )}

      {showHeader && (
        <div className="card-header">
          <InnerBlocks.Content
            __experimentalBlockLayout="header"
          />
        </div>
      )}

      <div className="card-body">
        <InnerBlocks.Content />
      </div>

      {showFooter && (
        <div className="card-footer">
          <InnerBlocks.Content />
        </div>
      )}

      {imagePosition === 'bottom' && (
        <div className="card-img-bottom">
          <InnerBlocks.Content />
        </div>
      )}
    </div>
  );
};

export default CardSave;

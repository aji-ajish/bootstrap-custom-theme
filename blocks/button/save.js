import { useBlockProps, RichText } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
  const {
    text,
    variant,
    size,
    outline,
    disabled,
    tagName,
    url,
    customClass,
    customId,
  } = attributes;

  const btnClass = `btn ${
    outline ? `btn-outline-${variant}` : `btn-${variant}`
  } ${size} ${customClass}`.trim();

  const blockProps = useBlockProps.save();

  if (tagName === 'a') {
    return (
      <a
        {...blockProps}
        id={customId || undefined}
        href={url || '#'}
        className={btnClass}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        onClick={(e) => disabled && e.preventDefault()}
      >
        <RichText.Content value={text} />
      </a>
    );
  }

  return (
    <button
      {...blockProps}
      id={customId || undefined}
      type="button"
      className={btnClass}
      disabled={disabled}
    >
      <RichText.Content value={text} />
    </button>
  );
};

export default Save;

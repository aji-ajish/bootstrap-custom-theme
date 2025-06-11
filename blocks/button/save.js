import { useBlockProps, RichText } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
  const {
    text,
    variant,
    size,
    outline,
    disabled,
    tagName,
    url,
    openInNewTab,
    role,
    customClass,
    customId,
    buttonType,
  } = attributes;

  const props = useBlockProps.save();
  const btnClass = `btn ${
    outline ? `btn-outline-${variant}` : `btn-${variant}`
  } ${size} ${customClass}`.trim();

  return tagName === "a" ? (
    <a
      {...props}
      id={customId || undefined}
      href={url || "#"}
      className={btnClass}
      aria-disabled={disabled}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      role={role || undefined}
    >
      <RichText.Content tagName="span" value={text} />
    </a>
  ) : (
    <button
      {...props}
      id={customId || undefined}
      type={buttonType || "button"}
      className={btnClass}
      disabled={disabled}
      role={role || undefined}
    >
      <RichText.Content tagName="span" value={text} />
    </button>
  );
};

export default Save;

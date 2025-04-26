import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default function Save({ attributes }) {
  const { breakpoints, customClass } = attributes;

  const renderClassName = () => {
    if (!breakpoints.length) return "col";
    return (
      breakpoints
        .map(({ breakpoint, type, count }) => {
          if (type === "auto") return `col-${breakpoint}`;
          if (type === "fixed") return `col-${breakpoint}-${count}`;
          if (type === "auto-width") return `col-${breakpoint}-auto`;
          return "";
        })
        .join(" ") + (customClass ? ` ${customClass}` : "")
    );
  };

  return (
    <div
      {...useBlockProps.save({ className: renderClassName(), className: null })}
    >
      <InnerBlocks.Content />
    </div>
  );
}

import { __ } from "@wordpress/i18n";
import {
  PanelBody,
  SelectControl,
  ToggleControl,
  TextControl,
} from "@wordpress/components";
import {
  useBlockProps,
  RichText,
  InspectorControls,
} from "@wordpress/block-editor";

const VARIANTS = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
  "light",
  "dark",
  "link",
];

const SIZES = [
  { label: __("Default"), value: "" },
  { label: __("Small"), value: "btn-sm" },
  { label: __("Large"), value: "btn-lg" },
];

const Edit = ({ attributes, setAttributes }) => {
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

  const blockProps = useBlockProps();

  // Build the class string
  const btnClass = `btn ${
    outline ? `btn-outline-${variant}` : `btn-${variant}`
  } ${size} ${customClass}`.trim();

  const commonProps = {
    id: customId || undefined,
    className: btnClass,
    disabled: tagName === "button" ? disabled : undefined,
    "aria-disabled": tagName === "a" ? disabled : undefined,
    tabIndex: tagName === "a" && disabled ? -1 : undefined,
    href: tagName === "a" ? url || "#" : undefined,
    onClick:
      tagName === "a" && disabled ? (e) => e.preventDefault() : undefined,
  };

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title={__("Button Settings")}>
          <SelectControl
            label={__("Variant")}
            value={variant}
            options={VARIANTS.map((v) => ({ label: v, value: v }))}
            onChange={(value) => setAttributes({ variant: value })}
          />
          <SelectControl
            label={__("Size")}
            value={size}
            options={SIZES}
            onChange={(value) => setAttributes({ size: value })}
          />
          <ToggleControl
            label={__("Outline")}
            checked={outline}
            onChange={(value) => setAttributes({ outline: value })}
          />
          <ToggleControl
            label={__("Disabled")}
            checked={disabled}
            onChange={(value) => setAttributes({ disabled: value })}
          />
          <SelectControl
            label={__("Tag")}
            value={tagName}
            options={[
              { label: __("Button"), value: "button" },
              { label: __("Link (a)"), value: "a" },
            ]}
            onChange={(value) => setAttributes({ tagName: value })}
          />
          {tagName === "a" && (
            <TextControl
              label={__("URL")}
              value={url}
              onChange={(value) => setAttributes({ url: value })}
            />
          )}
          <TextControl
            label={__("Custom ID")}
            value={customId}
            onChange={(value) => setAttributes({ customId: value })}
          />
          <TextControl
            label={__("Custom Class")}
            value={customClass}
            onChange={(value) => setAttributes({ customClass: value })}
          />
        </PanelBody>
      </InspectorControls>

      {tagName === "a" ? (
        <a {...commonProps}>
          <RichText
            tagName="span"
            value={text}
            onChange={(value) => setAttributes({ text: value })}
            placeholder={__("Button text…")}
            allowedFormats={["core/bold", "core/italic"]}
          />
        </a>
      ) : (
        <button type="button" {...commonProps}>
          <RichText
            tagName="span"
            value={text}
            onChange={(value) => setAttributes({ text: value })}
            placeholder={__("Button text…")}
            allowedFormats={["core/bold", "core/italic"]}
          />
        </button>
      )}
    </div>
  );
};

export default Edit;

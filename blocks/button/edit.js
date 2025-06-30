import { __ } from "@wordpress/i18n";
import {
  PanelBody,
  SelectControl,
  TextControl,
  ToggleControl,
  Button,
} from "@wordpress/components";
import {
  useBlockProps,
  RichText,
  InspectorControls,
  store as blockEditorStore,
} from "@wordpress/block-editor";
import { useDispatch } from "@wordpress/data";

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

const ROLES = [
  { label: __("Default"), value: "" },
  { label: __("Button"), value: "button" },
  { label: __("Link"), value: "link" },
  { label: __("Submit"), value: "submit" },
  { label: __("Reset"), value: "reset" },
];

const BUTTON_TYPES = [
  { label: __("Button"), value: "button" },
  { label: __("Submit"), value: "submit" },
  { label: __("Reset"), value: "reset" },
];

const Edit = ({ attributes, setAttributes, clientId }) => {
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

  const blockProps = useBlockProps();
  const { removeBlock } = useDispatch(blockEditorStore);

  const btnClass = `btn ${
    outline ? `btn-outline-${variant}` : `btn-${variant}`
  } ${size} ${customClass}`.trim();

  return (
    <>
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
          <SelectControl
            label={__("Role")}
            value={role}
            options={ROLES}
            onChange={(value) => setAttributes({ role: value })}
          />
          {tagName === "button" && (
            <SelectControl
              label={__("Button Type")}
              value={buttonType}
              options={BUTTON_TYPES}
              onChange={(value) => setAttributes({ buttonType: value })}
            />
          )}
          {tagName === "a" && (
            <>
              <TextControl
                label={__("URL")}
                value={url}
                onChange={(value) => setAttributes({ url: value })}
              />
              <ToggleControl
                label={__("Open in new tab")}
                checked={openInNewTab}
                onChange={(value) => setAttributes({ openInNewTab: value })}
              />
            </>
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

          <Button
            variant="secondary"
            isDestructive
            onClick={() => removeBlock(clientId)}
            style={{ marginTop: "1rem" }}
          >
            {__("Remove Button")}
          </Button>
        </PanelBody>
      </InspectorControls>

      {tagName === "a" ? (
        <a
          {...blockProps}
          id={customId || undefined}
          href={url || "#"}
          className={btnClass}
          aria-disabled={disabled}
          target={openInNewTab ? "_blank" : undefined}
          rel={openInNewTab ? "noopener noreferrer" : undefined}
          role={role || undefined}
        >
          <RichText
            tagName="span"
            value={text}
            onChange={(value) => setAttributes({ text: value })}
            placeholder={__("Button text...")}
            allowedFormats={["core/bold", "core/italic"]}
            keepPlaceholderOnFocus
          />
        </a>
      ) : (
        <button
          {...blockProps}
          id={customId || undefined}
          type={buttonType || "button"}
          className={btnClass}
          disabled={disabled}
          role={role || undefined}
        >
          <RichText
            tagName="span"
            value={text}
            onChange={(value) => setAttributes({ text: value })}
            placeholder={__("Button text...")}
            allowedFormats={["core/bold", "core/italic"]}
            keepPlaceholderOnFocus
          />
        </button>
      )}
    </>
  );
};

export default Edit;

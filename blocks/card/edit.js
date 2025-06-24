import { __ } from "@wordpress/i18n";
import {
  InspectorControls,
  useBlockProps,
  InnerBlocks,
} from "@wordpress/block-editor";
import {
  PanelBody,
  TextControl,
  ToggleControl,
} from "@wordpress/components";

export default function Edit({ attributes, setAttributes }) {
  const {
    cardHeader,
    cardFooter,
    hasHeader,
    hasFooter,
    customClass,
    customId,
  } = attributes;

  const blockProps = useBlockProps({
    className: `card ${customClass || ""}`,
    id: customId || undefined,
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Card Settings")}>
          <ToggleControl
            label={__("Show Header")}
            checked={hasHeader}
            onChange={(val) => setAttributes({ hasHeader: val })}
          />
          {hasHeader && (
            <TextControl
              label={__("Header Text")}
              value={cardHeader}
              onChange={(val) => setAttributes({ cardHeader: val })}
            />
          )}

          <ToggleControl
            label={__("Show Footer")}
            checked={hasFooter}
            onChange={(val) => setAttributes({ hasFooter: val })}
          />
          {hasFooter && (
            <TextControl
              label={__("Footer Text")}
              value={cardFooter}
              onChange={(val) => setAttributes({ cardFooter: val })}
            />
          )}

          <TextControl
            label={__("Custom ID")}
            value={customId}
            onChange={(val) => setAttributes({ customId: val })}
          />
          <TextControl
            label={__("Custom Class")}
            value={customClass}
            onChange={(val) => setAttributes({ customClass: val })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        {hasHeader && <div className="card-header">{cardHeader}</div>}
        <div className="card-body">
          <InnerBlocks />
        </div>
        {hasFooter && <div className="card-footer">{cardFooter}</div>}
      </div>
    </>
  );
}

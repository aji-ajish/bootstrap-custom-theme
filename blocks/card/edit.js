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
    headerClass,
    bodyClass,
    footerClass,
  } = attributes;

  const blockProps = useBlockProps({
    className: `card ${customClass || ""}`,
    id: customId || undefined,
  });

  return (
    <>
      <InspectorControls>
        <PanelBody title={__("Card Settings")} initialOpen>
          <TextControl
            label={__("Custom ID")}
            value={customId}
            onChange={(val) => setAttributes({ customId: val })}
          />
          <TextControl
            label={__("Card Wrapper Class")}
            value={customClass}
            onChange={(val) => setAttributes({ customClass: val })}
          />
          <ToggleControl
            label={__("Show Header")}
            checked={hasHeader}
            onChange={(val) => setAttributes({ hasHeader: val })}
          />
          {hasHeader && (
            <>
              <TextControl
                label={__("Header Text")}
                value={cardHeader}
                onChange={(val) => setAttributes({ cardHeader: val })}
              />
              <TextControl
                label={__("Header Class")}
                value={headerClass}
                onChange={(val) => setAttributes({ headerClass: val })}
              />
            </>
          )}
          <ToggleControl
            label={__("Show Footer")}
            checked={hasFooter}
            onChange={(val) => setAttributes({ hasFooter: val })}
          />
          {hasFooter && (
            <>
              <TextControl
                label={__("Footer Text")}
                value={cardFooter}
                onChange={(val) => setAttributes({ cardFooter: val })}
              />
              <TextControl
                label={__("Footer Class")}
                value={footerClass}
                onChange={(val) => setAttributes({ footerClass: val })}
              />
            </>
          )}
          <TextControl
            label={__("Body Class")}
            value={bodyClass}
            onChange={(val) => setAttributes({ bodyClass: val })}
          />
        </PanelBody>
      </InspectorControls>

      <div {...blockProps}>
        {hasHeader && (
          <div className={`card-header ${headerClass || ""}`}>
            {cardHeader}
          </div>
        )}
        <div className={`card-body ${bodyClass || ""}`}>
          <InnerBlocks />
        </div>
        {hasFooter && (
          <div className={`card-footer ${footerClass || ""}`}>
            {cardFooter}
          </div>
        )}
      </div>
    </>
  );
}

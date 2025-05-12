import { __ } from "@wordpress/i18n";
import { PanelBody, TextControl } from "@wordpress/components";
import {
  InspectorControls,
  useBlockProps,
  InnerBlocks,
} from "@wordpress/block-editor";
import { useEffect } from "@wordpress/element";

const ALLOWED_BLOCKS = ["core/paragraph", "core/heading", "core/image"];

const Edit = ({ attributes, setAttributes, clientId }) => {
  const { title, customId } = attributes;

  useEffect(() => {
    if (!customId) {
      setAttributes({ customId: `tab-${clientId.replace(/[^a-z0-9]/g, "")}` });
    }
  }, []);

  return (
    <div {...useBlockProps()}>
      <InspectorControls>
        <PanelBody title={__("Tab Settings")}>
          <TextControl
            label={__("Tab Title")}
            value={title}
            onChange={(value) => setAttributes({ title: value })}
          />
        </PanelBody>
      </InspectorControls>

      <div className="tab-content-wrapper">
        <button className="nav-link" data-bs-toggle="tab">
          {title || __("New Tab")}
        </button>
        <div className="tab-content-editor">
          <InnerBlocks
            allowedBlocks={ALLOWED_BLOCKS}
            template={[
              ["core/heading", { level: 3, placeholder: __("Tab Heading...") }],
              [
                "core/paragraph",
                { placeholder: __("Tab content goes here...") },
              ],
            ]}
            renderAppender={InnerBlocks.ButtonBlockAppender}
          />
        </div>
      </div>
    </div>
  );
};

export default Edit;

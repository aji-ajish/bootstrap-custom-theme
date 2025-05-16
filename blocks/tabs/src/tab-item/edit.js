import { __ } from "@wordpress/i18n";
import {
  PanelBody,
  TextControl,
  Button,
  CheckboxControl,
} from "@wordpress/components";
import {
  InspectorControls,
  useBlockProps,
  InnerBlocks,
} from "@wordpress/block-editor";
import { useEffect } from "@wordpress/element";
import { useDispatch } from "@wordpress/data";

const ALLOWED_BLOCKS = ["core/paragraph", "core/heading", "core/image"];

const Edit = ({ attributes, setAttributes, clientId }) => {
  const { title, customId } = attributes;
  const { removeBlock } = useDispatch("core/block-editor");

  useEffect(() => {
    if (!customId) {
      setAttributes({ customId: `tab-${clientId.replace(/[^a-z0-9]/g, "")}` });
    }
  }, []);

  const handleRemove = () => {
    removeBlock(clientId, true); // true to select previous block after removal
  };

  return (
    <div {...useBlockProps()}>
      <InspectorControls>
        <PanelBody title={__("Tab Settings")}>
          <TextControl
            label={__("Tab Title")}
            value={title}
            onChange={(value) => setAttributes({ title: value })}
          />
          <TextControl
            label={__("Tab ID")}
            value={customId}
            onChange={(value) => setAttributes({ customId: value })}
          />
        </PanelBody>
        <CheckboxControl
          label={__("Set this tab as active")}
          checked={attributes.isActive}
          onChange={(value) => setAttributes({ isActive: value })}
        />
      </InspectorControls>

      <div className="tab-content-wrapper">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button className="nav-link" data-bs-toggle="tab">
            {title || __("New Tab")}
          </button>
          <button
            onClick={handleRemove}
            style={{
              background: "none",
              border: "none",
              color: "red",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div className="tab-content-editor">
          <InnerBlocks
            allowedBlocks={ALLOWED_BLOCKS}
            template={[
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

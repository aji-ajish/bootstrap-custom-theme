import { __ } from "@wordpress/i18n";
import {
  PanelBody,
  TextControl,
  Button,
  ToggleControl,
} from "@wordpress/components";
import {
  InspectorControls,
  useBlockProps,
  InnerBlocks,
} from "@wordpress/block-editor";
import { useDispatch } from "@wordpress/data";
import React from "react";

const ALLOWED_BLOCKS = [
  "core/paragraph",
  "core/heading",
  "core/image",
  "core/list",
];

const Edit = ({ attributes, setAttributes, clientId }) => {
  const { title, itemId, isOpen, customClass } = attributes;
  const { removeBlock } = useDispatch("core/block-editor");

  React.useEffect(() => {
    if (!itemId) {
      setAttributes({
        itemId: `accordion-item-${Math.random().toString(36).substr(2, 9)}`,
      });
    }
  }, [itemId, setAttributes]);

  const handleRemove = () => {
    removeBlock(clientId);
  };

  return (
    <div {...useBlockProps()}>
      <InspectorControls>
        <PanelBody title={__("Item Settings")}>
          <TextControl
            label={__("Title")}
            value={title}
            onChange={(value) => setAttributes({ title: value })}
          />
          <TextControl
            label={__("Item ID")}
            value={itemId}
            onChange={(value) => setAttributes({ itemId: value })}
            help={__("Unique ID for this item (auto-generated if empty)")}
          />
          <ToggleControl
            label={__("Open by default")}
            checked={isOpen}
            onChange={() => setAttributes({ isOpen: !isOpen })}
          />
          <TextControl
            label={__("Custom Class")}
            value={customClass}
            onChange={(value) => setAttributes({ customClass: value })}
          />
          <Button
            onClick={handleRemove}
            style={{
              background: "red",
              color: "#fff",
            }}
          >
            Remove
          </Button>
        </PanelBody>
      </InspectorControls>

      <div className="accordion-item-editor">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            className={`accordion-button ${isOpen ? "" : "collapsed"}`}
            type="button"
            style={{ pointerEvents: "none" }}
          >
            {title || __("New Tab")}
          </button>
        </div>

        <div className={`accordion-collapse ${isOpen ? "show" : ""}`}>
          <div className="accordion-body">
            <InnerBlocks
              template={[
                [
                  "core/paragraph",
                  { placeholder: __("Accordion content goes here...") },
                ],
              ]}
              renderAppender={InnerBlocks.ButtonBlockAppender}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;

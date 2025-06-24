// File: themes/bootstrap-custom-theme/blocks/accordion/src/edit.js

import { __ } from "@wordpress/i18n";
import {
  PanelBody,
  Button,
  SelectControl,
  TextControl,
} from "@wordpress/components";
import {
  useBlockProps,
  InspectorControls,
  InnerBlocks,
} from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import { createBlock } from "@wordpress/blocks";
import { useEffect, useState } from "@wordpress/element";

const ALLOWED_BLOCKS = ["bootstrap-custom-theme/accordion-item"];

const Edit = ({ attributes, setAttributes, clientId }) => {
  const { accordionType, customId, customClass } = attributes;

  const [activeItemId, setActiveItemId] = useState(null);

  const { getBlocks } = useSelect("core/block-editor");
  const { replaceInnerBlocks } = useDispatch("core/block-editor");

  const innerBlocks = getBlocks(clientId);

  useEffect(() => {
    if (!customId) {
      setAttributes({
        customId: `accordion-${Math.random().toString(36).slice(2, 11)}`,
      });
    }

    if (innerBlocks.length === 0) {
      const firstBlock = createBlock("bootstrap-custom-theme/accordion-item", {
        title: "Accordion Item #1",
        isOpen: accordionType !== "always-open",
        itemId: `item-${Date.now()}`,
      });
      replaceInnerBlocks(clientId, [firstBlock]);
    }
  }, []);

  const addNewItem = () => {
    const newItem = createBlock("bootstrap-custom-theme/accordion-item", {
      title: `Accordion Item #${innerBlocks.length + 1}`,
      isOpen: accordionType === "always-open",
      itemId: `item-${Date.now()}`,
    });
    replaceInnerBlocks(clientId, [...innerBlocks, newItem]);
  };

  return (
    <div {...useBlockProps()}>
      <InspectorControls>
        <PanelBody title={__("Accordion Settings")}>
          <SelectControl
            label={__("Accordion Type")}
            value={accordionType}
            options={[
              { label: "Default", value: "default" },
              { label: "Flush", value: "flush" },
              { label: "Always Open", value: "always-open" },
            ]}
            onChange={(val) => setAttributes({ accordionType: val })}
          />
          <TextControl
            label="Custom ID"
            value={customId}
            onChange={(val) => setAttributes({ customId: val })}
          />
          <TextControl
            label="Custom Class"
            value={customClass}
            onChange={(val) => setAttributes({ customClass: val })}
          />
          <Button
            variant="primary"
            onClick={addNewItem}
            style={{ marginTop: 10 }}
          >
            {__("Add New Item")}
          </Button>
        </PanelBody>
      </InspectorControls>

      <div className="accordion-editor-block">
        <InnerBlocks
          allowedBlocks={ALLOWED_BLOCKS}
          templateLock={false}
          orientation="vertical"
        />
      </div>
    </div>
  );
};

export default Edit;

import { __ } from "@wordpress/i18n";
import { PanelBody, Button, SelectControl, TextControl } from "@wordpress/components";
import { useBlockProps, InspectorControls, InnerBlocks } from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import { createBlock } from "@wordpress/blocks";
import { useEffect, useState } from "@wordpress/element";

const ALLOWED_BLOCKS = ["bootstrap-custom-theme/accordion-item"];

const Edit = ({ attributes, setAttributes, clientId }) => {
  const { accordionType, customId, customClass } = attributes;
  const [forceUpdate, setForceUpdate] = useState(0); // Force re-render
  
  // Get block editor data
  const { getBlocks, getBlockOrder } = useSelect("core/block-editor");
  const { insertBlock, replaceInnerBlocks } = useDispatch("core/block-editor");

  // Get current blocks - using both methods for debugging
  const innerBlocks = getBlocks(clientId);
  const innerBlockIds = getBlockOrder(clientId);
  

  // Initialize accordion
  useEffect(() => {
    if (!customId) {
      setAttributes({ customId: `accordion-${Math.random().toString(36).slice(2, 11)}` });
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

  const addNewItem = async () => {
    
    try {
      // Create new item
      const newItem = createBlock("bootstrap-custom-theme/accordion-item", {
        title: `Accordion Item #${innerBlocks.length + 1}`,
        isOpen: accordionType === "always-open",
        itemId: `item-${Date.now()}`,
      });


      // Method 1: Try insertBlock first
      await insertBlock(newItem, innerBlocks.length, clientId);

      // Force UI update if needed
      setForceUpdate(Date.now());

      // Fallback check after 500ms
      setTimeout(() => {
        const updatedBlocks = getBlocks(clientId);
        if (!updatedBlocks.some(block => block.clientId === newItem.clientId)) {
          console.warn('Block not inserted, trying replaceInnerBlocks');
          replaceInnerBlocks(clientId, [...innerBlocks, newItem]);
        }
      }, 500);

    } catch (error) {
      console.error('Failed to add item:', error);
      // Final fallback - direct DOM manipulation (last resort)
      const fallbackAdd = () => {
        const container = document.querySelector(`[data-block="${clientId}"] .block-editor-inner-blocks`);
        if (container) {
          container.insertAdjacentHTML('beforeend', `
            <div data-block="${newItem.clientId}" class="wp-block bootstrap-custom-theme-accordion-item">
              [Accordion Item - please save and refresh]
            </div>
          `);
        }
      };
      fallbackAdd();
    }
  };

  return (
    <div {...useBlockProps({ key: forceUpdate })}> {/* Force re-render */}
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

      {/* Visual debug area */}
      

      <InnerBlocks
        allowedBlocks={ALLOWED_BLOCKS}
        renderAppender={false}
        orientation="vertical"
        templateLock={false}
      />
    </div>
  );
};

export default Edit;
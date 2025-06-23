import { __ } from "@wordpress/i18n";
import { PanelBody, TextControl, CheckboxControl,Button } from "@wordpress/components";
import {
  InspectorControls,
  useBlockProps,
  InnerBlocks,
} from "@wordpress/block-editor";
import { useEffect } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";

const Edit = ({ attributes, setAttributes, clientId }) => {
  const { title, customId, isActive, customClass } = attributes;

  const { removeBlock } = useDispatch("core/block-editor");

  // Check if block is selected or its inner content is selected
  const { isSelected, hasSelectedInnerBlock, getSelectedBlockClientId } =
    useSelect(
      (select) => ({
        isSelected: select(blockEditorStore).isBlockSelected(clientId),
        hasSelectedInnerBlock: select(blockEditorStore).hasSelectedInnerBlock(
          clientId,
          true
        ),
        getSelectedBlockClientId:
          select(blockEditorStore).getSelectedBlockClientId,
      }),
      [clientId]
    );

  const isActiveTab = isActive || isSelected || hasSelectedInnerBlock;

  useEffect(() => {
    if (!customId) {
      const safeId = `tab-${clientId.replace(/[^a-z0-9]/g, "")}`;
      setAttributes({ customId: safeId });
    }
  }, [customId, clientId, setAttributes]);

  const handleRemove = () => {
    removeBlock(clientId, true);
  };

  const blockProps = useBlockProps({
    className: `tab-pane fade ${isActive ? "show active" : ""} ${
      customClass || ""
    }`,
    id: customId,
    role: "tabpanel",
  });

  return (
    <>
      {isActiveTab && (
        <>
          <InspectorControls>
            <PanelBody title={__("Tab Settings")} initialOpen={true}>
              <TextControl
                label={__("Tab Title")}
                value={title}
                onChange={(value) => setAttributes({ title: value })}
              />
              <TextControl
                label={__("Tab ID")}
                value={customId}
                onChange={(value) => setAttributes({ customId: value })}
                help={__("Used for linking tabs via Bootstrap.")}
              />
              <TextControl
                label={__("Custom Class")}
                value={customClass}
                onChange={(value) => setAttributes({ customClass: value })}
              />
              <CheckboxControl
                label={__("Set this tab as active")}
                checked={isActive}
                onChange={(value) => setAttributes({ isActive: value })}
              />
              <Button
                onClick={handleRemove}
                style={{
                  background: "red",
                  color: "#fff"
                }}
              >
                Remove
              </Button>
            </PanelBody>
          </InspectorControls>
          <div {...blockProps}>
            {/* <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <strong>{title || __("New Tab")}</strong>
              <button
                onClick={handleRemove}
                style={{
                  background: "none",
                  border: "1px solid red",
                  color: "red",
                  cursor: "pointer",
                }}
                aria-label={__("Remove Tab")}
              >
                ✕
              </button>
            </div> */}

            <InnerBlocks renderAppender={InnerBlocks.ButtonBlockAppender} />
          </div>
        </>
      )}
    </>
  );
};

export default Edit;

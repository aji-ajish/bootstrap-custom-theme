import { __ } from "@wordpress/i18n";
import {
  Button,
  PanelBody,
  SelectControl,
  TextControl,
  ToolbarButton,
} from "@wordpress/components";
import {
  useBlockProps,
  InnerBlocks,
  InspectorControls,
} from "@wordpress/block-editor";
import { useDispatch, useSelect } from "@wordpress/data";
import { createBlock } from "@wordpress/blocks";
import { useEffect, useState } from "@wordpress/element";
import classnames from "classnames";

const ALLOWED_BLOCKS = ["bootstrap-custom-theme/tab-item"];

const Edit = ({ attributes, setAttributes, clientId }) => {
  const { orientation, tabStyle, customClass, customId } = attributes;

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [editingTabId, setEditingTabId] = useState(null);

  const { replaceInnerBlocks } = useDispatch("core/block-editor");

  const innerBlocks = useSelect(
    (select) => select("core/block-editor").getBlocks(clientId),
    [clientId]
  );

  useEffect(() => {
    if (activeTabIndex >= innerBlocks.length && innerBlocks.length > 0) {
      setActiveTabIndex(innerBlocks.length - 1);
    } else if (innerBlocks.length === 0) {
      setActiveTabIndex(0);
    }
  }, [innerBlocks.length, activeTabIndex]);

  const addNewTab = () => {
    const newTabTitle = `Tab ${innerBlocks.length + 1}`;
    const newCustomId = `tab-${clientId.replace(
      /[^a-z0-9]/g,
      ""
    )}-${Date.now()}`;

    const newTab = createBlock("bootstrap-custom-theme/tab-item", {
      title: newTabTitle,
      customId: newCustomId,
      isActive: true,
    });

    const updatedInnerBlocks = innerBlocks.map((block) =>
      createBlock(
        block.name,
        { ...block.attributes, isActive: false },
        block.innerBlocks
      )
    );

    replaceInnerBlocks(clientId, [...updatedInnerBlocks, newTab]);
    setEditingTabId(newTab.clientId);
    setActiveTabIndex(innerBlocks.length);
  };

  const handleTabClick = (index) => {
    setActiveTabIndex(index);
    setEditingTabId(innerBlocks[index]?.clientId || null);
    const updatedBlocks = innerBlocks.map((block, i) =>
      createBlock(
        block.name,
        {
          ...block.attributes,
          isActive: i === index,
        },
        block.innerBlocks
      )
    );
    replaceInnerBlocks(clientId, updatedBlocks);
  };

  const handleTabUpdate = (newAttributes) => {
    const updatedBlocks = innerBlocks.map((block) =>
      block.clientId === editingTabId
        ? createBlock(
            block.name,
            { ...block.attributes, ...newAttributes },
            block.innerBlocks
          )
        : block
    );
    replaceInnerBlocks(clientId, updatedBlocks);
  };

  const getTabClass = (index) =>
    classnames("nav-link", {
      active: index === activeTabIndex,
      "is-being-edited": innerBlocks[index]?.clientId === editingTabId,
    });

  const getPaneClass = (index) =>
    classnames("tab-pane", "fade", {
      "show active": index === activeTabIndex,
    });

  const editedTab = innerBlocks.find(
    (block) => block.clientId === editingTabId
  );

  

  return (
    <div {...useBlockProps()}>
      <InspectorControls>
        <PanelBody title={__("Tabs Settings")} initialOpen={true}>
          <SelectControl
            label={__("Tab Style")}
            value={tabStyle}
            options={[
              { label: "Tabs", value: "nav-tabs" },
              { label: "Pills", value: "nav-pills" },
            ]}
            onChange={(value) => setAttributes({ tabStyle: value })}
          />
          <SelectControl
            label={__("Orientation")}
            value={orientation}
            options={[
              { label: "Horizontal", value: "horizontal" },
              { label: "Vertical", value: "vertical" },
            ]}
            onChange={(value) => setAttributes({ orientation: value })}
          />
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
            variant="primary"
            onClick={addNewTab}
            style={{ marginTop: "10px" }}
          >
            {__("Add New Tab")}
          </Button>
        </PanelBody>
      </InspectorControls>

      {innerBlocks.length > 0 ? (
        <div
          className={classnames(
            "tabs-editor-wrapper",
            {
              "d-flex align-items-start": orientation === "vertical",
            },
            customClass
          )}
        >
          <div
            className={classnames("nav", tabStyle, {
              "flex-column me-3": orientation === "vertical",
            })}
            role="tablist"
          >
            {innerBlocks.map((block, index) => (
              <ToolbarButton
                key={block.clientId}
                className={getTabClass(index)}
                onClick={() => handleTabClick(index)}
                isPressed={index === activeTabIndex}
                role="tab"
                aria-selected={index === activeTabIndex}
              >
                {block.attributes.title || __("New Tab")}
                {block.clientId === editingTabId && (
                  <span
                    className="dashicons dashicons-edit"
                    style={{ marginLeft: "5px" }}
                  />
                )}
              </ToolbarButton>
            ))}
          </div>

          <div className="tab-content flex-grow-1">
            {innerBlocks[activeTabIndex] && (
              <div
                key={innerBlocks[activeTabIndex].clientId}
                className="tab-pane fade show active"
                role="tabpanel"
                id={innerBlocks[activeTabIndex].attributes.customId}
              >
                <InnerBlocks
                  clientId={innerBlocks[activeTabIndex].clientId}
                  templateLock={false}
                  renderAppender={false}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="components-placeholder">
          <p>{__("Start by adding your first tab.")}</p>
          <Button isPrimary onClick={addNewTab}>
            {__("Add First Tab")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Edit;

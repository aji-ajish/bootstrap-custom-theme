import { __ } from "@wordpress/i18n";
import {
  Button,
  PanelBody,
  SelectControl,
  TextControl,
  CheckboxControl,
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

  const { replaceInnerBlocks, removeBlock } = useDispatch("core/block-editor");

  const innerBlocks = useSelect(
    (select) => select("core/block-editor").getBlocks(clientId),
    [clientId]
  );

  // Add first tab automatically
  useEffect(() => {
    if (innerBlocks.length === 0) {
      const newCustomId = `tab-1-${Date.now()}`;
      const newTab = createBlock("bootstrap-custom-theme/tab-item", {
        title: "Tab 1",
        customId: newCustomId,
        isActive: true,
      });
      replaceInnerBlocks(clientId, [newTab], false);
      setActiveTabIndex(0);
    }
  }, [innerBlocks.length]);

  // Sync active tab state
  useEffect(() => {
    if (activeTabIndex >= innerBlocks.length && innerBlocks.length > 0) {
      setActiveTabIndex(innerBlocks.length - 1);
    } else if (innerBlocks.length === 0) {
      setActiveTabIndex(0);
    }
  }, [innerBlocks.length, activeTabIndex]);

  const addNewTab = () => {
    const newTabTitle = `Tab ${innerBlocks.length + 1}`;
    const newCustomId = `tab-${innerBlocks.length + 1}-${Date.now()}`;

    const newTab = createBlock("bootstrap-custom-theme/tab-item", {
      title: newTabTitle,
      customId: newCustomId,
      isActive: true,
    });

    const updatedInnerBlocks = innerBlocks.map((block) =>
      createBlock(block.name, { ...block.attributes, isActive: false }, block.innerBlocks)
    );

    replaceInnerBlocks(clientId, [...updatedInnerBlocks, newTab]);
    setActiveTabIndex(innerBlocks.length);
  };

  const handleTabClick = (index) => {
    setActiveTabIndex(index);
    const updatedBlocks = innerBlocks.map((block, i) =>
      createBlock(block.name, {
        ...block.attributes,
        isActive: i === index,
      }, block.innerBlocks)
    );
    replaceInnerBlocks(clientId, updatedBlocks);
  };

  const handleTabUpdate = (newAttributes, targetClientId) => {
    const updatedBlocks = innerBlocks.map((block) =>
      block.clientId === targetClientId
        ? createBlock(block.name, { ...block.attributes, ...newAttributes }, block.innerBlocks)
        : block
    );
    replaceInnerBlocks(clientId, updatedBlocks);
  };

  const getTabClass = (index) =>
    classnames("nav-link", {
      active: index === activeTabIndex,
      "is-being-edited": innerBlocks[index]?.attributes?.isActive,
    });

  const activeTab = innerBlocks.find((block) => block.attributes?.isActive);

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

        {activeTab && (
          <PanelBody title={__("Current Tab Settings")} initialOpen={true}>
            <TextControl
              label={__("Tab Title")}
              value={activeTab.attributes.title}
              onChange={(value) =>
                handleTabUpdate({ title: value }, activeTab.clientId)
              }
            />
            <TextControl
              label={__("Tab ID")}
              value={activeTab.attributes.customId}
              onChange={(value) =>
                handleTabUpdate({ customId: value }, activeTab.clientId)
              }
            />
            <TextControl
              label={__("Custom Class")}
              value={activeTab.attributes.customClass}
              onChange={(value) =>
                handleTabUpdate({ customClass: value }, activeTab.clientId)
              }
            />
            <CheckboxControl
              label={__("Set this tab as active")}
              checked={activeTab.attributes.isActive}
              onChange={(value) =>
                handleTabUpdate({ isActive: value }, activeTab.clientId)
              }
            />
            <Button
              isDestructive
              variant="secondary"
              onClick={() => {
                removeBlock(activeTab.clientId, true);
                setActiveTabIndex(0);
              }}
              style={{ marginTop: "10px" }}
            >
              {__("Remove This Tab")}
            </Button>
          </PanelBody>
        )}
      </InspectorControls>

      {innerBlocks.length > 0 ? (
        <div
          className={classnames(
            "px-2 py-3 tabs-block border",
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

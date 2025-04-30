import {
  useBlockProps,
  InspectorControls,
  RichText,
} from "@wordpress/block-editor";
import { PanelBody, SelectControl, Button } from "@wordpress/components";
import { TrashIcon } from "@wordpress/icons";

export default function Edit({ attributes, setAttributes }) {
  const { tabs, orientation, style } = attributes;

  const updateTab = (index, key, value) => {
    const updatedTabs = [...tabs];
    updatedTabs[index][key] = value;
    setAttributes({ tabs: updatedTabs });
  };

  const addTab = () => {
    setAttributes({
      tabs: [...tabs, { title: "New Tab", content: "New Content" }],
    });
  };

  const deleteTab = (index) => {
    const updatedTabs = tabs.filter((_, tabIndex) => tabIndex !== index);
    setAttributes({ tabs: updatedTabs });
  };

  return (
    <div {...useBlockProps()}>
      <InspectorControls>
        <PanelBody title="Tab Settings">
          <SelectControl
            label="Tab Orientation"
            value={orientation}
            options={[
              { label: "Horizontal", value: "horizontal" },
              { label: "Vertical", value: "vertical" },
            ]}
            onChange={(value) => setAttributes({ orientation: value })}
          />
          <SelectControl
            label="Tab Style"
            value={style}
            options={[
              { label: "Tabs", value: "tabs" },
              { label: "Pills", value: "pills" },
            ]}
            onChange={(value) => setAttributes({ style: value })}
          />
          <Button isPrimary onClick={addTab}>
            Add New Tab
          </Button>
        </PanelBody>
      </InspectorControls>

      <div className={orientation === "vertical" ? "row" : ""}>
        {/* Navigation */}
        <div className={orientation === "vertical" ? "col-md-3" : ""}>
          <ul
            className={`nav nav-${style} ${
              orientation === "vertical" ? "flex-column" : ""
            }`}
            role="tablist"
            aria-orientation={orientation}
          >
            {tabs.map((tab, index) => {
              const tabId = tab.title.toLowerCase().replace(/\s+/g, "-");
              return (
                <li key={index} className="nav-item" role="presentation">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <RichText
                      tagName="button"
                      className={`nav-link ${index === 0 ? "active" : ""}`}
                      value={tab.title}
                      onChange={(value) => updateTab(index, "title", value)}
                      placeholder="Tab Title"
                      data-bs-toggle="tab"
                      data-bs-target={`#${tabId}`}
                      role="tab"
                      aria-selected={index === 0 ? "true" : "false"}
                      id={`${tabId}-button`}
                      aria-controls={tabId}
                    />
                    {index !== 0 && (
                      <span
                        onClick={() => deleteTab(index)}
                        style={{
                          marginLeft: "8px",
                          color: "red",
                          cursor: "pointer",
                        }}
                      >
                        ×
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Content */}
        <div className={orientation === "vertical" ? "col-md-9" : ""}>
          <div className="tab-content">
            {tabs.map((tab, index) => {
              const tabId = tab.title.toLowerCase().replace(/\s+/g, "-");
              return (
                <div
                  key={index}
                  className={`tab-pane fade ${
                    index === 0 ? "show active" : ""
                  }`}
                  id={tabId}
                  role="tabpanel"
                  aria-labelledby={`${tabId}-button`}
                >
                  <RichText
                    tagName="div"
                    value={tab.content}
                    onChange={(value) => updateTab(index, "content", value)}
                    placeholder="Tab Content"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

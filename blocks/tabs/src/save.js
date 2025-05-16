import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
  const {
    customId,
    customClass,
    orientation = "horizontal",
    tabStyle = "nav-tabs",
  } = attributes;

  const tabId = customId || "tab-block";
  const isVertical = orientation === "vertical";
  const navClass = isVertical
    ? `nav flex-column ${tabStyle} me-3`
    : `nav ${tabStyle}`;

  return (
    <div
      {...useBlockProps.save({
        className: `tabs-block `,
      })}
    >
      {isVertical ? (
        <>
          <div className={`d-flex align-items-start ${customClass || ""}`}>
            <div
              id={tabId}
              className={navClass}
              role="tablist"
              aria-orientation="vertical"
            >
              {/* Buttons inserted here by JS */}
            </div>
            <div className="tab-content" id={`${tabId}-content`}>
              {/* Panes inserted here by JS */}
            </div>
          </div>
        </>
      ) : (
        <>
          <nav className={`${customClass || ""}`}>
            <div id={tabId} className={navClass} role="tablist">
              {/* Buttons inserted here by JS */}
            </div>
          </nav>
          <div className="tab-content" id={`${tabId}-content`}>
            {/* Panes inserted here by JS */}
          </div>
        </>
      )}
      <InnerBlocks.Content />
    </div>
  );
};

export default Save;

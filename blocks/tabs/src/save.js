import { RichText } from "@wordpress/block-editor";

export default function Save({ attributes }) {
  const { tabs, orientation, style } = attributes;

  return (
    <div>
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
                  <RichText.Content
                    tagName="button"
                    className={`nav-link ${index === 0 ? "active" : ""}`}
                    value={tab.title}
                    data-bs-toggle="tab"
                    data-bs-target={`#${tabId}`}
                    role="tab"
                    aria-selected={index === 0 ? "true" : "false"}
                    id={`${tabId}-button`}
                    aria-controls={tabId}
                  />
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
                  <RichText.Content tagName="div" value={tab.content} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import { RichText } from '@wordpress/block-editor';

export default function Save({ attributes }) {
  const { tabs, orientation, style } = attributes;

  return (
    <div>
      {/* Navigation with dynamic active class */}
      <ul className={`nav nav-${style} ${orientation === 'vertical' ? 'flex-column' : ''}`} role="tablist" aria-orientation={orientation}>
        {tabs.map((tab, index) => {
          const tabId = tab.title.toLowerCase().replace(/\s+/g, '-'); // Generate unique id based on tab title
          return (
            <li key={index} className="nav-item" role="presentation">
              <RichText.Content
                tagName="button"
                className={`nav-link ${index === 0 ? 'active' : ''}`} // Only the first tab is active
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

      {/* Tab Content with dynamic active class */}
      <div className="tab-content">
        {tabs.map((tab, index) => {
          const tabId = tab.title.toLowerCase().replace(/\s+/g, '-'); // Generate unique id based on tab title
          return (
            <div
              key={index}
              className={`tab-pane fade ${index === 0 ? 'show active' : ''}`} // Only the first tab pane is active
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
  );
}

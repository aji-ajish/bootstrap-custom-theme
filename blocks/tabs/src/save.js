import { RichText } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { tabs, orientation, style, clientId } = attributes;

    return (
        <div className={orientation === 'vertical' ? 'd-flex align-items-start' : ''}>
            <div 
                className={`nav ${orientation === 'vertical' ? 'flex-column me-3' : ''} nav-${style} mb-3`} 
                id={`nav-${clientId}`}
                role="tablist"
            >
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`nav-link ${tab.active ? 'active' : ''}`}
                        id={`nav-${clientId}-tab-${index}`}
                        data-bs-toggle="tab"
                        data-bs-target={`#nav-${clientId}-${index}`}
                        type="button"
                        role="tab"
                        aria-controls={`nav-${clientId}-${index}`}
                        aria-selected={tab.active}
                    >
                        <RichText.Content
                            tagName="span"
                            value={tab.title}
                        />
                    </button>
                ))}
            </div>

            <div className="tab-content" id={`nav-${clientId}-content`}>
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        className={`tab-pane fade ${tab.active ? 'show active' : ''}`}
                        id={`nav-${clientId}-${index}`}
                        role="tabpanel"
                        aria-labelledby={`nav-${clientId}-tab-${index}`}
                    >
                        <div className="tab-content-inner">
                            {tab.innerBlocks && tab.innerBlocks.map((block, i) => (
                                <div key={i} dangerouslySetInnerHTML={{ __html: block }} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
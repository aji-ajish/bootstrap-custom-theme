import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Button, SelectControl, PanelBody, PanelRow } from '@wordpress/components';
import { InnerBlocks, useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';

const ALLOWED_BLOCKS = ['core/paragraph', 'core/image', 'core/heading', 'core/list', 'core/columns'];

export default function Edit({ attributes, setAttributes, clientId }) {
    const { tabs, orientation, style } = attributes;
    const [activeTab, setActiveTab] = useState(0);
    const blockProps = useBlockProps();

    // Initialize innerBlocks for each tab on the first render
    useEffect(() => {
        if (tabs.length > 0 && !tabs[0].innerBlocks) {
            const newTabs = tabs.map(tab => ({
                ...tab,
                innerBlocks: tab.innerBlocks || []  // Initialize empty blocks
            }));
            setAttributes({ tabs: newTabs });
        }
    }, [tabs, setAttributes]);

    // Add a new tab
    const addTab = () => {
        const newTabs = [...tabs];
        newTabs.push({
            title: `Tab ${tabs.length + 1}`,
            active: false,
            innerBlocks: []  // New tab with no content
        });
        setAttributes({ tabs: newTabs });
    };

    // Remove a tab
    const removeTab = (index) => {
        if (tabs.length <= 1) return;

        const newTabs = [...tabs];
        newTabs.splice(index, 1);

        if (tabs[index].active && newTabs.length > 0) {
            newTabs[0].active = true;
            setActiveTab(0);
        }

        setAttributes({ tabs: newTabs });
    };

    // Update tab title
    const updateTabTitle = (index, title) => {
        const newTabs = [...tabs];
        newTabs[index].title = title;
        setAttributes({ tabs: newTabs });
    };

    // Set the active tab
    const setTabActive = (index) => {
        const newTabs = tabs.map((tab, i) => ({
            ...tab,
            active: i === index
        }));
        setAttributes({ tabs: newTabs });
        setActiveTab(index);
    };

    return (
        <div {...blockProps}>
            <InspectorControls>
                <PanelBody title={__('Tabs Settings', 'bootstrap-custom-theme')}>
                    <PanelRow>
                        <SelectControl
                            label={__('Orientation', 'bootstrap-custom-theme')}
                            value={orientation}
                            options={[
                                { label: __('Horizontal', 'bootstrap-custom-theme'), value: 'horizontal' },
                                { label: __('Vertical', 'bootstrap-custom-theme'), value: 'vertical' }
                            ]}
                            onChange={(value) => setAttributes({ orientation: value })}
                        />
                    </PanelRow>
                    <PanelRow>
                        <SelectControl
                            label={__('Style', 'bootstrap-custom-theme')}
                            value={style}
                            options={[
                                { label: __('Tabs', 'bootstrap-custom-theme'), value: 'tabs' },
                                { label: __('Pills', 'bootstrap-custom-theme'), value: 'pills' }
                            ]}
                            onChange={(value) => setAttributes({ style: value })}
                        />
                    </PanelRow>
                    <PanelRow>
                        <Button variant="primary" onClick={addTab}>
                            {__('Add Tab', 'bootstrap-custom-theme')}
                        </Button>
                    </PanelRow>
                </PanelBody>
            </InspectorControls>

            <div className={orientation === 'vertical' ? 'd-flex align-items-start' : ''}>
                <div
                    className={`nav ${orientation === 'vertical' ? 'flex-column me-3' : ''} nav-${style} mb-3`}
                    role="tablist"
                >
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            className={`nav-link ${tab.active ? 'active' : ''}`}
                            type="button"
                            role="tab"
                            aria-selected={tab.active}
                            onClick={() => setTabActive(index)}
                        >
                            <RichText
                                tagName="span"
                                value={tab.title}
                                onChange={(value) => updateTabTitle(index, value)}
                                allowedFormats={[]}
                                placeholder={__('Tab title', 'bootstrap-custom-theme')}
                            />
                            <Button
                                className="tab-remove"
                                isSmall
                                isDestructive
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeTab(index);
                                }}
                            >
                                ×
                            </Button>
                        </button>
                    ))}
                </div>

                <div className="tab-content">
                    {tabs.map((tab, index) => (
                        <div key={index} className={`tab-pane ${tab.active ? 'active' : ''}`} role="tabpanel">
                            {tab.active && (
                                <div className="tab-content-inner">
                                    <InnerBlocks
                                        allowedBlocks={ALLOWED_BLOCKS}
                                        value={tab.innerBlocks} // Ensure each tab has its unique blocks
                                        onChange={(blocks) => {
                                            const updatedTabs = [...tabs];
                                            updatedTabs[index].innerBlocks = blocks;
                                            setAttributes({ tabs: updatedTabs });
                                        }}
                                        template={[['core/paragraph', { placeholder: 'Add tab content...' }]]}
                                        templateLock={false}
                                        renderAppender={InnerBlocks.ButtonBlockAppender}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Button, SelectControl, PanelBody, PanelRow } from '@wordpress/components';
import { InnerBlocks, useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';

const ALLOWED_BLOCKS = ['core/paragraph', 'core/image', 'core/heading', 'core/list', 'core/columns'];
const TEMPLATE = [['core/paragraph', { placeholder: 'Add tab content...' }]];

export default function Edit({ attributes, setAttributes, clientId }) {
    const { tabs = [], orientation, style } = attributes;
    const [activeTab, setActiveTab] = useState(0);
    const blockProps = useBlockProps();

    // Init tabs on first mount
    useEffect(() => {
        if (!attributes.clientId) {
            setAttributes({ clientId });
        }
        if (tabs.length === 0) {
            setAttributes({
                tabs: [{
                    title: 'Tab 1',
                    active: true,
                    ref: `tab-${clientId}-0`,
                }]
            });
        }
    }, []);

    const addTab = () => {
        const newIndex = tabs.length;
        const newTabs = tabs.map(tab => ({ ...tab, active: false }));
        newTabs.push({
            title: `Tab ${newIndex + 1}`,
            active: true,
            ref: `tab-${clientId}-${newIndex}`,
        });
        setAttributes({ tabs: newTabs });
        setActiveTab(newIndex);
    };

    const removeTab = (index) => {
        if (tabs.length <= 1) return;
        const newTabs = tabs.filter((_, i) => i !== index).map((tab, i) => ({
            ...tab,
            active: i === 0, // activate the first tab if active one is removed
        }));
        setAttributes({ tabs: newTabs });
        setActiveTab(0);
    };

    const updateTabTitle = (index, title) => {
        const newTabs = [...tabs];
        newTabs[index].title = title;
        setAttributes({ tabs: newTabs });
    };

    const setTabActive = (index) => {
        const newTabs = tabs.map((tab, i) => ({ ...tab, active: i === index }));
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
                {/* Tab headers */}
                <div className={`nav ${orientation === 'vertical' ? 'flex-column me-3' : ''} nav-${style} mb-3`}>
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.ref}
                            className={`nav-link ${tab.active ? 'active' : ''}`}
                            onClick={() => setTabActive(index)}
                            type="button"
                        >
                            <RichText
                                tagName="span"
                                value={tab.title}
                                onChange={(value) => updateTabTitle(index, value)}
                                placeholder={__('Tab title')}
                                allowedFormats={[]}
                            />
                            {tabs.length > 1 && (
                                <Button
                                    isSmall
                                    isDestructive
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeTab(index);
                                    }}
                                >
                                    ×
                                </Button>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="tab-content w-100">
                    {tabs.map((tab, index) => (
                        <div
                            key={tab.ref}
                            className={`tab-pane ${tab.active ? 'active' : ''}`}
                        >
                            {tab.active && (
                                <InnerBlocks
                                    allowedBlocks={ALLOWED_BLOCKS}
                                    template={TEMPLATE}
                                    templateLock={false}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';
import { InnerBlocks } from '@wordpress/block-editor';
import { Button, SelectControl, TextControl } from '@wordpress/components';

const containerOptions = [
    { label: 'container', value: 'container' },
    { label: 'container-sm', value: 'container-sm' },
    { label: 'container-md', value: 'container-md' },
    { label: 'container-lg', value: 'container-lg' },
    { label: 'container-xl', value: 'container-xl' },
    { label: 'container-xxl', value: 'container-xxl' },
    { label: 'container-fluid', value: 'container-fluid' },
];

export default function Edit({ attributes, setAttributes, isSelected, clientId }) {
    const { containerType, customClass, sectionClass } = attributes;

    const [showPopup, setShowPopup] = useState(false);
    const [hasSavedSettings, setHasSavedSettings] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const popupRef = useRef(null);
    const isDragging = useRef(false);
    const popupOffset = useRef({ x: 0, y: 0 });

    // Calculate center position when component mounts
    useEffect(() => {
        const calculateCenterPosition = () => {
            if (typeof window === 'undefined') return;
            
            const popupWidth = 400; // Same as your popup width
            const popupHeight = 300; // Approximate height
            
            const centerX = (window.innerWidth - popupWidth) / 2;
            const centerY = (window.innerHeight - popupHeight) / 2;
            
            setPosition({
                x: centerX,
                y: centerY
            });
        };

        calculateCenterPosition();
        
        // Recalculate on window resize
        const handleResize = () => calculateCenterPosition();
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Show popup only when block is added first time
    useEffect(() => {
        if (isSelected && !hasSavedSettings) {
            setShowPopup(true);
        }
    }, [isSelected]);

    // Setup and cleanup drag handlers
    useEffect(() => {
        if (!showPopup) return;

        const handleMouseDown = (e) => {
            // Only start dragging if clicking on the header
            if (e.target !== popupRef.current.querySelector('.popup-header')) {
                return;
            }

            isDragging.current = true;
            const rect = popupRef.current.getBoundingClientRect();
            popupOffset.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };

            document.body.style.userSelect = 'none';
        };

        const handleMouseMove = (e) => {
            if (!isDragging.current) return;

            setPosition({
                x: e.clientX - popupOffset.current.x,
                y: e.clientY - popupOffset.current.y
            });
        };

        const handleMouseUp = () => {
            isDragging.current = false;
            document.body.style.userSelect = '';
        };

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = '';
        };
    }, [showPopup]);

    const saveSettings = () => {
        setShowPopup(false);
        setHasSavedSettings(true);
    };

    return (
        <div style={{ position: 'relative' }} data-block-id={clientId}>
            <Button
                variant="secondary"
                style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    zIndex: 10,
                }}
                onClick={() => setShowPopup(true)}
            >
                ⚙️
            </Button>

            {showPopup && (
                <div
                    ref={popupRef}
                    style={{
                        position: 'fixed',
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        width: '400px',
                        background: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                        zIndex: 9999,
                    }}
                >
                    <div
                        className="popup-header"
                        style={{
                            background: '#f1f1f1',
                            padding: '10px',
                            cursor: 'move',
                            borderTopLeftRadius: '8px',
                            borderTopRightRadius: '8px',
                            fontWeight: 'bold',
                            borderBottom: '1px solid #ccc',
                            userSelect: 'none',
                        }}
                    >
                        Block Settings
                    </div>

                    <div style={{ padding: '15px' }}>
                        <SelectControl
                            label="Container Type"
                            value={containerType}
                            options={containerOptions}
                            onChange={(value) => setAttributes({ containerType: value })}
                        />
                        <TextControl
                            label="Custom Container Class"
                            value={customClass}
                            onChange={(value) => setAttributes({ customClass: value })}
                        />
                        <TextControl
                            label="Section Class"
                            value={sectionClass}
                            onChange={(value) => setAttributes({ sectionClass: value })}
                        />

                        <div style={{ marginTop: '20px', textAlign: 'right' }}>
                            <Button variant="primary" onClick={saveSettings}>
                                Save
                            </Button>{' '}
                            <Button variant="secondary" onClick={() => setShowPopup(false)}>
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <section className={sectionClass}>
                <div className={`${containerType} ${customClass}`}>
                    <InnerBlocks />
                </div>
            </section>
        </div>
    );
}
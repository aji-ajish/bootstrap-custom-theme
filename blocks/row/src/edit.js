import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';
import { SelectControl, TextControl, Button } from '@wordpress/components';
import { InnerBlocks } from '@wordpress/block-editor';

const alignmentOptions = [
    { label: 'Start', value: 'justify-content-start' },
    { label: 'Center', value: 'justify-content-center' },
    { label: 'End', value: 'justify-content-end' },
];

export default function Edit({ attributes, setAttributes, isSelected, clientId }) {
    const { rowClass, alignment } = attributes;

    const [showPopup, setShowPopup] = useState(false);
    const [hasSavedSettings, setHasSavedSettings] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const popupRef = useRef(null);
    const isDragging = useRef(false);
    const popupOffset = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const popupWidth = 400;
        const popupHeight = 300;
        const centerX = (window.innerWidth - popupWidth) / 2;
        const centerY = (window.innerHeight - popupHeight) / 2;
        setPosition({ x: centerX, y: centerY });

        const handleResize = () => {
            setPosition({ x: centerX, y: centerY });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isSelected && !hasSavedSettings) {
            setShowPopup(true);
        }
    }, [isSelected]);

    useEffect(() => {
        if (!showPopup) return;

        const handleMouseDown = (e) => {
            if (e.target !== popupRef.current.querySelector('.popup-header')) return;
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
                        Row Block Settings
                    </div>

                    <div style={{ padding: '15px' }}>
                        <SelectControl
                            label="Row Alignment"
                            value={alignment}
                            options={alignmentOptions}
                            onChange={(value) => setAttributes({ alignment: value })}
                        />
                        <TextControl
                            label="Custom Row Class"
                            value={rowClass}
                            onChange={(value) => setAttributes({ rowClass: value })}
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

            <div className={`row ${alignment} ${rowClass}`}>
                <InnerBlocks />
            </div>
        </div>
    );
}

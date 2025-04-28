import { __ } from "@wordpress/i18n";
import { useState, useEffect, useRef } from "@wordpress/element";
import { SelectControl, TextControl, Button } from "@wordpress/components";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

const accordionTypeOptions = [
    { label: "Accordion", value: "accordion" },
    { label: "Collapse", value: "collapse" },
];

export default function Edit({
    attributes,
    setAttributes,
    isSelected,
    clientId,
}) {
    const { accordionType, numAccordions, accordionClass, ...headings } = attributes;
    const [popupOpenedOnce, setPopupOpenedOnce] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const popupRef = useRef(null);
    const isDragging = useRef(false);
    const popupOffset = useRef({ x: 0, y: 0 });
    const blockProps = useBlockProps();

    // Set popup to center on screen initially
    useEffect(() => {
        const popupWidth = 400;
        const popupHeight = 300;
        const centerX = (window.innerWidth - popupWidth) / 2;
        const centerY = (window.innerHeight - popupHeight) / 2;
        setPosition({ x: centerX, y: centerY });

        const handleResize = () => {
            setPosition({ x: centerX, y: centerY });
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Open popup when block is selected and has not been opened before
    useEffect(() => {
        if (isSelected && !popupOpenedOnce) {
            setShowPopup(true);
            setPopupOpenedOnce(true);
        }
    }, [isSelected, popupOpenedOnce]);

    // Handle popup dragging
    useEffect(() => {
        if (!showPopup) return;

        const handleMouseDown = (e) => {
            if (e.target !== popupRef.current.querySelector(".popup-header")) return;
            isDragging.current = true;
            const rect = popupRef.current.getBoundingClientRect();
            popupOffset.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
            document.body.style.userSelect = "none";
        };

        const handleMouseMove = (e) => {
            if (!isDragging.current) return;
            setPosition({
                x: e.clientX - popupOffset.current.x,
                y: e.clientY - popupOffset.current.y,
            });
        };

        const handleMouseUp = () => {
            isDragging.current = false;
            document.body.style.userSelect = "";
        };

        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.style.userSelect = "";
        };
    }, [showPopup]);

    // Save settings and close the popup
    const saveSettings = () => {
        setShowPopup(false);
    };

    // Update accordion heading dynamically
    const handleHeadingChange = (index, value) => {
        setAttributes({
            [`accordionHeading${index}`]: value,
        });
    };

    // Ensure each accordion has unique content and heading
    const getAccordionHeading = (index) => {
        return headings[`accordionHeading${index}`] || `Accordion ${index + 1}`;
    };

    return (
        <div style={{ position: "relative" }} data-block-id={clientId} {...blockProps}>
            {/* Gear Icon */}
            <Button
                variant="secondary"
                style={{
                    position: "absolute",
                    top: "0px",
                    right: "-40px",
                    zIndex: 10,
                }}
                onClick={() => setShowPopup(true)}
            >
                ⚙️
            </Button>

            {/* Popup */}
            {showPopup && (
                <div
                    ref={popupRef}
                    style={{
                        position: "fixed",
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        width: "400px",
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                        zIndex: 9999,
                    }}
                >
                    <div
                        className="popup-header"
                        style={{
                            background: "#f1f1f1",
                            padding: "10px",
                            cursor: "move",
                            borderTopLeftRadius: "8px",
                            borderTopRightRadius: "8px",
                            fontWeight: "bold",
                            borderBottom: "1px solid #ccc",
                            userSelect: "none",
                        }}
                    >
                        Accordion Block Settings
                    </div>

                    <div style={{ padding: "15px" }}>
                        <SelectControl
                            label="Accordion Type"
                            value={accordionType}
                            options={accordionTypeOptions}
                            onChange={(value) => setAttributes({ accordionType: value })}
                        />
                        <TextControl
                            label="Number of Accordions"
                            value={numAccordions}
                            type="number"
                            onChange={(value) => setAttributes({ numAccordions: parseInt(value) })}
                        />
                        <TextControl
                            label="Custom Accordion Class"
                            value={accordionClass}
                            onChange={(value) => setAttributes({ accordionClass: value })}
                        />

                        {/* Save and Close buttons */}
                        <div style={{ marginTop: "20px", textAlign: "right" }}>
                            <Button variant="primary" onClick={saveSettings}>
                                Save
                            </Button>{" "}
                            <Button variant="secondary" onClick={() => setShowPopup(false)}>
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Render Accordions */}
            <div className={`accordion ${accordionClass}`} id={`accordion-${clientId}`}>
                {[...Array(parseInt(numAccordions))].map((_, index) => (
                    <div key={index} className="accordion-item">
                        <h2 className="accordion-header" id={`heading-${index}`}>
                            <button
                                className="accordion-button"
                                type="button"
                                data-bs-toggle={accordionType}
                                data-bs-target={`#collapse-${index}`}
                                aria-expanded="true"
                                aria-controls={`collapse-${index}`}
                            >
                                <TextControl
                                    label={`Accordion ${index + 1} Heading`}
                                    value={getAccordionHeading(index)}
                                    onChange={(value) => handleHeadingChange(index, value)}
                                />
                            </button>
                        </h2>
                        <div
                            id={`collapse-${index}`}
                            className="accordion-collapse collapse show"
                            aria-labelledby={`heading-${index}`}
                            data-bs-parent={`#accordion-${clientId}`}
                        >
                            <div className="accordion-body">
                                <InnerBlocks
                                    allowedBlocks={["core/paragraph", "core/image", "core/heading", "core/list"]}
                                    template={[["core/paragraph", {}]]}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

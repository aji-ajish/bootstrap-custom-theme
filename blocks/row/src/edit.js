import { __ } from "@wordpress/i18n";
import { useState, useEffect, useRef } from "@wordpress/element";
import { SelectControl, TextControl, Button } from "@wordpress/components";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

const alignmentOptions = [
  { label: "Start", value: "justify-content-start" },
  { label: "Center", value: "justify-content-center" },
  { label: "End", value: "justify-content-end" },
];

export default function Edit({
  attributes,
  setAttributes,
  isSelected,
  clientId,
}) {
  const { rowClass, alignment } = attributes;
  const [popupOpenedOnce, setPopupOpenedOnce] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [hasSavedSettings, setHasSavedSettings] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const popupRef = useRef(null);
  const isDragging = useRef(false);
  const popupOffset = useRef({ x: 0, y: 0 });
  const blockProps = useBlockProps({ className: null });

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

  useEffect(() => {
    if (isSelected && !popupOpenedOnce) {
      setShowPopup(true);
      setPopupOpenedOnce(true); // after first time, never auto-open again
    }
  }, [isSelected, popupOpenedOnce]);

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

  const saveSettings = () => {
    setShowPopup(false);
    setHasSavedSettings(true);
  };

  return (
    <div
      style={{ position: "relative" }}
      data-block-id={clientId}
      {...blockProps}
    >
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

      {showPopup && (
        <div
          ref={popupRef}
          className="column-popup-inner"
          style={{
            position: "fixed",
            left: `${position.x}px`,
            top: `${position.y}px`,
            zIndex: 99999,
          }}
        >
          <div className="popup-header">
            <strong>Configure Row</strong>
          </div>

          <div style={{ padding: "15px" }}>
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

            {/* Save and Close buttons (side by side) */}
            <div className="popup-actions">
              <Button variant="primary" onClick={saveSettings}>
                Save
              </Button>
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

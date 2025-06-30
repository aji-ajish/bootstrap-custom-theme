import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";
import { useState, useEffect, useRef } from "@wordpress/element";
import { Button, TextControl } from "@wordpress/components";

export default function Edit({ attributes, setAttributes, isSelected }) {
  const { breakpoints, customClass } = attributes;
  const blockProps = useBlockProps();
  const popupRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [tempBreakpoints, setTempBreakpoints] = useState(
    breakpoints.length
      ? breakpoints
      : [{ breakpoint: "xs", type: "auto", count: 6 }]
  );
  const [tempClass, setTempClass] = useState(customClass || "");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [popupOpenedOnce, setPopupOpenedOnce] = useState(false);


  // Calculate center position when popup should show
  useEffect(() => {
    if (isSelected && !popupOpenedOnce) {
      setShowPopup(true);
      setPopupOpenedOnce(true); // after first time, never auto-open again
    }
  }, [isSelected, popupOpenedOnce]);

  // Calculate center position for popup
  useEffect(() => {
    if (showPopup && popupRef.current) {
      const popupWidth = popupRef.current.offsetWidth;
      const popupHeight = popupRef.current.offsetHeight;
      const centerX = (window.innerWidth - popupWidth) / 2;
      const centerY = (window.innerHeight - popupHeight) / 2;
      setPosition({ x: centerX, y: centerY });
    }
  }, [showPopup]);

  // Drag and drop functionality
  useEffect(() => {
    if (!showPopup || !popupRef.current) return;

    const header = popupRef.current.querySelector(".popup-header");
    if (!header) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const onMouseDown = (e) => {
      if (e.target !== header) return;
      isDragging = true;
      offsetX = e.clientX - popupRef.current.offsetLeft;
      offsetY = e.clientY - popupRef.current.offsetTop;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.body.style.userSelect = "none";
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - offsetX,
        y: e.clientY - offsetY,
      });
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.userSelect = "";
    };

    header.addEventListener("mousedown", onMouseDown);
    return () => {
      header.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.userSelect = "";
    };
  }, [showPopup]);

  const applySettings = () => {
    setAttributes({
      breakpoints: tempBreakpoints,
      customClass: tempClass,
    });
    setShowPopup(false);
  };

  const addBreakpoint = () => {
    setTempBreakpoints([
      ...tempBreakpoints,
      { breakpoint: "xs", type: "auto", count: 6 },
    ]);
  };

  const removeBreakpoint = (index) => {
    const updated = [...tempBreakpoints];
    updated.splice(index, 1);
    setTempBreakpoints(updated);
  };

  const updateBreakpoint = (index, key, value) => {
    const updated = [...tempBreakpoints];
    updated[index][key] = value;
    setTempBreakpoints(updated);
  };

  const renderClassName = () => {
    if (!breakpoints.length) return "col";
    return (
      breakpoints
        .map(({ breakpoint, type, count }) => {
          if (type === "auto") return `col-${breakpoint}`;
          if (type === "fixed") return `col-${breakpoint}-${count}`;
          if (type === "auto-width") return `col-${breakpoint}-auto`;
          return "";
        })
        .join(" ") + (customClass ? ` ${customClass}` : "")
    );
  };

  return (
    <div {...blockProps} className={`${blockProps.className} ${renderClassName()}`}>
      <Button
        variant="secondary"
        style={{
          position: "absolute",
          top: "0px",
          right: "-40px",
          zIndex: 10,
        }}
        onClick={() => setShowPopup(!showPopup)}
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
            <strong>Configure Column</strong>
          </div>

          <div id="column-settings">
            {tempBreakpoints.map((bp, index) => (
              <div className="breakpoint-row" key={index}>
                <select
                  className="breakpoint"
                  value={bp.breakpoint}
                  onChange={(e) =>
                    updateBreakpoint(index, "breakpoint", e.target.value)
                  }
                >
                  {["xs", "sm", "md", "lg", "xl", "xxl"].map((b) => (
                    <option value={b} key={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <select
                  className="type"
                  value={bp.type}
                  onChange={(e) =>
                    updateBreakpoint(index, "type", e.target.value)
                  }
                >
                  <option value="auto">Auto</option>
                  <option value="fixed">Fixed</option>
                  <option value="auto-width">Grow</option>
                </select>
                {bp.type === "fixed" && (
                  <input
                    type="number"
                    className="count"
                    value={bp.count}
                    min="1"
                    max="12"
                    onChange={(e) =>
                      updateBreakpoint(index, "count", parseInt(e.target.value))
                    }
                  />
                )}
                <button onClick={() => removeBreakpoint(index)}>×</button>
              </div>
            ))}
          </div>

          <button onClick={addBreakpoint} id="add-row">
            + Add Breakpoint
          </button>

          <div className="custom-class-container">
            <label>
              <strong>Custom Class:</strong>
            </label>
            <TextControl
              value={tempClass}
              onChange={setTempClass}
              placeholder="e.g. my-class"
            />
          </div>

          <div className="popup-actions">
            <Button variant="primary" onClick={applySettings}>
              Apply
            </Button>
            <Button variant="secondary" onClick={() => setShowPopup(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <InnerBlocks />
    </div>
  );
}

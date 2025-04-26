import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";
import { useState, useEffect, useRef } from "@wordpress/element";

export default function Edit({ attributes, setAttributes }) {
  const { breakpoints, customClass } = attributes;
  const blockProps = useBlockProps({ className: null });
  const popupRef = useRef();
  const [showPopup, setShowPopup] = useState(true);
  const [tempBreakpoints, setTempBreakpoints] = useState(() => {
    return breakpoints.length
      ? breakpoints
      : [{ breakpoint: "xs", type: "auto", count: 6 }];
  });
  const [tempClass, setTempClass] = useState(customClass || "");

  useEffect(() => {
    const header = popupRef.current?.querySelector(".popup-header");
    if (!header) return;

    let isDragging = false;
    let offsetX, offsetY;

    const onMouseDown = (e) => {
      isDragging = true;
      offsetX = e.clientX - popupRef.current.offsetLeft;
      offsetY = e.clientY - popupRef.current.offsetTop;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e) => {
      if (isDragging) {
        popupRef.current.style.left = `${e.clientX - offsetX}px`;
        popupRef.current.style.top = `${e.clientY - offsetY}px`;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    header.addEventListener("mousedown", onMouseDown);
    return () => {
      header.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

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
    <div {...blockProps} className={renderClassName()}>
      {showPopup && (
        <div
          ref={popupRef}
          className="column-popup-inner"
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            background: "#fff",
            padding: "20px",
            border: "1px solid #ccc",
            zIndex: 9999,
            minWidth: "300px",
          }}
        >
          <div
            className="popup-header"
            style={{
              cursor: "move",
              background: "#f2f2f2",
              padding: "6px 10px",
              margin: "-20px -20px 10px -20px",
              borderBottom: "1px solid #ccc",
            }}
          >
            <strong>Configure Column</strong>
          </div>

          <div id="column-settings">
            {tempBreakpoints.map((bp, index) => (
              <div
                className="breakpoint-row"
                key={index}
                style={{ marginBottom: "8px" }}
              >
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
                  style={{ margin: "0 6px" }}
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
                    style={{ width: "60px", marginRight: "8px" }}
                  />
                )}
                <button
                  onClick={() => removeBreakpoint(index)}
                  style={{ color: "red" }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addBreakpoint}
            id="add-row"
            style={{ marginBottom: "10px" }}
          >
            + Add Breakpoint
          </button>

          <div style={{ marginTop: "10px" }}>
            <label>
              <strong>Custom Class:</strong>
            </label>
            <input
              type="text"
              id="custom-class"
              value={tempClass}
              onChange={(e) => setTempClass(e.target.value)}
              placeholder="e.g. my-class"
              style={{ width: "100%", marginTop: "4px" }}
            />
          </div>

          <div
            className="popup-actions"
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button id="apply-columns" onClick={applySettings}>
              Apply
            </button>
            <button id="cancel-columns" onClick={() => setShowPopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <InnerBlocks />
    </div>
  );
}

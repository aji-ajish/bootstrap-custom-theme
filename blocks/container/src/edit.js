import { __ } from "@wordpress/i18n";
import { useEffect, useRef, useState } from "@wordpress/element";
import {
  InnerBlocks,
  useBlockProps,
  InspectorControls,
  MediaUpload,
} from "@wordpress/block-editor";
import {
  Button,
  SelectControl,
  TextControl,
  PanelBody,
  ColorPalette,
} from "@wordpress/components";

const containerOptions = [
  { label: "None", value: "none" },
  { label: "container", value: "container" },
  { label: "container-sm", value: "container-sm" },
  { label: "container-md", value: "container-md" },
  { label: "container-lg", value: "container-lg" },
  { label: "container-xl", value: "container-xl" },
  { label: "container-xxl", value: "container-xxl" },
  { label: "container-fluid", value: "container-fluid" },
];

export default function Edit({
  attributes,
  setAttributes,
  isSelected,
  clientId,
}) {
  const {
    containerType,
    customClass,
    sectionClass,
    bgColor,
    bgImage,
    bgVideoDesktop,
    bgVideoMobile,
    backgroundType,
    backgroundWrapperClass,
    disclaimerText,
    disclaimerClass,
  } = attributes;

  const [showPopup, setShowPopup] = useState(false);
  const [popupOpenedOnce, setPopupOpenedOnce] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const popupRef = useRef(null);
  const isDragging = useRef(false);
  const popupOffset = useRef({ x: 0, y: 0 });
  const blockProps = useBlockProps({ className: null });

  useEffect(() => {
    const calculateCenterPosition = () => {
      const popupWidth = 400;
      const popupHeight = 300;
      const centerX = (window.innerWidth - popupWidth) / 2;
      const centerY = (window.innerHeight - popupHeight) / 2;
      setPosition({ x: centerX, y: centerY });
    };
    calculateCenterPosition();
    window.addEventListener("resize", calculateCenterPosition);
    return () => window.removeEventListener("resize", calculateCenterPosition);
  }, []);

  useEffect(() => {
    if (isSelected && !popupOpenedOnce) {
      setShowPopup(true);
      setPopupOpenedOnce(true);
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

  const sectionStyle = {
    backgroundColor: backgroundType === "color" ? bgColor : undefined,
    backgroundImage:
      backgroundType === "image" && bgImage ? `url(${bgImage})` : undefined,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    position: backgroundType === "video" ? "relative" : undefined,
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title="Background Settings" initialOpen={true}>
          <SelectControl
            label="Background Type"
            value={backgroundType}
            options={[
              { label: "None", value: "none" },
              { label: "Color", value: "color" },
              { label: "Image", value: "image" },
              { label: "Video", value: "video" },
            ]}
            onChange={(value) => {
              setAttributes({
                backgroundType: value,
                bgColor: "",
                bgImage: "",
                bgVideoDesktop: "",
                bgVideoMobile: "",
                backgroundWrapperClass:
                  value === "video"
                    ? "bg _video"
                    : value === "image"
                    ? "bg _image"
                    : "",
              });
            }}
          />

          {backgroundType === "color" && (
            <div style={{ marginTop: "1rem" }}>
              <p>
                <strong>Background Color</strong>
              </p>
              <ColorPalette
                value={bgColor}
                onChange={(value) => setAttributes({ bgColor: value })}
              />
            </div>
          )}

          {backgroundType === "image" && (
            <div style={{ marginTop: "1rem" }}>
              <p>
                <strong>Background Image</strong>
              </p>
              {bgImage && (
                <img
                  src={bgImage}
                  alt="Background preview"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    marginBottom: "8px",
                  }}
                />
              )}
              <MediaUpload
                onSelect={(media) => setAttributes({ bgImage: media.url })}
                allowedTypes={["image"]}
                render={({ open }) => (
                  <Button onClick={open} variant="secondary">
                    {bgImage ? "Replace Image" : "Upload Image"}
                  </Button>
                )}
              />
              {bgImage && (
                <Button
                  variant="link"
                  isDestructive
                  onClick={() => setAttributes({ bgImage: "" })}
                  style={{ marginTop: "8px" }}
                >
                  Remove Image
                </Button>
              )}
            </div>
          )}

          {backgroundType === "video" && (
            <div style={{ marginTop: "1rem" }}>
              <TextControl
                label="Video URL (Desktop)"
                value={bgVideoDesktop}
                onChange={(value) => setAttributes({ bgVideoDesktop: value })}
              />
              <TextControl
                label="Video URL (Mobile)"
                value={bgVideoMobile}
                onChange={(value) => setAttributes({ bgVideoMobile: value })}
              />
            </div>
          )}

          {["video", "image"].includes(backgroundType) && (
            <>
              <TextControl
                label="Background Wrapper Class"
                value={backgroundWrapperClass}
                onChange={(value) =>
                  setAttributes({ backgroundWrapperClass: value })
                }
              />
              <TextControl
                label="Disclaimer Text"
                value={disclaimerText}
                onChange={(value) => setAttributes({ disclaimerText: value })}
              />
              <TextControl
                label="Disclaimer Class"
                value={disclaimerClass}
                onChange={(value) => setAttributes({ disclaimerClass: value })}
              />
            </>
          )}
        </PanelBody>
      </InspectorControls>

      <div
        {...blockProps}
        style={{ position: "relative" }}
        data-block-id={clientId}
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
              <strong>Configure Container</strong>
            </div>
            <div style={{ padding: "15px" }}>
              <SelectControl
                label="Container Type"
                value={containerType}
                options={containerOptions}
                onChange={(value) => setAttributes({ containerType: value })}
              />

              {containerType !== "none" && (
                <TextControl
                  label="Custom Container Class"
                  value={customClass}
                  onChange={(value) => setAttributes({ customClass: value })}
                />
              )}
              <TextControl
                label="Parent Div Class"
                value={sectionClass}
                onChange={(value) => setAttributes({ sectionClass: value })}
              />
              <div className="popup-actions">
                <Button variant="primary" onClick={() => setShowPopup(false)}>
                  Save
                </Button>
                <Button variant="secondary" onClick={() => setShowPopup(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className={sectionClass} style={sectionStyle}>
          {containerType !== "none" ? (
            <div className={`${containerType} ${customClass}`}>
              <InnerBlocks />
            </div>
          ) : (
            <InnerBlocks />
          )}
        </div>
      </div>
    </>
  );
}

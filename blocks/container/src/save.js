import { InnerBlocks } from "@wordpress/block-editor";

export default function Save({ attributes }) {
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

  const sectionStyle = {
    backgroundColor: backgroundType === "color" ? bgColor : undefined,
    backgroundImage:
      backgroundType === "image" && bgImage ? `url(${bgImage})` : undefined,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    position: backgroundType === "video" ? "relative" : undefined,
  };

  const containerClass = `${containerType} ${customClass}`.trim();

  return (
    <div className={sectionClass} style={sectionStyle}>
      {backgroundType === "video" && (bgVideoDesktop || bgVideoMobile) && (
        <div className={backgroundWrapperClass}>
          {bgVideoDesktop && (
            <video
              preload="auto"
              webkit-playsinline=""
              playsinline=""
              autoPlay
              muted
              loop
              className="d-none d-lg-block"
              aria-label="Video of smiling Sculptra® patients"
              data-gtm-autoplay="true"
              data-gtm-progress="0.75"
            >
              <source src={bgVideoDesktop} type="video/mp4" />
              Video of smiling Sculptra® patients
            </video>
          )}
          {bgVideoMobile && (
            <video
              preload="auto"
              webkit-playsinline=""
              playsinline=""
              autoPlay
              muted
              loop
              className="d-block d-lg-none"
              aria-label="Video of smiling Sculptra® patients"
              data-gtm-autoplay="true"
              data-gtm-progress="0.75"
            >
              <source src={bgVideoMobile} type="video/mp4" />
              Video of smiling Sculptra® patients
            </video>
          )}
          {disclaimerText && (
            <div className={disclaimerClass}>{disclaimerText}</div>
          )}
        </div>
      )}

      {backgroundType === "image" && bgImage && (
        <div className={backgroundWrapperClass}>
          <img src={bgImage} alt="" />
          {disclaimerText && (
            <div className={disclaimerClass}>{disclaimerText}</div>
          )}
        </div>
      )}

      {containerType !== "none" ? (
        <div className={containerClass}>
          <InnerBlocks.Content />
        </div>
      ) : (
        <InnerBlocks.Content />
      )}
    </div>
  );
}

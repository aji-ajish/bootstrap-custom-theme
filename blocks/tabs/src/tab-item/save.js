import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
  const { customId, title, isActive, customClass } = attributes;

  return (
    <>
      <div className="tabs-block__button">
        <button
          className={`nav-link${isActive ? " active" : ""}`}
          id={`${customId}-tab`}
          data-bs-toggle="tab"
          data-bs-target={`#${customId}`}
          type="button"
          role="tab"
          aria-selected={isActive ? "true" : "false"}
          tabIndex={isActive ? undefined : "-1"}
          data-active={isActive ? "true" : "false"}
        >
          {title}
        </button>
      </div>

      <div className="tabs-block__pane">
        <div
          className={`tab-pane fade${isActive ? " show active" : ""} ${
            customClass || ""
          }`.trim()}
          id={customId}
          role="tabpanel"
          aria-labelledby={`${customId}-tab`}
        >
          <InnerBlocks.Content />
        </div>
      </div>
    </>
  );
};

export default Save;

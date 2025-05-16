import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
  const { customId, title } = attributes;

  return (
    <>
      <div className="tabs-block__button">
        <button
          className={`nav-link${attributes.isActive ? ' active' : ''}`}
          id={`${customId}-tab`}
          data-bs-toggle="tab"
          data-bs-target={`#${customId}`}
          type="button"
          role="tab"
          aria-selected={attributes.isActive ? 'true' : 'false'}
    tabIndex={attributes.isActive ? undefined : '-1'}
    data-active={attributes.isActive ? 'true' : 'false'}
        >
          {title}
        </button>
      </div>

      <div className="tabs-block__pane">
        <div
          className={`tab-pane fade${attributes.isActive ? ' show active' : ''}`}
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

import { InnerBlocks } from "@wordpress/block-editor";

export default function Save({ attributes }) {
  const { accordionType, numAccordions, accordionClass } = attributes;

  const accordions = [];
  for (let i = 0; i < numAccordions; i++) {
    accordions.push(
      <div className="accordion-item" key={i}>
        <h2 className="accordion-header" id={`heading${i}`}>
          <button
            className="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#collapse${i}`}
            aria-expanded="true"
            aria-controls={`collapse${i}`}
          >
            Accordion {i + 1}
          </button>
        </h2>
        <div
          id={`collapse${i}`}
          className="accordion-collapse collapse show"
          aria-labelledby={`heading${i}`}
          data-bs-parent="#accordionExample"
        >
          <div className="accordion-body">
            <InnerBlocks.Content />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`accordion ${accordionType} ${accordionClass}`} id="accordionExample">
      {accordions}
    </div>
  );
}

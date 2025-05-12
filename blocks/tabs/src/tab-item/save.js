import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { tabId, tabLabel, isActive } = attributes;

	const headerId = `tab-${tabId}`;
	const paneId = `pane-${tabId}`;

	return (
		<>
			<li className="nav-item" role="presentation">
				<button
					className={`nav-link${isActive ? ' active' : ''}`}
					id={headerId}
					data-bs-toggle="tab"
					data-bs-target={`#${paneId}`}
					type="button"
					role="tab"
					aria-controls={paneId}
					aria-selected={isActive ? 'true' : 'false'}
				>
					<RichText.Content value={tabLabel} />
				</button>
			</li>

			<div
				id={paneId}
				className={`tab-pane fade${isActive ? ' show active' : ''}`}
				role="tabpanel"
				aria-labelledby={headerId}
			>
				<InnerBlocks.Content />
			</div>
		</>
	);
}

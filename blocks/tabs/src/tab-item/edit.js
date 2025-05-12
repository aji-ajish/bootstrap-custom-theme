import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';

export default function Edit({ attributes, setAttributes, clientId }) {
	const { tabId, tabLabel, isActive } = attributes;

	// Generate tabId if missing
	useEffect(() => {
		if (!tabId) {
			const newId = clientId.replace(/[^a-zA-Z0-9_-]/g, '');
			setAttributes({ tabId: newId });
		}
	}, [tabId, clientId, setAttributes]);

	const paneId = `pane-${tabId}`;
	const headerId = `tab-${tabId}`;

	return (
		<div {...useBlockProps()}>
			<RichText
				tagName="div"
				value={tabLabel}
				onChange={(value) => setAttributes({ tabLabel: value })}
				placeholder="Tab Label"
			/>
			<div
				id={paneId}
				className={`tab-pane fade${isActive ? ' show active' : ''}`}
				role="tabpanel"
				aria-labelledby={headerId}
			>
				<InnerBlocks />
			</div>
		</div>
	);
}

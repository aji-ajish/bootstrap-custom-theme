import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	Button,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

export default function Edit({ attributes, setAttributes, clientId }) {
	const { orientation = 'horizontal', tabStyle = 'tabs' } = attributes;

	const ALLOWED_BLOCKS = ['bootstrap-custom-theme/tab-item'];
	const { insertBlock, updateBlockAttributes, removeBlock } = useDispatch('core/block-editor');

	const childBlocks = useSelect((select) =>
		select('core/block-editor').getBlocks(clientId)
	);

	// Auto activate first tab if none active
	useEffect(() => {
		if (!childBlocks.some((b) => b.attributes.isActive)) {
			const first = childBlocks[0];
			if (first) {
				updateBlockAttributes(first.clientId, { isActive: true });
			}
		}
	}, [childBlocks]);

	// Add default tab with content
	const addNewTab = () => {
		const tabIndex = childBlocks.length + 1;
		const newTabId = `${clientId}-${Date.now()}`;

		const newTabBlock = createBlock('bootstrap-custom-theme/tab-item', {
			tabId: newTabId,
			tabLabel: `Tab ${tabIndex}`,
			isActive: false,
		});

		insertBlock(newTabBlock, childBlocks.length, clientId);

		const defaultContent = createBlock('core/paragraph', {
			content: `This is Tab ${tabIndex}`,
		});
		insertBlock(defaultContent, 0, newTabBlock.clientId);
	};

	const removeTab = (clientId) => {
		removeBlock(clientId);
	};

	const navClasses = [
		'nav',
		tabStyle === 'pills' ? 'nav-pills' : 'nav-tabs',
		orientation === 'vertical' ? 'flex-column' : '',
	].join(' ');

	return (
		<div {...useBlockProps()}>
			<InspectorControls>
				<PanelBody title="Tab Settings" initialOpen={true}>
					<VStack spacing={3}>
						<SelectControl
							label="Tab Style"
							value={tabStyle}
							options={[
								{ label: 'Tabs', value: 'tabs' },
								{ label: 'Pills', value: 'pills' },
							]}
							onChange={(value) => setAttributes({ tabStyle: value })}
						/>
						<SelectControl
							label="Orientation"
							value={orientation}
							options={[
								{ label: 'Horizontal', value: 'horizontal' },
								{ label: 'Vertical', value: 'vertical' },
							]}
							onChange={(value) => setAttributes({ orientation: value })}
						/>
						<Button
							variant="primary"
							onClick={addNewTab}
							style={{ marginTop: '10px' }}
						>
							+ Add New Tab
						</Button>
					</VStack>
				</PanelBody>
			</InspectorControls>

			<ul className={navClasses} role="tablist">
				{childBlocks.map((block, index) => {
					const { tabId, tabLabel, isActive } = block.attributes;
					const headerId = `tab-${tabId}`;
					const paneId = `pane-${tabId}`;
					return (
						<li className="nav-item d-flex align-items-center" key={block.clientId}>
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
								{tabLabel || `Tab ${index + 1}`}
							</button>
							<Button
								variant="link"
								onClick={() => removeTab(block.clientId)}
								className="text-danger ms-2"
								aria-label="Remove tab"
							>
								✕
							</Button>
						</li>
					);
				})}
			</ul>

			<div className="tab-content">
				<InnerBlocks
					allowedBlocks={ALLOWED_BLOCKS}
					orientation="vertical"
				/>
			</div>
		</div>
	);
}

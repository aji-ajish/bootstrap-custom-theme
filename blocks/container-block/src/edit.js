import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { InnerBlocks } from '@wordpress/block-editor';
import { Button, Modal, SelectControl, TextControl } from '@wordpress/components';
import Draggable from 'react-draggable';  // Import react-draggable

const containerOptions = [
	{ label: 'Default (container)', value: 'container' },
	{ label: 'Fluid (container-fluid)', value: 'container-fluid' },
	{ label: 'Responsive - container-sm', value: 'container-sm' },
	{ label: 'Responsive - container-md', value: 'container-md' },
	{ label: 'Responsive - container-lg', value: 'container-lg' },
	{ label: 'Responsive - container-xl', value: 'container-xl' },
	{ label: 'Responsive - container-xxl', value: 'container-xxl' },
];

export default function Edit({ attributes, setAttributes }) {
	const { containerType, customClass, sectionClass } = attributes;
	const [isModalOpen, setIsModalOpen] = useState(true); // Set modal open by default
	const [isSettingsChanged, setIsSettingsChanged] = useState(false);

	const containerClass = `${containerType} ${customClass}`.trim();

	// Open the modal when clicking on the gear icon in the block toolbar
	const openModal = () => setIsModalOpen(true);

	// Handle saving and closing the modal
	const saveSettings = () => {
		setIsModalOpen(false);
		setIsSettingsChanged(true);  // Mark settings as saved
	};

	// Handle closing the modal without saving
	const closeModal = () => setIsModalOpen(false);

	// Make sure the modal stays open if settings change
	useEffect(() => {
		if (isSettingsChanged) {
			// Reset settings change state
			setIsSettingsChanged(false);
		}
	}, [isSettingsChanged]);

	return (
		<>
			{/* Gear Icon (shown in the block toolbar) */}
			<Button
				variant="secondary"
				onClick={openModal}
				style={{
					position: 'absolute',
					top: '10px',
					right: '10px',
					zIndex: '999',
				}}
			>
				⚙️
			</Button>

			{/* Draggable Modal */}
			{isModalOpen && (
				<Draggable handle=".modal-header">
					<Modal
						title={__('Container Settings')}
						onRequestClose={closeModal}
						className="custom-modal"
					>
						<div className="modal-header" style={{ cursor: 'move' }}>
							<h3>{__('Customize Block Settings')}</h3>
						</div>
						<SelectControl
							label={__('Container Type')}
							value={containerType}
							options={containerOptions}
							onChange={(value) => setAttributes({ containerType: value })}
						/>
						<TextControl
							label={__('Custom Container Class')}
							value={customClass}
							onChange={(value) => setAttributes({ customClass: value })}
						/>
						<TextControl
							label={__('Section Wrapper Class')}
							value={sectionClass}
							onChange={(value) => setAttributes({ sectionClass: value })}
						/>

						{/* Save and Close buttons */}
						<Button
							variant="primary"
							onClick={saveSettings}
							style={{ marginTop: '20px' }}
						>
							Save Settings
						</Button>
						<Button
							variant="secondary"
							onClick={closeModal}
							style={{ marginTop: '20px', marginLeft: '10px' }}
						>
							Close
						</Button>
					</Modal>
				</Draggable>
			)}

			{/* The block's content */}
			<section className={sectionClass}>
				<div className={containerClass}>
					<InnerBlocks />
				</div>
			</section>
		</>
	);
}

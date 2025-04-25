import { InnerBlocks } from '@wordpress/block-editor';

export default function Save({ attributes }) {
	const { containerType, customClass, sectionClass } = attributes;
	const containerClass = `${containerType} ${customClass}`.trim();

	return (
		<section className={sectionClass}>
			<div className={containerClass}>
				<InnerBlocks.Content />
			</div>
		</section>
	);
}

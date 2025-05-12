import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save({ attributes }) {
	const { orientation, tabStyle } = attributes;

	const navClass = [
		'nav',
		tabStyle === 'pills' ? 'nav-pills' : 'nav-tabs',
		orientation === 'vertical' ? 'flex-column' : '',
	]
		.filter(Boolean)
		.join(' ');

	return (
		<div {...useBlockProps.save()}>
			<ul className={navClass} role="tablist">
				<InnerBlocks.Content />
			</ul>

			<div className="tab-content">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}

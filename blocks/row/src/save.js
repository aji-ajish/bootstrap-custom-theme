import { InnerBlocks } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const { rowClass, alignment } = attributes;

    return (
        <div className={`row ${alignment} ${rowClass}`}>
            <InnerBlocks.Content />
        </div>
    );
}

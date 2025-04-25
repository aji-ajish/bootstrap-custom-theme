import { registerBlockType } from '@wordpress/blocks';
import { RichText } from '@wordpress/block-editor';
import './style.css';

registerBlockType( 'bootstrap-custom-theme/simple-block', {
	edit( { attributes, setAttributes } ) {
		const onChangeContent = ( content ) => setAttributes( { content } );

		return (
			<RichText
				tagName="p"
				className="simple-block-content"
				value={ attributes.content }
				onChange={ onChangeContent }
				placeholder="Write something..."
			/>
		);
	},

	save( { attributes } ) {
		return <p className="simple-block-content">{ attributes.content }</p>;
	},
} );

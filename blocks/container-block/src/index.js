import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import './style.css';

registerBlockType('bootstrap-custom-theme/container-block', {
	edit: Edit,
	save: Save,
});

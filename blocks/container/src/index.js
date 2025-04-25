import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import './style.css';

registerBlockType('bootstrap-custom-theme/container', {
	edit: Edit,
	save: Save,
});

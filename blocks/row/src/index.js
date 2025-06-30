import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import './style.css';

registerBlockType('bootstrap-custom-theme/row', {
    edit: Edit,
    save: Save,
});

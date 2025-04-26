import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import './style.css';

registerBlockType('bootstrap-custom-theme/column', {
    edit,
    save,
});

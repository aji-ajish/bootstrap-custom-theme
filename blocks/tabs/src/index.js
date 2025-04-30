import { registerBlockType } from '@wordpress/blocks';
import './style.css';
import Edit from './edit';
import Save from './save';

registerBlockType('bootstrap-custom-theme/tabs', {
  edit: Edit,
  save: Save
});

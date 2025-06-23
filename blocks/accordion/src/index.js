import { registerBlockType } from '@wordpress/blocks';
import metadata from '../block.json';
import Edit from './edit';
import Save from './save';
import './accordion-item'; // Ensure item block is registered first

registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save: Save,
});
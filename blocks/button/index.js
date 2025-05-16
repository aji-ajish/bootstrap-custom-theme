import Edit from './edit';
import Save from './save';
import metadata from './block.json';
import { registerBlockType } from '@wordpress/blocks';

registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save: Save,
});

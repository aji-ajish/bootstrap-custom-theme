import './tab-item'; // make sure this is NOT skipped
import './style.css';
import Edit from './edit';
import Save from './save';
import metadata from '../block.json';

import { registerBlockType } from '@wordpress/blocks';

registerBlockType(metadata.name, {
  ...metadata,
  edit: Edit,
  save: Save,
});

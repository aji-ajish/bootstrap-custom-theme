import './style.scss'; // or css
import CardEdit from './edit';
import CardSave from './save';
import metadata from './block.json';

import { registerBlockType } from '@wordpress/blocks';

registerBlockType(metadata.name, {
  ...metadata,
  edit: CardEdit,
  save: CardSave,
});

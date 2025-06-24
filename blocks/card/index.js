import { registerBlockType } from "@wordpress/blocks";
import Edit from "./edit";
import save from "./save";
import "./style.css";

registerBlockType("bootstrap-custom-theme/card", {
  edit: Edit,
  save,
});

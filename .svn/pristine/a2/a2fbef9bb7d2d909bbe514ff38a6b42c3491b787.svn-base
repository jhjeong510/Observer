import React from 'react';

export default function ColorPicker(props) {
	const canvas = props.canvas;
	const color = props.color;
	const figure = ['rect', 'triangle', 'circle'];

	function selectColor(e) {
		const selectedColor = e.target.value;
		color.current = selectedColor;

		var objects = canvas.getActiveObjects();
		objects.forEach((object) => {
			if (object.type === 'text' || figure.includes(object.type)) {
				object.set({ fill: `${selectedColor}` });
			}
			if (object) {
				if (object.type === 'line' || object.type === 'path') {
					object.set({ stroke: `${selectedColor}` });
				}
			}
			// common.modifyLayer(object)
		})

		if (canvas.isDrawingMode) {
			canvas.freeDrawingBrush.color = color.current;
		}
		canvas.renderAll();

	}


	return (
		<input id="color" type="color" defaultValue="#ffffff" onChange={e => selectColor(e)} />
	);
}
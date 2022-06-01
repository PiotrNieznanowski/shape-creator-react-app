import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactAce from 'react-ace';
import debounce from 'lodash/debounce';

import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-github';

class InputJson extends Component {
	static propTypes = {
		defaultValue: PropTypes.string,
		value: PropTypes.string,
		width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		onChange: PropTypes.func,
		onValidate: PropTypes.func,
		disabled: PropTypes.bool,
	};

	static defaultProps = {
		width: '100%',
		height: '200px',
		disabled: false,
	};

	state = {
		text: this.props.text || '',
	};


	onChange = (value, e) => {
		this.props.setSVGtext(value)
		this.setState({
			text: value,
		});


	};


	render() {
		const { defaultValue, width, height, disabled } = this.props;
		const { text } = this.state;
		return (
			<ReactAce
				ref={c => {
					this.aceRef = c;
				}}
				mode="html"
				theme="github"
				width={width}
				height={height}
				defaultValue={defaultValue || text}
				value={text}
				editorProps={{
					$blockScrolling: true,
				}}
				onChange={this.onChange}

				readOnly={disabled}
			/>
		);
	}
}

export default InputJson;

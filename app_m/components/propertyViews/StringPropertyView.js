/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import React, {PropTypes}  from 'react';
import classnames          from 'classnames';
import PropertyView        from './PropertyView';

class StringPropertyView extends PropertyView {
  constructor(){
    super(...arguments);
    this.state={value:this.props.propertyDescription.string};
  }

  componentWillReceiveProps(nextProps) {
    this.state={value:nextProps.propertyDescription.string};
  }


  render() {
    let back  = (this.props.onBack)   ? this.getBack()   : null;
    let value = (this.props.focused)  ? this.getEditor() : this.getValue();
    let title = (! this.props.noTitle)? this.getTitle()  : null;
    let className= classnames("kugm-stringpropertyview","propertyview",this.props.className);

    return (<div className={className} onClick={this.props.onStartEdit}>
             {title}
             {value}
             {back}
            </div>);
  }

  getTitle() {
    return (<div className="kugm-stringpropertyview-title" onClick={this.props.onStartEdit}>
              {this.props.propertyDescription.title}
            </div>);
  }

  componentDidUpdate() {
    if (this.props.focused && this.refs.input)
      this.refs.input.focus();
  }

  getValue() {
    let className= classnames("kugm-stringpropertyview-value",
                             {"kugm-stringpropertyview-value__multiline": this.props.multiline});

    return (
        <div className={className}>
          <pre className="kugm-stringpropertyview-value-content">
            {this.state.value}
          </pre>
        </div>);
  }

  getEditor() {
    return (this.props.propertyDescription.multiline) ? this.getMultilineEditor() : this.getSingleLineEditor();
  }

  getSingleLineEditor() {
    return (
      <input ref="input" type="text" value={this.props.propertyDescription.string}
             onChange={this.onChange}
             onKeyPress={this.onEditorKeyPress}
             onClick={e=>e.stopPropagation()}/>);
  }

  getMultilineEditor() {
    return (
      <div>
        <div className="kugm-stringpropertyview-multilineeditor-buttons">
        Aus: Shift-Enter
        </div>
        <textarea ref="input" type="text" value={this.props.propertyDescription.string}
                  rows="30" cols="100"
                  onChange={this.onChange}
                  onKeyPress={this.onMultilineEditorKeyPress}
                  onClick={e=>e.stopPropagation()}/>
      </div>);
  }

  onChange = (e) => {
    e.stopPropagation();
    this.setState({value:e.target.value})
    this.props.onMergePropertyChange({string:e.target.value});
  }

  onEditorKeyPress = (e) => {
    if (e.key==="Enter")
      this.props.onFinishEdit();
  }

  onMultilineEditorKeyPress = (e) => {
    if ((e.key==="Enter") && e.shiftKey)
      this.props.onFinishEdit();
  }
}
StringPropertyView.propTypes = {
  propertyDescription:   PropTypes.object.isRequired,
  onBack:                PropTypes.func,
  onMergePropertyChange: PropTypes.func.isRequired,
  onStartEdit:           PropTypes.func.isRequired,
  onFinishEdit:          PropTypes.func.isRequired,
  focused:               PropTypes.bool.isRequired,
  noTitle:               PropTypes.bool
}

export default StringPropertyView;

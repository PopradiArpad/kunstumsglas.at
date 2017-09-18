/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import React, {PropTypes}  from 'react';
import classnames          from 'classnames';
import merge               from 'lodash.merge';
import PropertyView        from './PropertyView';

class LocalizedStringsPropertyView extends PropertyView {
  constructor(){
    super(...arguments);

    this.state=this.resetState(this.props,null);
  }

  resetState(props,focusedIx) {
    const localizedStrings = props.propertyDescription.localizedStrings;

    return {
            locales:  localizedStrings.map(ls=>ls.locale),
            strings:  localizedStrings.map(ls=>ls.string),
            focusedIx
           };
  }

  componentWillReceiveProps(nextProps) {
    const toFocused = ((!this.props.focused) || this.state.focusedIx===null) && (nextProps.focused);
    const focusedIx = toFocused ? 0 : this.state.focusedIx;

    this.setState(this.resetState(nextProps,focusedIx));
  }

  render() {
    let back        = (this.props.onBack)   ? this.getBack()   : null;
    let title       = this.getTitle();
    let stringViews = this.getStringViews();
    let className   = classnames("kugm-localizedstringspropertyview","propertyview");

    return (<div className={className} onClick={this.setFocusOnFirstItem}>
             {title}
             {stringViews}
             {back}
            </div>);
  }

  componentDidUpdate() {
    if (  this.props.focused
       && (this.state.focusedIx!==null)
       && this.refs[`input-${this.state.focusedIx}`])
      this.refs[`input-${this.state.focusedIx}`].focus();
  }


  getTitle() {
    return (<div className="kugm-localizedstringspropertyview-title" onClick={this.props.onStartEdit}>
              {this.props.propertyDescription.title}
            </div>);
  }

  getStringViews() {
    return this.state.locales.map((locale,ix)=>{
      const focused = (this.props.focused) && (this.state.focusedIx==ix);

      return this.getStringView(locale,this.state.strings[ix],focused,ix);
    });
  }

  getStringView(locale,string,focused,ix) {
    const view = focused
           ? this.getEditor(string,ix)
           : this.getView(string);

    return (
      <div className="kugm-localizedstringspropertyview-item" key={ix} onClick={e=>this.setFocusOnNthItem(e,ix)}>
        <span>{locale}</span>
        <span>{view}</span>
      </div>);
  }

  getEditor(string,ix) {
    return (this.props.propertyDescription.multiline)
           ? this.getMultilineEditor(string,ix)
           : this.getSingleLineEditor(string,ix);
  }

  getSingleLineEditor(string,ix) {
    return (
      <input ref={`input-${ix}`} type="text" value={string}
             onChange={this.onChange}
             onKeyPress={this.onEditorKeyPress}
             onClick={e=>e.stopPropagation()}/>);
  }

  getMultilineEditor(string,ix) {
    return (
      <div>
        <div className="kugm-stringpropertyview-multilineeditor-buttons">
        Aus: Shift-Enter
        </div>
        <textarea ref={`input-${ix}`} type="text" value={string}
                  rows="30" cols="100"
                  onChange={this.onChange}
                  onKeyPress={this.onMultilineEditorKeyPress}
                  onClick={e=>e.stopPropagation()}/>
      </div>);
  }

  getView(string) {
    return (
          <pre>
            {string}
          </pre>);
  }

  setFocusOnNthItem = (e,ix) => {
    this.setState({focusedIx:ix});

    if (! this.props.focused)
      this.props.onStartEdit(e);
  }

  onChange = (e) => {
    e.stopPropagation();

    const state     = this.state;
    const focusedIx = state.focusedIx;
    const locale    = state.locales[focusedIx];
    const string    = e.target.value;

    this.setState({strings:merge(state.strings,{[focusedIx]: string})});
    this.props.onMergePropertyChange({localizedStrings:{[focusedIx]:{locale,string}}});
  }

  onEditorKeyPress = (e) => {
    if (e.key!=="Enter")
      return;

    this.setFocusOnNextLocalesOrFinish(e);
  }

  onMultilineEditorKeyPress = (e) => {
    if (! ((e.key==="Enter") && e.shiftKey))
      return;

    this.setFocusOnNextLocalesOrFinish(e);
  }

  setFocusOnNextLocalesOrFinish(e) {
    let nextFocusedIx = this.state.focusedIx + 1;
    if (this.state.locales[nextFocusedIx])
      this.setFocusOnNthItem(e,nextFocusedIx);
    else {
      this.setState({focusedIx:null});
      this.props.onFinishEdit();
    }
  }
}
LocalizedStringsPropertyView.propTypes = {
  propertyDescription:   PropTypes.object.isRequired,
  onBack:                PropTypes.func,
  onMergePropertyChange: PropTypes.func.isRequired,
  onStartEdit:           PropTypes.func.isRequired,
  onFinishEdit:          PropTypes.func.isRequired,
  focused:               PropTypes.bool.isRequired,
}

export default LocalizedStringsPropertyView;

/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import React, {Component, PropTypes}  from 'react';
import classnames          from 'classnames';
import StringPropertyView  from '../propertyViews/StringPropertyView';

class TranslatedStringView extends Component {
  constructor(){
    super(...arguments);

    this.state = {focusedStringPropertyIx: null}
  }

  render() {
    let messageIdField = this.getMessageIdField();
    let translations   = this.getTranslations();
    let className      = classnames("kugm-translatedmessageview",
                                    `translations-count-${this.props.localizedStringIds.length}`,
                                    {markedToRemove: this.props.markedToRemove});

    return (<div className={className}>
              {messageIdField}
              {translations}
            </div>);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.focused && (this.state.focusedStringPropertyIx===null))
      this.setState({focusedStringPropertyIx:0});
  }

  getMessageIdField() {
    let allBack = (this.props.onAllBack) ? this.getAllBack()      : null;
    let remove  = (this.props.onRemove)  ? this.getRemoveButton() : null;

    return (<div className="kugm-translatedmessageview-messageidfield">
              {allBack}
              {remove}
              {this.props.messageId}
            </div>);
  }

  getAllBack() {
    return (
      <div className="kugm-propertyview-button-back" onClick={this.setAllTranslationsBack}>
        &#8592;
      </div>);
  }

  getRemoveButton() {
    return (
      <div className="kugm-translatedmessageview-buttons-remove" onClick={this.remove}>
        &#9747;
      </div>);
  }

  getTranslations() {
    const localizedStrings    = this.props.localizedStrings;

    return this.props.localizedStringIds.map((localizedStringId,i)=>{
      const changedTranslations = this.props.changedTranslations;
      const translationChanged  = changedTranslations && changedTranslations[i];
      let className             = classnames({"odd":i%2},{"even":!i%2});

      let props = {
        className,
        key:i,
        propertyDescription:   this.getPropertyDescription(localizedStringId,localizedStrings[i]),
        onBack:                translationChanged ? ()=>this.setTranslationBack(localizedStringId) : null,
        onMergePropertyChange: ({string})=>this.props.onTranslationChange(localizedStringId,string),
        onStartEdit:           this.setFocusedStringPropertyIx.bind(this,i),
        onFinishEdit:          this.nextFocusedStringPropertyIx,
        focused:               this.props.focused && this.state.focusedStringPropertyIx===i,
        noTitle:               true
      };

      return <StringPropertyView {...props} />;
    })
  }

  getPropertyDescription(localizedStringId, localizedString) {
    return {
            string:   localizedString,
            multiline:!! this.props.messageId.match(/\_html$/)
          };
  }

  setAllTranslationsBack = (e) => {
    e.stopPropagation();
    this.props.onAllBack(this.props.messageId);
  }

  setTranslationBack(localizedStringId) {
    this.props.onBack(localizedStringId);
  }

  setFocusedStringPropertyIx(i) {
    this.setState({focusedStringPropertyIx:i});
    this.props.onStartEdit(this.props.messageId);
  }

  nextFocusedStringPropertyIx = () => {
    let nextIx = this.state.focusedStringPropertyIx+1;

    if (this.props.localizedStringIds[nextIx])
      this.setState({focusedStringPropertyIx:nextIx});
    else {
      this.setState({focusedStringPropertyIx:null});
      this.props.onFinishEdit();
    }
  }

  remove = (e) => {
    e.stopPropagation();
    this.props.onRemove(this.props.messageId);
  }
}
TranslatedStringView.propTypes = {
  messageId:             PropTypes.string.isRequired,
  localizedStringIds:    PropTypes.array.isRequired,
  localizedStrings:      PropTypes.array.isRequired,
  changedTranslations:   PropTypes.object,
  onBack:                PropTypes.func,
  onAllBack:             PropTypes.func,
  onTranslationChange:   PropTypes.func.isRequired,
  onStartEdit:           PropTypes.func.isRequired,
  onFinishEdit:          PropTypes.func.isRequired,
  onRemove:              PropTypes.func,
  focused:               PropTypes.bool.isRequired,
  markedToRemove:        PropTypes.bool
}

export default TranslatedStringView;

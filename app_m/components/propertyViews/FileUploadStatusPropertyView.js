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

class FileUploadStatusPropertyView extends PropertyView {
    constructor(){
      super(...arguments);
    }

    render() {
      let back  = (this.props.onBack)   ? this.getBack()   : null;
      let inputFile= this.getInputFile();
      let download = (this.props.propertyDescription.uploadStatus==='UPLOADED') ? this.getDownload(): null;
      let className= classnames("kugm-fileuploadstatuspropertyview","propertyview");

      return (
        <div className={className}>
          <div className="kugm-fileuploadstatuspropertyview-title">
              {this.props.propertyDescription.title}
          </div>
          <div className='kugm-fileuploadstatuspropertyview-container'>
            {back}
            {inputFile}
            {download}
          </div>
        </div>);
    }

  getInputFile() {
    let accept = `.${this.props.propertyDescription.fileExtension}`;
    return (
          <input ref={'input'} type='file' accept={accept} onChange={this.onFileSelected}/>
        );
  }

  getDownload() {
    let url      = `/item/${this.props.identity.id}/${this.props.propertyDescription.property}?dbModel=${this.props.identity.dbModel}`;
    let filename = `${this.props.baseFileName}.${this.props.propertyDescription.fileExtension}`;
    return (
      <a href={url} download={filename}>Herunterladen</a>
    );
  }

  //overrride PropertyView back behaviour
  getBack() {
    return (
      <div className="kugm-propertyview-button-back" onClick={this.onBack}>
        &#8592;
      </div>);
  }

  onBack = (e) => {
    this.refs.input.value='';
    this.props.onBack(e);
  }

  onFileSelected = (e) => {
    e.stopPropagation();
    let file = e.target.files[0];
    var reader=new FileReader();
    reader.addEventListener("load",() => {
      this.props.onMergePropertyChange({uploadStatus:reader.result});
      }, false);
    reader.readAsDataURL(file);
  }
}
FileUploadStatusPropertyView.propTypes = {
   propertyDescription:    PropTypes.object.isRequired,
   onBack:                 PropTypes.func,
   onMergePropertyChange:  PropTypes.func.isRequired,
   identity:               PropTypes.object.isRequired,
   baseFileName:           PropTypes.string.isRequired
}

export default FileUploadStatusPropertyView;

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

class DataURLPropertyView extends PropertyView {
  constructor(){
    super(...arguments);
  }

  render() {
    let back  = (this.props.onBack)   ? this.getBack()   : null;
    let className= classnames("kugm-dataurlpropertyview","propertyview");

    return (
      <div className={className}
         onDragOver={e=>e.preventDefault()}
         onDrop={this.onDrop.bind(this)}
         onDragEnd={this.onDragEnd.bind(this)}>
        {this.getImg()}
        {back}
      </div>
    );
  }

  getImg() {
    return <img src={this.props.propertyDescription.dataurl} alt="Ziehe ein Bild rein" />;
  }

  onDrop(e) {
    e.preventDefault();
    var dt = e.dataTransfer;
    if (dt.files.length)
      this.previewFile(dt.files[0]);
  }

  onDragEnd(e) {
    e.preventDefault();
    e.dataTransfer.clearData();
  }

  previewFile(file) {
    var reader=new FileReader();

    reader.addEventListener("load",() => {
      this.props.onMergePropertyChange({dataurl:reader.result});
      }, false);
    reader.readAsDataURL(file);
  }
  // onDrop(e) {
  //   console.log("onDrop");
  //   e.preventDefault();
  //
  //   var dt = e.dataTransfer;
  //   if (dt.items) {
  //     // Use DataTransferItemList interface to access the file(s)
  //     for (var i=0; i < dt.items.length; i++) {
  //       if (dt.items[i].kind == "file") {
  //         var f = dt.items[i].getAsFile();
  //         console.log("... file[" + i + "].name = " + f.name);
  //       }
  //     }
  //   } else {
  //     // Use DataTransfer interface to access the file(s)
  //     for (var j=0; i < dt.files.length; j++) {
  //       console.log("... file[" + j + "].name = " + dt.files[j].name);
  //     }
  //   }
  // }
  //
  // onDragEnd(e) {
  //   console.log("onDragEnd");
  //   e.preventDefault();
  //   // Remove all of the drag data
  //   var dt = e.dataTransfer;
  //   if (dt.items) {
  //     // Use DataTransferItemList interface to remove the drag data
  //     for (var i = 0; i < dt.items.length; i++) {
  //       dt.items.remove(i);
  //     }
  //   } else {
  //     // Use DataTransfer interface to remove the drag data
  //     e.dataTransfer.clearData();
  //   }
  // }
}
DataURLPropertyView.propTypes = {
   propertyDescription:    PropTypes.object.isRequired,
   onBack:                 PropTypes.func,
   onMergePropertyChange:  PropTypes.func.isRequired
}

export default DataURLPropertyView;

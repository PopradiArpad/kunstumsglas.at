/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React, {PropTypes }    from 'react';
import {intlShape,injectIntl} from 'react-intl';

const HtmlText = ({messageDescriptor,intl}) => {
  let message = intl.formatMessage({id: messageDescriptor.id});
  const html = {__html:message};

  return (
    <div className="kug-htmltext" dangerouslySetInnerHTML={html}/>
  )
}
HtmlText.propTypes = {
  messageDescriptor: PropTypes.object.isRequired,
  intl:              intlShape.isRequired,
};

export default injectIntl(HtmlText);

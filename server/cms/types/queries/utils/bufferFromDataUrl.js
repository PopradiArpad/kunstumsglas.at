/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
const bufferFromDataUrl = (data) => {
  return Buffer.from(data.split(",")[1], 'base64');//in this base64 the character range is [A–Z, a–z, 0–9,+,/] so no comma
}

export default bufferFromDataUrl;

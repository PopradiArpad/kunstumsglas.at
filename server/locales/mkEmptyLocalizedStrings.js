/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import cacheOut from '../cache/cacheOut';

const mkEmptyLocalizedStrings = () => {
  const locales = cacheOut().locales;

  return locales.map(locale=>({locale,string:''}));
}

export default mkEmptyLocalizedStrings;

/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import ProductGroupOverview from './ProductGroupOverview';
import UserOverview         from './UserOverview';
import GalleryItemOverview  from './GalleryItemOverview';
import ProductOverview      from './ProductOverview';
import TranslationOverview  from './TranslationOverview';


const getOverviewConstructor = (dbModelName) =>{
  switch (dbModelName) {
    case 'ProductGroup':
      return ProductGroupOverview;
    case 'User':
      return UserOverview;
    case 'GalleryItem':
      return GalleryItemOverview;
    case 'GelasertesProduct':
    case 'GlasfusingProduct':
    case 'WaldglasGraviertesProduct':
      return ProductOverview;
    case 'Translation':
      return TranslationOverview;
    default:
      throw new Error(`No overview component for ${dbModelName}`);
  }
}

export default getOverviewConstructor;

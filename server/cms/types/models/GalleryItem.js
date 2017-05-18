/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
// import _                        from 'lodash';
import mongoose                    from 'mongoose';
import galleryItem                 from '../schemas/galleryItem';

let GalleryItem = mongoose.model('GalleryItem', galleryItem);

export default GalleryItem;

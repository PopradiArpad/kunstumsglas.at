/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import mongoose           from 'mongoose';
import {product,
        gelasertes,
        glasfusing,
        waldglasGraviertes} from '../schemas/product';


const Product = mongoose.model('Product', product);
Product.discriminator('GelasertesProduct', gelasertes);
Product.discriminator('GlasfusingProduct', glasfusing);
Product.discriminator('WaldglasGraviertesProduct', waldglasGraviertes);

export default Product;

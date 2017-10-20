/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/


import mongoose   from 'mongoose';
let Types = mongoose.Schema.Types;
import {LocalizedString}   from '../schemaTypes/TranslatedString';

//The specific path options,that are not from Mongoose or Mongo:
// "title",
// "modelToCreate" contains the property name that contains the model name of the items to create in the id array
let productGroup = mongoose.Schema({
        name:     {type:String,
                   //validation
                   required: true,
                   //indexing
                   index:1, unique : true,
                   //app specific path opt
                   title: 'Name'
                  },
        localizedName:        {type: [LocalizedString], default: [], title: 'localizierter Name'},
        //TODO make a ref to a user (a new property view is needed)
        artistName:           {type:String, default: '', title: 'Künstler'},
        online:               {type:Boolean, default: false, title: 'Online'},
        gallery:              {type: [{type: Types.ObjectId, ref: 'GalleryItem'}], title: 'Galerie'},
        products:             {type: [{type: Types.ObjectId, refPath: 'productModelToCreate'}], title: 'Produkte'},
        productModelToCreate: String,
        introduction_html:    {type: [LocalizedString], default: [], title: 'Über diese Produkte in html', multiline: true},
        //dependent value
        listedProducts:       {type: [{type: Types.ObjectId}], default: []}
});

productGroup.pre('save', function(next) {
  try {
    this.ensureListedProductsOrderIsTheSameAsOfProducts();
    next();
  } catch (e) {
    next(e);
  }
});

productGroup.methods.ensureListedProductsOrderIsTheSameAsOfProducts = function() {
  const listedProductSet  = this.listedProducts.reduce((a,lp)=>{a[lp.valueOf()]=true;return a;},{});
  let   newListedProducts = [];

  this.products.forEach(p=>{
    const objectId      = (p.constructor.name==='ObjectID') ? p : p._id;
    const objectIdValue = objectId.valueOf();

    if (listedProductSet[objectIdValue])
      newListedProducts.push(objectId);
  })

  this.listedProducts = newListedProducts;
}

productGroup.statics.refreshListedProductsAfterProductChangeOrRemove = function(product,productRemoved) {
  const productId = product._id;
  let listedProducts;

  return   productRemoved
         ? this.findOneAndUpdate({listedProducts: {$elemMatch: {$eq:productId}}},
                                 {$pull: {listedProducts: productId}}
                                ).exec()
           //It would be simpler with direct finds and so but let's use the aggregate syntax a little!
         : this.aggregate([
               {$match:{products:productId}},
               {$project:{products:1}},
               {$unwind:'$products'},
               {$lookup:{from:'products',localField:'products',foreignField:'_id',as:'theProducts'}},
               {$unwind:'$theProducts'},
               {$group: {_id: '$_id',
                         listedProducts:{$push:
                                               { $cond:
                                                        [
                                                         {$eq:["$theProducts.listed",true]},
                                                         "$theProducts._id",
                                                          null
                                                        ]
                                                }
                                        }
                        }}
           ])//.addCursorFlag('noCursorTimeout', true).exec() this cursor flag seems not to be supported anymore
            .then(datas=>{
              const data = datas[0];

              if (! data)
                return null;

              listedProducts = data.listedProducts.filter(e=>e!==null);
              return this.findById(data._id);
             })
            .then(productGroup=>{
                if (!productGroup)
                  return;

                productGroup.listedProducts = listedProducts;
                return productGroup.save();
            })
        //  : this.findOne({products: {$elemMatch: {$eq:productId}}})
        //    .then(productGroup=>{
        //      if (! productGroup)
        //        return;
        //
        //      mongoose.model('Product').find({$and: [
        //                                             {_id: {$in: productGroup.products}},
        //                                             {listed: {$eq: true}}
        //                                            ]
        //                                    })
        //                               .then(products=>{
        //                                 const productsSet = products.reduce((a,p)=>{a[p._id]=true;return a;},{});
        //                                 productGroup.listedProducts = productGroup.products.filter(pid=>productsSet[pid.valueOf()]);
        //                                 return productGroup.save();
        //                               })
        //    })
}


export default productGroup;

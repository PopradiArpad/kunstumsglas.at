/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import cacheOut       from '../cache/cacheOut'
import ProductGroup   from '../cms/types/models/ProductGroup'
import User           from '../cms/types/models/User'
import mkProductDescriptionForCustomer   from '../cms/types/queries/utils/mkProductDescriptionForCustomer'
import {getString}    from '../cms/types/schemaTypes/TranslatedString';

const initWebsite = (app) => {
  app.use('/locale',(req,res)=>{
    res.send(cacheOut().websiteLocalizedData[req.query.locale]);
  });

  app.use('/getProductGroup',(req,res)=>{
    ProductGroup.findById(req.query.id)
    .then(productGroup=>{
      if (! productGroup)
        return res.sendStatus(404);

        const locale = req.query.locale;

        res.send({
          id:               productGroup._id,
          locale:           locale,
          name:             productGroup.name,
          localizedName:    getString(productGroup.localizedName,locale),
          productIds:       productGroup.listedProducts,
          artistName:       productGroup.artistName,
          introduction_html:getString(productGroup.introduction_html,locale)
        });
    })
    .catch(()=>res.sendStatus(404));
  });

  app.use('/getProduct',(req,res)=>{
    mkProductDescriptionForCustomer(req.query.id,req.query.locale)
    .then(productDescription=>res.send(productDescription))
    .catch(()=>res.sendStatus(404));
  });

  app.use('/getArtist',(req,res)=>{
    User.findOne({name:req.query.name},{name:1,contact_html:1})
    .then(user=>{
      if (! user)
        res.sendStatus(404);
      else
        res.send({
          id:          user._id,
          name:        user.name,
          contact_html:getString(user.contact_html,req.query.locale)
        });
    })
    .catch(()=>res.sendStatus(404));
  });
}

export default initWebsite;

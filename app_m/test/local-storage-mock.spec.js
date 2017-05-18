/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
/*global expect*/
import LocalStorageMock from './local-storage-mock';

describe('LocalStorageMock', ()=>{

  it('set works like on an object', ()=>{
    var ls = new LocalStorageMock();
    ls.csrfid = "Value";
    expect(ls.csrfid).toBe('Value');
    });

  it('setItem', ()=>{
    var ls = new LocalStorageMock();
    ls.setItem('csrfid',"Value");
    expect(ls.csrfid).toBe('Value');
    });
})

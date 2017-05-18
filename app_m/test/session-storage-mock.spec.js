/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
/*global expect*/
import SessionStorageMock from './session-storage-mock';

describe('SessionStorageMock', ()=> {

 it('setItem', ()=>{
   let ss = new SessionStorageMock();
   expect(ss.length).toBe(0);

   ss.setItem("i1","11");
   expect(ss.length).toBe(1);
   expect(ss.getItem("i1")).toBe("11");

   ss.setItem("i2","12");
   expect(ss.length).toBe(2);
   expect(ss.getItem("i1")).toBe("11");
   expect(ss.getItem("i2")).toBe("12");
 })

 it('removeItem', ()=>{
   let ss = new SessionStorageMock();
   expect(ss.length).toBe(0);

   ss.setItem("i1","11");
   ss.removeItem("i1");
   expect(ss.length).toBe(0);
   expect(ss.getItem("i1")).toBe(undefined);


   ss.setItem("i2","12");
   expect(ss.length).toBe(1);
   expect(ss.getItem("i2")).toBe("12");
 })

 it('key is not implemented', ()=>{
   let ss = new SessionStorageMock();
   expect(()=>ss.key("i2")).toThrow();
 })

 it('clear is not implemented', ()=>{
   let ss = new SessionStorageMock();
   expect(()=>ss.clear()).toThrow();
 })
})

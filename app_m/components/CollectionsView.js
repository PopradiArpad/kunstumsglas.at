/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

import React, {Component, PropTypes}  from 'react';
 // CSSPlugin must be load for Draggable
import {TweenLite, TimelineMax, CSSPlugin}  from 'gsap'; //eslint-disable-line
import Draggable  from '../../node_modules/gsap/src/uncompressed/utils/Draggable'
import classnames from 'classnames';


let itemLength       = 200;
let gutter           = 20;
let itemGutterLength = itemLength + gutter;

class CollectionsView extends Component {
    constructor(){
      super(...arguments);
      //The state of the dragging is not react state!!
      //Because the dragging state is used by the gsap loop unsynchronized with react.
      //To spare the synchronisation this state kept isolated from react..
      this.draggableState = {order:                             this.props.ids,
                             draggedItem:                       {
                                                                  id: null,
                                                                  ix:        null
                                                                },
                              changedInterval:                  [],
                              aPlacingIsRunning:                false,
                              renderWasRequestedDuringDragging: false
                             };
      this.itemDOMNodes = {};
      this.state = {
        menu: null,
        //structure: {menu: {x,y, id? }} x,y, are the menu position , id only for item menu
        open: false
      };
      this.placeAllProductsTimerID = null;
    }

    shouldComponentUpdate() {
      //Do not disturb gsap with react during dragging
      if (this.isDragging()) {
        this.setDraggableState({renderWasRequestedDuringDragging:true});
        return false;
      }

      return true;
    }

    componentWillUpdate(nextProps) {
      this.draggableState.order = nextProps.ids;
    }

    storeRef = (id,c) => {
      if (! c)
        return;

      let domNode=c.getDOMNode();

      this.itemDOMNodes[id]=domNode;
      domNode.setAttribute('data-item-id',id);
    }

    itemClicked = (e,id) => {
      this.clicked(e,id);
    }

    backgroundClicked = (e) => {
      this.clicked(e);
    }

    clicked = (e,id) => {
      e.stopPropagation();

      if (this.state.menu)
        return this.setState({menu:null});

      var r = this.refs.me.getBoundingClientRect();
      var scrollTop  = this.refs.me.scrollTop;
      var scrollLeft = this.refs.me.scrollLeft;
      let x=e.clientX-r.left+scrollLeft;
      let y=e.clientY-r.top+scrollTop;

      this.setState({menu:{x,y,id}});//In test in renderNewRootAndSelectTheFirstProductToChange the smallpic click never comes back if this line is uncommented
    }

    render() {
      //react doesnt see the changes gsap made, for react the generated new dom can be undistinguishable from the old one,
      //to let apply the changes by gsap the placing must be triggered explicit (TODO: how can it be declarative? )
      this.placeAllProductsTimerID = setTimeout(()=>this.placeAllItems(),10);

      let openClose = this.getOpenClose();
      let items = (this.props.ids)
                  ? this.props.ids.map((id)=>this.props.createItem(id, this.storeRef, this.itemClicked))
                  : null;
      let menu = this.state.menu ? this.getMenu() : null;
      let className= classnames({'kugm-collectionsview': true,
                                 'open':                 this.state.open,
                                 'close':                ! this.state.open});

      return (
        <div ref="me" className={className} onClick={this.backgroundClicked}>
          {openClose}
          <div ref="items" className='kugm-collectionsview-items'>
            {items}
            {menu}
          </div>
        </div>
      );
    }

    componentDidMount() {
      window.addEventListener('resize', this.placeAllItems);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.placeAllItems);
      clearTimeout(this.placeAllProductsTimerID);
    }

    componentDidUpdate() {
      if (! this.props.reordeingAllowed)
        return;

      this.draggableState.order.forEach((id)=>{
        Draggable.create(this.itemDOMNodes[id] ,{
            onDragStart : ()=>this.onProductDragStart(id),
            onDrag      : ()=>this.onProductDrag(),
            onDragEnd   : ()=>this.onProductDragEnd(),
          });
        });
    }

    getOpenClose() {
      return (<div className='kugm-collectionsview-openclose' onClick={this.toggleOpenClose}>
                {this.props.title}
              </div>);
    }

    toggleOpenClose = (e) => {
      e.stopPropagation();
      this.setState({open:!this.state.open});
    }

    getMenu() {
      let menu = this.state.menu;
      var style = {
        left: menu.x,
        top:  menu.y,
      };

      let content = (menu.id) ? this.props.createItemMenu(menu.id) : this.props.createBackgroundMenu();

      return (
        <div className="kugm-collectionsview-menu" style={style}>
          {content}
        </div>
      );
    }

    isDragging() {
      return this.draggableState.draggedItem.id;
    }

    placeAllItems = () => {
      let state    = this.draggableState;
      let moveTime = (this.isDragging()) ? .5 : .3;
      let maxColumn = this.getMaxColumn();

      let minIx = state.changedInterval[0] || 0;
      let maxIx = state.changedInterval[1] || this.draggableState.order.length-1;
      let tl = new TimelineMax({
                               onComplete: ()=>{this.setDraggableState({aPlacingIsRunning:false})}
                               });
      for(let i = minIx; i<=maxIx; i++) {
        let [row,column] = this.getRowColumnOfIthItem(i,maxColumn);
        let p = this.draggableState.order[i];
        if (p===state.draggedItem.id)
          continue;

        tl.to(this.itemDOMNodes[p], moveTime, {x:column*itemGutterLength, y:row*itemGutterLength}, 0);
      }
      this.setDraggableState({aPlacingIsRunning:true});
      tl.restart();

      this.refs.items.style.height = `${Math.ceil(this.props.ids.length / maxColumn)*itemGutterLength}px`;
    }

    getMaxColumn() {
      return Math.floor(this.refs.me.clientWidth / itemGutterLength) || 1;
    }

    getRowColumnOfIthItem(i,maxColumn) {
      let column  = i % maxColumn;
      let row = (i - column)/maxColumn;

      return [row, column];
    }

    getIxOfClick(x,y) {
      let rowIx = Math.floor( (y / itemGutterLength) );
      let colIx = Math.floor( (x / itemGutterLength) );
      let maxColumn = Math.floor(this.refs.me.clientWidth / itemGutterLength);
      let maxColumnIx = maxColumn - 1;
      if (colIx > maxColumnIx)
        colIx = maxColumnIx;
      let ix = (rowIx)*maxColumn + colIx;

      return ix;
    }

    onProductDragStart = (id) => {
      let ix = this.getIxOfId(id);
      this.setDraggableState({draggedItem:{id,ix},renderWasRequestedDuringDragging:false});
      TweenLite.to(this.itemDOMNodes[id],.3,{scale: .95, className:'+=dragged'});
    }

    onProductDrag = () => {
      let state = this.draggableState;

      if (state.aPlacingIsRunning)
        return;

      let chasedId = this.getChasedId();
      if (! chasedId)
        return;

      let chasedIx = this.getIxOfId(chasedId);

      let draggedIx = state.draggedItem.ix;
      let [changedIntervalLow, changedIntervalHigh] = this.getChangedInterval(chasedIx, draggedIx);

      let newOrder = this.getNewOrder(changedIntervalLow, changedIntervalHigh, chasedIx, draggedIx);

      let draggedItem = state.draggedItem;
      let newDraggedProduct =  Object.assign({}, draggedItem, {ix: chasedIx});
      this.setDraggableState({order: newOrder, draggedItem: newDraggedProduct, changedInterval: [changedIntervalLow, changedIntervalHigh]});

      this.placeAllItems();
    }

    getChasedId() {
      let draggedElement = this.itemDOMNodes[this.draggableState.draggedItem.id];
      let itemDOMNodes = this.itemDOMNodes;

      for(var p in itemDOMNodes) {
        let domNode = itemDOMNodes[p];
        if (Draggable.hitTest(draggedElement, domNode,'50%')) {
          return domNode.getAttribute('data-item-id');
        }
      }

      return undefined;
    }

    getIxOfId(id) {
      return this.draggableState.order.findIndex((p)=>p===id);
    }

    getChangedInterval(chasedIx, draggedIx) {
      let low  = chasedIx;
      let high = draggedIx;

      if (high < low)
        low = [high, high = low][0];

      return [low, high];
      }

    getNewOrder(changedIntervalLow, changedIntervalHigh, chasedIx, draggedIx) {
      let state = this.draggableState;
      let order = state.order;
      let newOrder = [];
      let otherItemsShift = (chasedIx < draggedIx) ? 1 : -1;

      state.order.forEach((p,i)=>{
        let value;

        if ((i<changedIntervalLow) || (changedIntervalHigh<i))
          value = order[i];
        else if (i===chasedIx)
          value = order[draggedIx];
        else
          value = order[i-otherItemsShift];

        newOrder[i] = value;
      });

      return newOrder;
    }

    onProductDragEnd = () => {
      TweenLite.to(this.itemDOMNodes[this.draggableState.draggedItem.id],.3,{scale: 1,
                                                                             className:'-=dragged',
                                                                             onComplete:this.onDraggedProductMoveCompleted.bind(this)});
    }

    onDraggedProductMoveCompleted() {
      if (this.draggableState.renderWasRequestedDuringDragging)
        this.forceUpdate();

      this.setDraggableState({draggedItem:{id:null,ix:null}, changedInterval: [],renderWasRequestedDuringDragging:false});
      this.props.onChangeOrder(this.draggableState.order);
    }

    setDraggableState(change) {
      Object.assign(this.draggableState, change);
    }

    //DEBUG
    // printDraggableState(str) {
    //   console.log(str, ' draggedItem:', this.draggableState.draggedItem.id, ' its ix:', this.draggableState.draggedItem.ix, 'order:');
    //   console.log(this.draggableState.order);
    // }
  }
CollectionsView.propTypes = {
  title:                     PropTypes.string,
  ids:                       PropTypes.arrayOf(PropTypes.string),
  createItem:                PropTypes.func.isRequired,
  createItemMenu:            PropTypes.func.isRequired,
  createBackgroundMenu:      PropTypes.func.isRequired,
  reordeingAllowed:          PropTypes.bool.isRequired,
  onChangeOrder:             PropTypes.func.isRequired
}


export default CollectionsView;

/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React, {Component, PropTypes}      from 'react';
import TranslatedStringView               from './translationComponents/TranslatedStringView';
import cloneDeep                          from 'lodash.clonedeep';
import merge                              from 'lodash.merge';
import { normalize, schema }              from 'normalizr';
import classnames                         from 'classnames';

//Normalization
//-----------------------------------
const localizedStringId      = (id,locale)=>`${id}_${locale}`;
const localizedStringSchema  = new schema.Entity('localizedStrings',   {}, { idAttribute: (value,parent)=>localizedStringId(parent.id,value.locale)});
const translatedStringSchema = new schema.Entity('translatedStrings', {localizedStrings:[localizedStringSchema]});

//normalizr's denormalize doesn't work for these schemas
const denormalizeTranslatedStrings = (id,entities) => {
  const translatedStrings     = entities.translatedStrings;
  const localizedStrings      = entities.localizedStrings;

  const translatedString = translatedStrings[id];

  return merge({},translatedString,{localizedStrings:translatedString.localizedStrings.map(lsid=>localizedStrings[lsid])});
}


const getUsedLocales = (translatedStrings) => {
    return translatedStrings.reduce((a,tm)=>
      tm.localizedStrings.reduce((b,t)=>b.includes(t.locale) ? b : b.concat(t.locale),a)
    ,[]);
  }

const mkCompletedReorderedLocalizedStrings = (localizedStrings,locales) => {
  return locales.map(locale=>{
    const localizedString = localizedStrings.find(t=>t.locale===locale);

    return localizedString ? localizedString : {locale,string:''};
  });
  }

const getCompletedReorderedTranslatedStrings = (translatedStrings,locales) => {
    return translatedStrings.map(ts=> {
      const completedReorderedLocalizedStrings = mkCompletedReorderedLocalizedStrings(ts.localizedStrings,locales);

      return merge({},ts,{localizedStrings:null},{localizedStrings:completedReorderedLocalizedStrings});
    });
  }


//TODO make that locale can be
// added
// renamed
// removed
// changed regarding view order
export class TranslationView extends Component {
  constructor(){
    super(...arguments);

    this.setTranslation              = this.setTranslation.bind(this);
    this.setTranslationBack          = this.setTranslationBack.bind(this);
    this.setTranslatedStringBack     = this.setTranslatedStringBack.bind(this);
    this.setAllTranslatedStringsBack = this.setAllTranslatedStringsBack.bind(this);
    this.nextFocusedTranslatedString = this.nextFocusedTranslatedString.bind(this);
    this.setFocusedTranslatedString  = this.setFocusedTranslatedString.bind(this);
    this.saveEntity                  = this.saveEntity.bind(this);
    this.markTranslatedStringToRemove= this.markTranslatedStringToRemove.bind(this);

    this.state = this.getResetState(this.props.entityDescription);
  }

  getResetState(entityDescription) {
    //TODO: make TranslationView a property view of the EntityView, until that:
    const translatedStrings = entityDescription.propertyDescriptions[0].translatedStrings;

    //collect used locales
    const locales = getUsedLocales(translatedStrings);

    //complete locales in the translatedMessages: each must have the same locales in the same order
    //missing translations will be completed with an empty translation.
    const completedReorderedTranslatedStrings = getCompletedReorderedTranslatedStrings(translatedStrings,locales);

    //normalize the order of the locales in the translatedMessages
    //structure
    //{
    // result: [messageId]
    // entities: {
    //              translatedMessages:
    //              translations:
    //           }
    //}
    let normalizedEntityTranslatedStrings = normalize(completedReorderedTranslatedStrings,[translatedStringSchema]);

    return {
      //intended consts
      locales,
      normalizedEntityTranslatedStrings,
      //intended variables
      normalizedWorkingTranslatedStrings: cloneDeep(normalizedEntityTranslatedStrings),
      focusedTranslatedStringId:          null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entityDescription.identity.id === this.props.entityDescription.identity.id)
      return;

    this.setState(this.getResetState(nextProps.entityDescription));
  }

  render() {
    let title                     = this.getTitle();
    let changedTranslatedStrings  = this.getChangedTranslatedStrings();
    let translatedMessageViews    = this.getTranslatedStringsViews(changedTranslatedStrings);
    let entityChanged             = Object.keys(changedTranslatedStrings).length > 0 || this.isThereTranslatedStringToRemove();
    let controlPanel              = this.getControlPanel(entityChanged);
    let localeBar                 = this.getLocaleBar();

    return (
      <div className="kugm-translationview">
        {title}
        {controlPanel}
        {localeBar}
        {translatedMessageViews}
      </div>
    );
  }

  getTitle() {
    const id = this.props.entityDescription.identity.id;
    const translationOf = this.props.entityOverviews[id].translationOf;

    return (<div className="kugm-translationview-title" key={'title'}>
              {translationOf}
            </div>);
  }

  getLocaleBar() {
    let className      = classnames("kugm-translationview-localebar",
                                    `translations-count-${this.state.locales.length}`);

    const locales = this.state.locales.map((locale,i)=>{
      let className = classnames("kugm-translationview-localebar-locale",{"odd":i%2},{"even":!i%2});
      return (<div className={className} key={locale}>
                {locale}
              </div>)});

    return (
      <div className={className}>
        <div className="kugm-translationview-localebar-overmessageidfield" key={'messageidfield'}/>
        {locales}
      </div>
    );
  }

  getControlPanel(entityChanged) {
    let allBack =    entityChanged ? this.getAllBackButton() : null;
    let save    =    entityChanged ? this.getSaveButton()    : null;

    return  (<div className="kugm-translationview-buttons">
              {allBack}
              {save}
            </div>);
  }

  getAllBackButton() {
    return (
      <div className="kugm-translationview-buttons-allback" key={'allBack'} onClick={this.setAllTranslatedStringsBack}>
        &#8592;
      </div>);
  }

  getSaveButton() {
    return (
      <div className="kugm-translationview-buttons-save" key={'save'} onClick={this.saveEntity}>
        Speichern
      </div>);
  }

  //Returned structure
  // {
  // id: {
  //              localIx: true // if the translation of locale of the translated message is changed
  //     }
  // }
  getChangedTranslatedStrings() {
    let normalizedEntityTranslatedStrings  = this.state.normalizedEntityTranslatedStrings;

    let translatedStrings      = normalizedEntityTranslatedStrings.entities.translatedStrings;
    let entityLocalizedStrings  = normalizedEntityTranslatedStrings.entities.localizedStrings;
    let workingLocalizedStrings = this.state.normalizedWorkingTranslatedStrings.entities.localizedStrings;

    return normalizedEntityTranslatedStrings.result.reduce((a,id)=>{

        let changedTranslations = translatedStrings[id].localizedStrings.reduce((b,lsid,i)=>{
            const localizedString = entityLocalizedStrings[lsid];

            if (localizedString.string!==workingLocalizedStrings[lsid].string)
              b[i]=true;

            return b;
        },{});

      if (Object.keys(changedTranslations).length!==0)
        a[id]=changedTranslations;

      return a;
    },{});
  }

  isThereTranslatedStringToRemove(){
    const workingTranslatedStrings = this.state.normalizedWorkingTranslatedStrings.entities.translatedStrings;
    let   result = false;

    for(var id in workingTranslatedStrings) {
      if (workingTranslatedStrings[id].remove) {
        result = true;
        break;
      }
    }

    return result;
  }

  getTranslatedStringsViews(changedTranslatedStrings) {
    const normalizedWorkingTranslatedStrings = this.state.normalizedWorkingTranslatedStrings;
    const ids                                = normalizedWorkingTranslatedStrings.result;
    const localizedStrings                   = normalizedWorkingTranslatedStrings.entities.localizedStrings;
    const translatedStrings                  = normalizedWorkingTranslatedStrings.entities.translatedStrings;

    return ids.map((id,key)=>{
      const translatedString    = translatedStrings[id];
      const localizedStringIds  = translatedString.localizedStrings;
      const changedTranslations = changedTranslatedStrings[id];
      const markedToRemove      = translatedString.remove;
      const removable           = translatedString.removable && (! changedTranslations) && (! markedToRemove);

      let props = {
        key,
        messageId:             translatedString.id,
        localizedStringIds,
        localizedStrings:      localizedStringIds.map(tid=>localizedStrings[tid].string),
        changedTranslations,
        onBack:                changedTranslations ? this.setTranslationBack       : null,
        onAllBack:             changedTranslations || markedToRemove ? this.setTranslatedStringBack : null,
        onTranslationChange:   this.setTranslation,
        onStartEdit:           this.setFocusedTranslatedString,
        onFinishEdit:          this.nextFocusedTranslatedString,
        onRemove:              removable ? this.markTranslatedStringToRemove : null,
        focused:               this.state.focusedTranslatedStringId===id,
        markedToRemove
      };

      return <TranslatedStringView {...props} />;
    });
  }

  setTranslation(localizedStringId,string) {
    let normalizedWorkingTranslatedStrings = merge({},
                                                    this.state.normalizedWorkingTranslatedStrings,
                                                    {entities:{localizedStrings:{[localizedStringId]:{string}}}});

    this.setState({normalizedWorkingTranslatedStrings});
  }

  setTranslationBack(localizedStringId) {
    const entityTranslation = this.state.normalizedEntityTranslatedStrings.entities.localizedStrings[localizedStringId].string;

    this.setTranslation(localizedStringId,entityTranslation);
  }

  setTranslatedStringBack(id) {
    const entities                = this.state.normalizedEntityTranslatedStrings.entities;
    const entityLocalizedStrings  = entities.localizedStrings;
    const localizedStringsToMerge = entities.translatedStrings[id].localizedStrings.reduce((a,localizedStringId)=>{
      a[localizedStringId] = entityLocalizedStrings[localizedStringId];
      return a;
    },{});

    let normalizedWorkingTranslatedStrings = merge({},
                                                    this.state.normalizedWorkingTranslatedStrings,
                                                    {entities:{
                                                               localizedStrings:localizedStringsToMerge,
                                                               translatedStrings:{[id]:{remove:null}}
                                                             }});

    this.setState({normalizedWorkingTranslatedStrings});
  }

  setAllTranslatedStringsBack() {
    const entityLocalizedStrings = this.state.normalizedEntityTranslatedStrings.entities.localizedStrings;
    const entityTranslatedStrings = this.state.normalizedEntityTranslatedStrings.entities.translatedStrings;

    let normalizedWorkingTranslatedStrings = merge({},
                                                    this.state.normalizedWorkingTranslatedStrings,
                                                    {entities:{translatedStrings:null}},
                                                    {entities:{translatedStrings:entityTranslatedStrings}},
                                                    {entities:{localizedStrings:entityLocalizedStrings}});

    this.setState({normalizedWorkingTranslatedStrings});
  }

  setFocusedTranslatedString(id) {
    this.setState({focusedTranslatedStringId:id});
  }

  nextFocusedTranslatedString() {
    const normalizedWorkingTranslatedStrings = this.state.normalizedWorkingTranslatedStrings;
    const ids                                = normalizedWorkingTranslatedStrings.result;
    const translatedStrings                  = normalizedWorkingTranslatedStrings.entities.translatedStrings;

    let nextIx = ids.indexOf(this.state.focusedTranslatedStringId)+1;

    while(true) { // eslint-disable-line no-constant-condition
      let nextTranslatedStringId = ids[nextIx];

      if (nextTranslatedStringId) {
        const nextTranslatedString = translatedStrings[nextTranslatedStringId];

        if (! nextTranslatedString.remove)
          return this.setState({focusedTranslatedStringId:nextTranslatedString.id});
        else
          nextIx++;
      } else
          return this.setState({focusedTranslatedStringId:null});
    }
  }

  markTranslatedStringToRemove(id) {
    let normalizedWorkingTranslatedStrings = merge({},
                                                    this.state.normalizedWorkingTranslatedStrings,
                                                    {entities:{translatedStrings:{[id]:{remove:true}}}});

    this.setState({normalizedWorkingTranslatedStrings,focusedTranslatedStringId:null});
  }

  saveEntity(e) {
    e.stopPropagation();
    //The whole working state will be saved, to let save the in-merged current app messages
    this.props.onSaveEntity(this.getWorkingEntityDescription());
  }

  getWorkingEntityDescription() {
    return {
      identity:           this.props.entityDescription.identity,
      //TODO: make TranslationView a property view of the EntityView until that
      propertyDescriptions: [this.getWorkingTranslatedStrings()]
    }
  }

  getWorkingTranslatedStrings() {
    const workingEntities = this.state.normalizedWorkingTranslatedStrings.entities;

    const workingTranslatedStrings = this.state.normalizedWorkingTranslatedStrings.result.map(id=>denormalizeTranslatedStrings(id,workingEntities));

    return {
      translatedStrings: workingTranslatedStrings,
      __typename:         'TranslatedStringsProperty',
      property: this.props.entityDescription.propertyDescriptions[0].property
    }
  }
}
TranslationView.propTypes = {
  //view mode
  entityDescription:     PropTypes.object.isRequired,
  entityOverviews:       PropTypes.object.isRequired,
  //edit mode
  onSaveEntity:         PropTypes.func.isRequired,
}

export default TranslationView;

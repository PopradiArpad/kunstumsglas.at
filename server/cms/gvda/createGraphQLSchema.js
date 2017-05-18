/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import {
        GraphQLEnumType,
        GraphQLInterfaceType,
        GraphQLObjectType,
        GraphQLInputObjectType,
        GraphQLList,
        GraphQLNonNull,
        GraphQLSchema,
        GraphQLString,
        GraphQLID,
        GraphQLBoolean
} from 'graphql';


const createGraphQLSchema = (typesAccess) => {

  const Identity = new GraphQLInputObjectType({
    name:        'Identity',
    description: 'The ID and the db model of a db entity. The main view description has id but no dbModel',
    fields: {
      id:      { type: new GraphQLNonNull(GraphQLID), description:'The ObjectId' },
      dbModel: { type: GraphQLString,                 description:'The name of the db model' }
    }
  });

  //No type field: there is __typename
  const PropertyDescription = new GraphQLInterfaceType({
    name:        'PropertyDescription',
    description: 'The common data on all property views (data that needed to visualize a property)',
    fields: {
      title:    { type: new GraphQLNonNull(GraphQLString), description:'The human readable name of the property' },
      property: { type: new GraphQLNonNull(GraphQLString), description:'The property name' },
    },
    resolveType(propertyView) {
      switch (propertyView.__typename) {
        case 'StringProperty':           return StringProperty;
        case 'BooleanProperty':          return BooleanProperty;
        case 'DataURLProperty':          return DataURLProperty;
        case 'IdArrayProperty':          return IdArrayProperty;
        case 'FileUploadStatusProperty': return FileUploadStatusProperty;
        case 'TranslatedStringsProperty':return TranslatedStringsProperty;
        case 'LocalizedStringsProperty': return LocalizedStringsProperty;
      }
    }
  });

  const LocalizedString = new GraphQLObjectType({
    name:        'LocalizedString',
    description: 'locale - string pair ',
    fields: {
      locale:    { type: new GraphQLNonNull(GraphQLString), description:'The locale' },
      string:    { type: new GraphQLNonNull(GraphQLString), description:'The translated string' }
    }
  });

  const TranslatedString = new GraphQLObjectType({
    name:        'TranslatedString',
    description: 'message id - localized strings pair ',
    fields: {
      id:               { type: new GraphQLNonNull(GraphQLString),  description:'The id of the message' },
      localizedStrings: { type: new GraphQLList(LocalizedString),   description:'The list of localized strings' },
      removable:        { type: new GraphQLNonNull(GraphQLBoolean), description:'True if the localized string is not used' },
    }
  });

  const TranslatedStringsProperty = new GraphQLObjectType({
    name:        'TranslatedStringsProperty',
    description: 'A list of TranslatedStrings',
    interfaces:  [PropertyDescription],
    fields: {
      title:              { type: new GraphQLNonNull(GraphQLString), description:'The human readable name of the property' },
      property:           { type: new GraphQLNonNull(GraphQLString), description:'The property name' },
      translatedStrings:  { type: new GraphQLList(TranslatedString), description:'List of message id and localized strings' },
    }
  });

  const LocalizedStringsProperty = new GraphQLObjectType({
    name:        'LocalizedStringsProperty',
    description: 'A TranslatedStrings',
    interfaces:  [PropertyDescription],
    fields: {
      title:              { type: new GraphQLNonNull(GraphQLString), description:'The human readable name of the property' },
      property:           { type: new GraphQLNonNull(GraphQLString), description:'The property name' },
      localizedStrings:   { type: new GraphQLList(LocalizedString),  description:'List of LocalizedString' },
      multiline:          { type: new GraphQLNonNull(GraphQLBoolean),description:'Whether it should be shown multiline' }
    }
  });

  const EntityDescription = new GraphQLObjectType({
    name:        'EntityDescription',
    description: 'The entity as the current user can see',
    fields: {
      removable:            { type: new GraphQLNonNull(GraphQLBoolean),   description:'Whether the entity removable by the current user' },
      propertyDescriptions: { type: new GraphQLList(PropertyDescription), description:'The property descriptions' }
    }
  });

  const FileUploadStatus = new GraphQLEnumType({
    name:        'FileUploadStatus',
    description: 'The upload status of a file',
    values: {
      UPLOADED: {
        value: "UPLOADED"
      },
      NOT_UPLOADED: {
        value: "NOT_UPLOADED"
      }
    }
  });

  //This a the status of an uploaded file
  //The uploading happens through the mutation with a PropertyValueInput to the same identity and property!
  //The files strored not on the entity but somewhere, the mutation and the downloading mechanism know where
  //based on the entity and the FileUploadStatus schema type.
  const FileUploadStatusProperty = new GraphQLObjectType({
    name:        'FileUploadStatusProperty',
    description: 'From server a string with two possible values:UPLOADED,NOT_UPLOADED.To server can be an uploaded file as DataURL.',
    interfaces:  [PropertyDescription],
    fields: {
      title:        { type: new GraphQLNonNull(GraphQLString),    description:'The human readable name of the property' },
      property:     { type: new GraphQLNonNull(GraphQLString),    description:'The property name' },
      uploadStatus: { type: new GraphQLNonNull(FileUploadStatus), description:'The upload status' },
      fileExtension:{ type: new GraphQLNonNull(GraphQLString),    description:'The acceptable file extension to upload' },
    }
  });

  const StringProperty = new GraphQLObjectType({
    name:        'StringProperty',
    description: 'Data to describe the view of a string property',
    interfaces:  [PropertyDescription],
    fields: {
      title:    { type: new GraphQLNonNull(GraphQLString), description:'The human readable name of the property' },
      property: { type: new GraphQLNonNull(GraphQLString), description:'The property name' },
      string:   { type: new GraphQLNonNull(GraphQLString), description:'The value' },
      multiline:{ type: new GraphQLNonNull(GraphQLBoolean),description:'Whether it multiline' }
    }
  });

  const BooleanProperty = new GraphQLObjectType({
    name:        'BooleanProperty',
    description: 'Data to describe the view of a boolean property',
    interfaces:  [PropertyDescription],
    fields: {
      title:    { type: new GraphQLNonNull(GraphQLString),  description:'The human readable name of the property' },
      property: { type: new GraphQLNonNull(GraphQLString),  description:'The property name' },
      bool:     { type: new GraphQLNonNull(GraphQLBoolean), description:'The value' },
    }
  });

  const DataURLProperty = new GraphQLObjectType({
    name:        'DataURLProperty',
    description: 'Data to describe the view of a buffer property as data url',
    interfaces:  [PropertyDescription],
    fields: {
      title:    { type: new GraphQLNonNull(GraphQLString), description:'The human readable name of the property' },
      property: { type: new GraphQLNonNull(GraphQLString), description:'The property name' },
      dataurl:  { type: new GraphQLNonNull(GraphQLString), description:'The DataURL value' },
    }
  });

  const IdArrayProperty = new GraphQLObjectType({
    name:        'IdArrayProperty',
    description: 'Data to describe the view of an array of ids referring to the same db model types',
    interfaces:  [PropertyDescription],
    fields: {
      title:               { type: new GraphQLNonNull(GraphQLString), description:'The human readable name of the property' },
      property:            { type: new GraphQLNonNull(GraphQLString), description:'The property name' },
      ids:                 { type: new GraphQLList(GraphQLID),        description:'The ids of the referred entities' },
      referredDbModel:     { type: new GraphQLNonNull(GraphQLString), description:'The db model to that the ids are referring' },
      reordeingAllowed:    { type: new GraphQLNonNull(GraphQLBoolean),description:'True if the reorder of items is allowed' },
      createNewItemAllowed:{ type: new GraphQLNonNull(GraphQLBoolean),description:'True if the creation of new items is allowed' },
      removeItemAllowed:   { type: new GraphQLNonNull(GraphQLBoolean),description:'True if the remove of items is allowed' }
    }
  });

  const EntityPropertyValuesRequest = new GraphQLInputObjectType({
    name:        'EntityPropertyValuesRequest',
    description: 'A request for property values of an entity',
    fields: {
      identity:   { type: new GraphQLNonNull(Identity),  description:'The identity thats property values are requested' },
      properties: { type: new GraphQLList(GraphQLString),description:'The needed properties' }
    }
  });

  const PropertyValueOutput = new GraphQLObjectType({
    name:        'PropertyValueOutput',
    description: 'A property-value pair output',
    fields: {
      property:     { type: new GraphQLNonNull(GraphQLString), description:'The property name' },
      value:        { type: new GraphQLNonNull(GraphQLString), description:'The property value as string' },
    }
  });

  const EntityPropertyValues = new GraphQLObjectType({
    name:        'EntityPropertyValues',
    description: 'Some property-value output of an entity',
    fields: {
      //remark Identity is input type: not allowed to use it here. Not really needed here but it would cut back the type proliferation
      id:             { type: new GraphQLNonNull(GraphQLID),     description:'The ObjectId of the entity to that the data are related' },
      propertyValues: { type: new GraphQLList(PropertyValueOutput),description:'Scalar data of the entity' }
    }
  });



  const Query = new GraphQLObjectType({
    name:        'Query',
    description: 'The root query',
    fields: {
      GetEntityDescription:    { type: EntityDescription,
                                 description:'Get the entity description of the given identity for the current user',
                                 args: {
                                   identity: {type: new GraphQLNonNull(Identity)}
                                 },
                                 resolve: typesAccess.GetEntityDescription
                               },
       GetEntityPropertyValues:{ type: new GraphQLList(EntityPropertyValues),
                                 description:'get scalar values of entities',
                                 args: {
                                     entityPropertyValuesRequests: {type: new GraphQLList(EntityPropertyValuesRequest)}
                                   },
                                   resolve: typesAccess. GetEntityPropertyValues
                               },
    }
  });

  const PropertyValueInput = new GraphQLInputObjectType({
    name:        'PropertyValueInput',
    description: 'A property-value pair input',
    fields: {
      property: { type: new GraphQLNonNull(GraphQLString), description:'The property' },
      value:    { type: new GraphQLNonNull(GraphQLString), description:'The value as string' }
    }
  });

  const VoidOutput = new GraphQLObjectType({
    name:        'VoidOutput',
    description: 'Output if nothing to bring back: GraphQL doesnt accept void as return type',
    fields: {
      void: { type: GraphQLBoolean, description:'really nothing' },
    }
  });

  const Mutation = new GraphQLObjectType({
    name:        'Mutation',
    description: 'The root mutation',
    fields: {
      CreateEntityTo:  { type: VoidOutput,
                         description:"Create an entity and add it to the parent's id array property. The result is the renewed property view of that array.",
                         args: {
                           dbModel: {type: new GraphQLNonNull(GraphQLString),   description:'The db model that should be created'},
                           data:    {type: new GraphQLList(PropertyValueInput), description:'The data with that the new entity should be created'},
                           parent:  {type: new GraphQLNonNull(Identity),        description:'The entity that should be the parent of the newly created entity'},
                           property:{type: new GraphQLNonNull(GraphQLString),   description:'The id array property of the entity to that the new entity comes referred.'},
                         },
                         resolve: typesAccess.CreateEntityTo
                        },
      RemoveEntity:  { type: VoidOutput,
                       description:"Remove an entity. View side should remove all info about the entity.",
                       args: {
                         identity:       {type: new GraphQLNonNull(Identity), description:'The entity that should be removed.'},
                         parentIdentity: {type: new GraphQLNonNull(Identity), description:'The parent of the entity that should be removed.'},
                       },
                       resolve: typesAccess.RemoveEntity
                      },
      ChangeEntity:  { type: VoidOutput,
                       description:"Change an entity.The view side should remove all info about the entity.",
                       args: {
                         identity: {type: new GraphQLNonNull(Identity),                           description:'The entity that should be changed.'},
                         data:     {type: new GraphQLNonNull(new GraphQLList(PropertyValueInput)), description:'The data with that the entity should be changed'},
                       },
                       resolve: typesAccess.ChangeEntity
                      },
    }
  });

  const schema = new GraphQLSchema({
    query:    Query,
    mutation: Mutation,
    types:    [StringProperty,
               BooleanProperty,
               DataURLProperty,
               FileUploadStatusProperty,
               IdArrayProperty,
               TranslatedStringsProperty,
               LocalizedStringsProperty,
               PropertyValueOutput]
  });

  return schema;
}

export default createGraphQLSchema;

/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import graphqlHTTP            from 'express-graphql';
import graphiql               from './config/graphiql';
import createGraphQLSchema    from './createGraphQLSchema';
import loggedIn               from '../auth/loggedIn';


const initGvda = (app,typesAccess) => {
  const schema      = createGraphQLSchema(typesAccess);
  const formatError = graphiql
                      ? error => ({
                        message: error.message,
                        locations: error.locations,
                        stack: error.stack
                      })
                      : undefined;

  app.use('/graphql', loggedIn,
                      graphqlHTTP({
                                   schema,
                                   graphiql,
                                   formatError
                                 })
         );
}

export default initGvda;

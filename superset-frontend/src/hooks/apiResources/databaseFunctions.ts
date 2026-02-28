/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { api } from './queryApi';

export type FetchDataFunctionsQueryParams = {
  dbId?: string | number;
  schema?: string;
};

export type FetchFunctionDefinitionParams = {
  dbId: string | number;
  functionName: string;
  schema?: string;
};

type FunctionNamesResponse = {
  json: {
    function_names: string[];
  };
  response: Response;
};

type FunctionDefinitionResponse = {
  json: {
    function_definition: string | null;
  };
  response: Response;
};

const databaseFunctionApi = api.injectEndpoints({
  endpoints: builder => ({
    databaseFunctions: builder.query<string[], FetchDataFunctionsQueryParams>({
      providesTags: ['DatabaseFunctions'],
      query: ({ dbId, schema }) => ({
        endpoint: `/api/v1/database/${dbId}/function_names/`,
        // Follow the same pattern as the tables API: encode parameters
        // in the Rison `q=` payload using `schema_name` as the key.
        urlParams: {
          ...(schema ? { schema_name: schema } : {}),
        },
        transformResponse: ({ json }: FunctionNamesResponse) =>
          json.function_names,
      }),
      serializeQueryArgs: ({ queryArgs: { dbId, schema } }) => ({
        dbId,
        schema,
      }),
    }),
    databaseFunctionDefinition: builder.query<
      string | null,
      FetchFunctionDefinitionParams
    >({
      query: ({ dbId, functionName, schema }) => ({
        endpoint: `/api/v1/database/${dbId}/function_definition/`,
        urlParams: {
          function_name: functionName,
          ...(schema ? { schema_name: schema } : {}),
        },
        transformResponse: ({ json }: FunctionDefinitionResponse) =>
          json.function_definition,
      }),
    }),
  }),
});

export const {
  useDatabaseFunctionsQuery,
  useLazyDatabaseFunctionDefinitionQuery,
} = databaseFunctionApi;

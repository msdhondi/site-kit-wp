/**
 * `modules/analytics-4` data store: accounts.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import API from 'googlesitekit-api';
import Data from 'googlesitekit-data';
import { CORE_SITE } from '../../../googlesitekit/datastore/site/constants';
import { STORE_NAME } from './constants';
import { createFetchStore } from '../../../googlesitekit/data/create-fetch-store';
const { commonActions } = Data;

const fetchGetAccountSummariesStore = createFetchStore( {
	baseName: 'getAccountSummaries',
	controlCallback() {
		return API.get( 'modules', 'analytics-4', 'account-summaries', {}, {
			useCache: true,
		} );
	},
	reducerCallback( state, accountSummaries ) {
		return { ...state, accountSummaries };
	},
} );

const baseInitialState = {
	accountSummaries: undefined,
};

const baseActions = {
	/**
	 * Gets an ID of an account that has a matching property.
	 *
	 * @since n.e.x.t
	 *
	 * @return {string} The account ID on success, otherwise NULL.
	 */
	*matchAccountID() {
		const registry = yield commonActions.getRegistry();
		const accounts = yield Data.commonActions.await(
			registry.__experimentalResolveSelect( STORE_NAME ).getAccountSummaries()
		);

		if ( ! Array.isArray( accounts ) || accounts.length === 0 ) {
			return null;
		}

		const url = registry.select( CORE_SITE ).getReferenceSiteURL();
		const ga4PropertyIDs = ( Array.isArray( accounts ) ? accounts : [] ).reduce(
			( acc, { propertySummaries } ) => [ ...acc, ...propertySummaries.map( ( { _id } ) => _id ) ],
			[],
		);

		const property = yield Data.commonActions.await(
			registry.dispatch( STORE_NAME ).matchPropertyByURL( ga4PropertyIDs, url )
		);

		return property?._accountID;
	},
};

const baseControls = {
};

const baseReducer = ( state, { type } ) => {
	switch ( type ) {
		default: {
			return state;
		}
	}
};

const baseResolvers = {
	*getAccountSummaries() {
		const registry = yield commonActions.getRegistry();
		const summaries = registry.select( STORE_NAME ).getAccountSummaries();
		if ( summaries === undefined ) {
			yield fetchGetAccountSummariesStore.actions.fetchGetAccountSummaries();
		}
	},
};

const baseSelectors = {
	/**
	 * Gets account summaries.
	 *
	 * @since 1.32.0
	 *
	 * @param {Object} state Data store's state.
	 * @return {Array.<Object>} Account summaries array.
	 */
	getAccountSummaries( state ) {
		return state.accountSummaries;
	},
};

const store = Data.combineStores(
	fetchGetAccountSummariesStore,
	{
		initialState: baseInitialState,
		actions: baseActions,
		controls: baseControls,
		reducer: baseReducer,
		resolvers: baseResolvers,
		selectors: baseSelectors,
	}
);

export const initialState = store.initialState;
export const actions = store.actions;
export const controls = store.controls;
export const reducer = store.reducer;
export const resolvers = store.resolvers;
export const selectors = store.selectors;

export default store;

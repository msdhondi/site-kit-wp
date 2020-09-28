/**
 * ESLint rules: Require fullstops in JSDoc.
 *
 * Site Kit by Google, Copyright 2020 Google LLC
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
 * External dependencies
 */
const { default: iterateJsdoc } = require( 'eslint-plugin-jsdoc/dist/iterateJsdoc' );

/**
 * Internal dependencies
 */
const { isDependencyBlock } = require( '../utils' );

module.exports = iterateJsdoc( ( {
	context,
	jsdoc,
	jsdocNode,
} ) => {
	if ( isDependencyBlock( jsdoc ) ) {
		return;
	}

	// Don't match code block examples that end in "```".
	if ( jsdoc.description && ! jsdoc.description.match( /\.$/g ) && ! jsdoc.description.match( /```$/g ) ) {
		context.report( { node: jsdocNode, message: `JSDoc block text should end with a period/full-stop.`, data: { name: jsdocNode.name } } );
		return;
	}

	// Move on to checking tags for this JSDoc block.
	if ( ! jsdoc.tags || ! jsdoc.tags.length ) {
		return;
	}

	jsdoc.tags.forEach( ( tag ) => {
		// Only check these tags for fullstops.
		if ( ! [ 'param', 'returns' ].includes( tag.tag ) ) {
			return;
		}

		if ( tag.description && tag.description.length && ! tag.description.match( /\.$/gm ) ) {
			context.report( { node: jsdocNode, message: `The description for \`${ tag.source }\` should end with a period/full-stop.`, data: { name: jsdocNode.name } } );
		}
	} );
}, {
	iterateAllJsdocs: true,
	meta: {
		docs: {
			description: 'Requires that descriptions start with capital letters.',
		},
		fixable: 'code',
		type: 'suggestion',
	},
} );

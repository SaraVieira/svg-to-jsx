import { parse } from 'svg-parser';
import hastToBabelAst from '@svgr/hast-util-to-babel-ast';
import { transformFromAstSync, createConfigItem } from '@babel/core';
import { format } from 'prettier/standalone';
import * as prettierPluginBabel from 'prettier/plugins/babel';
import * as prettierPluginTypescript from 'prettier/plugins/typescript';
import * as prettierPluginEstree from 'prettier/plugins/estree';
import svgrBabelPreset, { Options as SvgrPresetOptions } from '@svgr/babel-preset';
import type { Plugin } from '@svgr/core';
import { optimize } from 'svgo';

export interface Env {}

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'HEAD,POST,OPTIONS',
	'Access-Control-Max-Age': '86400', // optional
	'Access-Control-Allow-Headers': 'Content-Type',
};

const transform: Plugin = (code, config, state) => {
	const hastTree = parse(code);

	const babelTree = hastToBabelAst(hastTree);

	const svgPresetOptions: SvgrPresetOptions = {
		ref: config.ref,
		titleProp: config.titleProp,
		descProp: config.descProp,
		expandProps: config.expandProps,
		dimensions: config.dimensions,
		icon: config.icon,
		native: config.native,
		svgProps: config.svgProps,
		replaceAttrValues: config.replaceAttrValues,
		typescript: config.typescript,
		template: config.template,
		memo: config.memo,
		exportType: config.exportType,
		namedExport: config.namedExport,
		jsxRuntime: 'classic',
		importSource: 'react',
		jsxRuntimeImport: { namespace: 'React', source: 'react' },
		state,
	};

	const result = transformFromAstSync(babelTree, code, {
		caller: {
			name: 'svgr',
		},
		presets: [
			createConfigItem([svgrBabelPreset, svgPresetOptions], {
				type: 'preset',
			}),
		],
		filename: 'unknown',
		babelrc: false,
		configFile: false,
		code: true,
		ast: false,
		// @ts-ignore
		inputSourceMap: false,
		...(config.jsx && config.jsx.babelConfig),
	});

	if (!result?.code) {
		throw new Error(`Unable to generate SVG file`);
	}

	return result.code;
};
export default {
	async fetch(request: Request) {
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: {
					...corsHeaders,
					Allow: 'HEAD, POST, OPTIONS',
				},
			});
		}
		const {
			name,
			svg,
			native,
			icon,
			expandProps = 'end',
			typescript,
		} = (await request.json()) as {
			name: string;
			svg: string;
			native: boolean;
			expandProps: boolean | 'start' | 'end' | undefined;
			icon: boolean;
			typescript: boolean;
		};

		try {
			const data = await format(
				transform(
					optimize(svg.trim()).data,
					{
						native,
						expandProps,
						typescript,
						dimensions: true,
						icon: icon,
					},
					{ componentName: name || 'Icon' }
				),
				{
					parser: 'typescript',
					plugins: [prettierPluginEstree, prettierPluginTypescript],
				}
			);

			return Response.json(
				{ data },
				{
					headers: {
						...corsHeaders,
						'content-type': 'application/json;charset=UTF-8',
					},
				}
			);
		} catch (e) {
			console.log('error', e);
			return Response.json({
				error: "Couldn't parse SVG",
			});
		}
	},
} satisfies ExportedHandler;

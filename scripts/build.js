const { rollup } = require('rollup');
const resolvePlugin = require('rollup-plugin-node-resolve');
const filesizePlugin = require('rollup-plugin-filesize');
const replacePlugin = require('rollup-plugin-replace');
const terserPlugin = require('rollup-plugin-terser').terser;

const fs = require('fs-extra');
const path = require('path');
const ts = require('typescript');

const OUT_DIR = 'out';
const TMP_DIR = 'out_tmp'
const G2 = 'g2'; // TODO maybe take it from config?

// make sure we're in the right folder
process.chdir(path.resolve(__dirname, ".."))

fs.removeSync(OUT_DIR);
fs.removeSync(TMP_DIR);

function buildTS(outDir, target, declarations) {
    console.log(`Running typescript build (target: ${ts.ScriptTarget[target]}) in ${TMP_DIR}/${outDir}/`);

    const tsConfig = path.resolve("tsconfig.json");
    const json = ts.parseConfigFileTextToJson(tsConfig, ts.sys.readFile(tsConfig), true);
    const { options } = ts.parseJsonConfigFileContent(json.config, ts.sys, path.dirname(tsConfig));

    options.target = target;
    options.outDir = path.join(TMP_DIR, outDir);
    options.declaration = declarations;

    options.module = ts.ModuleKind.ES2015;
    options.importHelpers = true;
    options.noEmitHelpers = true;
    if (declarations) options.declarationDir = path.resolve('.', OUT_DIR);

    const rootFile = path.resolve('src', 'g2.ts');
    const host = ts.createCompilerHost(options, true);
    const prog = ts.createProgram([rootFile], options, host);
    const result = prog.emit();
    if (result.emitSkipped) {
        const message = result.diagnostics
            .map(
                d =>
                    `${ts.DiagnosticCategory[d.category]} ${d.code} (${d.file}:${d.start}): ${
                    d.messageText
                    }`
            )
            .join("\n");

        throw new Error(`Failed to compile typescript:\n\n${message}`)
    }
}

async function generateBundledModule(inputFile, outputFile, format, production) {
    console.log(`Generating ${outputFile} bundle.`)

    const plugins =
        production ?
            [
                resolvePlugin(),
                replacePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
                terserPlugin(),
                filesizePlugin()
            ] :
            [
                resolvePlugin(),
                filesizePlugin()
            ];

    const bundle = await rollup({
        input: inputFile,
        plugins
    });

    await bundle.write({
        file: outputFile,
        format,
        banner: '/** AC Test build */',
        exports: 'named',
        name: format == 'umd' ? G2 : void 0
    });

    console.log(`Generation of ${outputFile} bundle finished.`)
}

// function copyFlowDefinitions() {
//     console.log("Copying flowtype definitions")
//     fs.copyFileSync("flow-typed/mobx.js", "lib/mobx.js.flow")
//     console.log("Copying of flowtype definitions done")
// }

async function build() {
    buildTS('es5', ts.ScriptTarget.ES5, true)
    buildTS('es6', ts.ScriptTarget.ES2015, false)

    const es5Build = path.join(TMP_DIR, 'es5', `${G2}.js`);
    const es6Build = path.join(TMP_DIR, 'es6', `${G2}.js`);

    await Promise.all([
        generateBundledModule(es5Build, path.join(OUT_DIR, `${G2}.js`), 'cjs', false),
        generateBundledModule(es5Build, path.join(OUT_DIR, `${G2}.min.js`), 'cjs', true),

        generateBundledModule(es5Build, path.join(OUT_DIR, `${G2}.module.js`), 'es', false),

        generateBundledModule(es6Build, path.join(OUT_DIR, `${G2}.es6.js`), 'es', false),

        generateBundledModule(es5Build, path.join(OUT_DIR, `${G2}.umd.js`), 'umd', false),
        generateBundledModule(es5Build, path.join(OUT_DIR, `${G2}.umd.min.js`), 'umd', true)
    ])
    // copyFlowDefinitions()
}

build().catch(e => {
    console.error(e)
    if (e.frame) {
        console.error(e.frame)
    }
    process.exit(1)
})
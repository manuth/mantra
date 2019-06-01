import browserify from "browserify";
import FileSystem, { pathExists } from "fs-extra";
import gulp from "gulp";
import buffer from "gulp-buffer";
import gulpif from "gulp-if";
import rename from "gulp-rename";
import sass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import minify from "gulp-uglify";
import lazyPipe from "lazypipe";
import sassImporter from "node-sass-package-importer";
import Path from "path";
import tsify from "tsify";
import source from "vinyl-source-stream";
import { SettingsStore } from "./.gulp/SettingsStore";
import "./.gulp/TaskFunction";

let settings = SettingsStore.Load();

function CreateTarget(target: string)
{
    let LoadTarget = (done: () => void) =>
    {
        settings = SettingsStore.Load(target);
        done();
    }

    let task = gulp.series(
        LoadTarget,
        Build
    );

    task.displayName = target;
    task.description = "Builds the project for the `" + target + "`-target";
    return task;
}

export let Build = gulp.parallel(
    Library,
    Theme,
    Templates);
Build.description = "Builds the project";

export let Debug = CreateTarget("Debug");
export let Release = CreateTarget("Release");

export async function Clean()
{
    await FileSystem.remove(Path.join("test", "website", "themes", "mantra"));
    await FileSystem.remove(settings.JavaScriptPath());
    await FileSystem.remove(settings.StylePath());
    await FileSystem.remove(settings.TemplatePath());
}
Clean.description = "Cleans the build-files"

export function Library()
{
    let tsConfigFile = Path.resolve(settings.TypeScriptProjectRoot("tsconfig.json"));
    let libraryBuilder = lazyPipe().pipe(
        minify
    );

    let debugBuilder = lazyPipe().pipe(
        sourcemaps.init,
        {
            loadMaps: true
        }
    ).pipe(
        sourcemaps.write,
        ".",
        {
            sourceRoot: Path.relative(settings.JavaScriptPath(), ".")
        }
    );

    return browserify(
        {
            entries: (require(tsConfigFile).files as string[]).map(
                (file: string) => settings.TypeScriptProjectRoot(file)),
            debug: settings.Debug
        }
    ).plugin(
        tsify,
        {
            project: tsConfigFile
        }).bundle().pipe(
            source("mantra.js")
        ).pipe(
            buffer()
        ).pipe(
            gulpif(
                settings.Debug,
                debugBuilder(),
                libraryBuilder()
            )
        ).pipe(
            gulp.dest(settings.JavaScriptPath())
        );
}
Library.description = "Builds the TypeScript-library";

export function Theme()
{
    let themeBuilder = lazyPipe().pipe(
        sass,
        {
            importer: sassImporter()
        }
    ).pipe(
        rename,
        (parsedPath) =>
        {
            parsedPath.basename = "mantra";
        }
    );

    let debugBuilder = lazyPipe().pipe(
        sourcemaps.init
    ).pipe(
        themeBuilder
    ).pipe(
        sourcemaps.write,
        ".",
        {
            sourceRoot: Path.relative(settings.StylePath(), settings.StyleSource())
        }
    );

    return gulp.src(
        settings.StyleSource("main.scss")).pipe(
            gulpif(
                settings.Debug,
                debugBuilder(),
                themeBuilder())
        ).pipe(
            gulp.dest(settings.StylePath())
        )
}
Theme.description = "Builds the theme";

export function Templates()
{
    return gulp.src(
        settings.TemplateSource("**")).pipe(
            gulp.dest(settings.TemplatePath()));
}
Templates.description = "Build the templates";


export let Watch = gulp.series(
    Build,
    function Watching()
    {
        gulp.watch(settings.TemplateSource("**"), Templates);
        gulp.watch(settings.TypeScriptProjectRoot("**"), Library);
        gulp.watch(settings.StyleSource("**"), Theme);
    });
Watch.description = "Builds the project in watch-mode";

export default Build;
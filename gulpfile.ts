import browserify from "browserify";
import FileSystem from "fs-extra";
import gulp from "gulp";
import rename from "gulp-rename";
import sass from "gulp-sass";
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
    await FileSystem.remove("templates");
}
Clean.description = "Cleans the build-files"

export function Library()
{
    let tsConfigFile = settings.TypeScriptProjectRoot("tsconfig.json");

    return browserify(
        {
            entries: [
                settings.TypeScriptPath("main.ts")
            ]
        }
    ).plugin(
        tsify,
        {
            project: tsConfigFile
        }).bundle().pipe(
            source("mantra.js")
        ).pipe(
            gulp.dest(settings.JavaScriptPath())
        );
}
Library.description = "Builds the TypeScript-library";

export function Theme()
{
    return gulp.src(
        settings.SourcePath("Theme", "main.scss")).pipe(
            sass({
                importer: sassImporter()
            })
        ).pipe(
            rename(
                (parsedPath) =>
                {
                    parsedPath.basename = "mantra"
                })
        ).pipe(
            gulp.dest(settings.StylePath())
        )
}
Theme.description = "Builds the theme";

export function Templates()
{
    return gulp.src(
        settings.SourcePath("Templates", "**")).pipe(
            gulp.dest("templates"));
}
Templates.description = "Build the templates";


export let Watch = gulp.series(
    Build,
    function Watching()
    {
        gulp.watch(settings.SourcePath("Templates", "**"), Templates);
        gulp.watch(settings.TypeScriptProjectRoot("**"), Library);
        gulp.watch(settings.StylePath("**"), Theme);
    });
Watch.description = "Builds the project in watch-mode";

export default Build;
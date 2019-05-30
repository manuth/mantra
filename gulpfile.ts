import browserify from "browserify";
import gulp from "gulp";
import tsify from "tsify";
import source from "vinyl-source-stream";
import { SettingsStore } from "./.gulp/SettingsStore";

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

    task["displayName"] = target;
    task["description"] = "Builds the project for the `" + target + "`-target";
    return task;
}

export let Build = gulp.parallel(
    Library,
    Templates);
Build["description"] = "Builds the project";

export let Debug = CreateTarget("Debug");
export let Release = CreateTarget("Release");

export function Library()
{
    let tsConfigFile = settings.TypeScriptProjectRoot("tsconfig.json");

    return browserify(
        {
            entries: [
                settings.TypeScriptPath("main.ts")
            ],
            debug: true
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
Library["description"] = "Builds the TypeScript-library"

export function Templates()
{
    return gulp.src(
        settings.SourcePath("Templates", "**")).pipe(
            gulp.dest("templates"));
}
Templates["description"] = "Build the templates";


export function Watch()
{
    gulp.watch(settings.SourcePath("Templates", "**"), Templates);
    gulp.watch(settings.TypeScriptProjectRoot("**"), Library);
}
Watch["description"] = "Builds the project in watch-mode";

export default Build;
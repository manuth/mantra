import browserify from "browserify";
import gulp from "gulp";
import Path from "path";
import tsify from "tsify";
import source from "vinyl-source-stream";
import { Settings } from "./.gulp/Settings";

let settings = new Settings();

export let Build = gulp.parallel(
    Library,
    Templates);
Build["description"] = "Builds the project";

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
}

export default Build;
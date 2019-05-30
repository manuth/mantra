import gulp from "gulp";
import Path from "path";
import { Settings } from "./.gulp/Settings";

let settings = new Settings();

export let Build = gulp.parallel(
    Templates);
Build["description"] = "Builds the project";

export function Templates()
{
    return gulp.src(
        settings.SourcePath("templates", "**")).pipe(
            gulp.dest("templates"));
}
Templates["description"] = "Build the templates";


export function Watch()
{
    gulp.watch(settings.SourcePath("templates", "**"), Templates);
}

export default Build;
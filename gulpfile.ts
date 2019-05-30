import gulp from "gulp";
import { Settings } from "./.gulp/Settings";

let settings = new Settings();

export let Build = gulp.parallel(
    Templates);
Build["description"] = "Builds the project";

export function Templates()
{
    return gulp.src(
        `${settings.SourcePath("templates")}/**`).pipe(
            gulp.dest("templates"));
}
Templates["description"] = "Build the templates";

export default Build;
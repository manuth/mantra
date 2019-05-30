import Path from "path";

/**
 * Provides settings for `gulp`.
 */
export class Settings
{
    /**
     * Gets the path to the source-directory.
     */
    private readonly sourcePath: string = "src";

    /**
     * Gets the path to the destination-directory.
     */
    private readonly destinationPath: string = "lib";

    /**
     * Gets the path to the assets-directory.
     */
    private readonly assetsPath: string = "assets";

    /**
     * Gets the path to the JavaScript-directory.
     */
    private readonly javaScriptPath: string = "js";

    /**
     * Gets or sets the name of the TypeScript project-root.
     */
    private readonly typeScriptProjectRoot: string = "App";

    /**
     * Gets the path to a temporary directory.
     */
    private readonly tempPath: string = "obj";

    /**
     * Initializes a new instance of the `Settings` class.
     */
    public constructor()
    { }

    /**
     * Creates a path relative to the source-directory.
     *
     * @param path
     * The path to join.
     */
    public SourcePath(...path: string[])
    {
        return Path.posix.join(this.sourcePath, ...path);
    }

    /**
     * Creates a path relative to the destination-directory.
     *
     * @param path
     * The path to join.
     */
    public DestinationPath(...path: string[])
    {
        return Path.posix.join(this.destinationPath, ...path);
    }

    /**
     * Creates a path relative to the assets-directory.
     *
     * @param path
     * The path to join.
     *
     * @return
     * The joined path.
     */
    public AssetsPath(...path: string[])
    {
        return this.DestinationPath(this.assetsPath, ...path);
    }

    /**
     * Creates a path relative to the JavaScript-directory.
     *
     * @param path
     * The path to join.
     */
    public JavaScriptPath(...path: string[])
    {
        return this.AssetsPath(this.javaScriptPath, ...path);
    }

    /**
     * Creates a path relative to the TypeScript project-root.
     *
     * @param path
     * The path to join.
     */
    public TypeScriptProjectRoot(...path: string[])
    {
        return this.SourcePath(this.typeScriptProjectRoot, ...path);
    }

    /**
     * Creates a path relative to the TypeScript project-root.
     *
     * @param path
     * The path to join.
     */
    public TypeScriptPath(...path: string[])
    {
        return this.TypeScriptProjectRoot(this.SourcePath(...path));
    }

    /**
     * Creates a path relative to the temporary directory.
     *
     * @param path
     * The path to join.
     */
    public TempPath(...path: string[])
    {
        return Path.posix.join(this.tempPath, ...path);
    }
}
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
        return Path.join(this.sourcePath, ...path);
    }

    /**
     * Creates a path relative to the destination-directory.
     *
     * @param path
     * The path to join.
     */
    public DestinationPath(...path: string[])
    {
        return Path.join(this.destinationPath, ...path);
    }

    /**
     * Creates a path relative to the temporary directory.
     *
     * @param path
     * The path to join.
     */
    public TempPath(...path: string[])
    {
        return Path.join(this.tempPath, ...path);
    }
}
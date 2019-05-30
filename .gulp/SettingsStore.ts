import { Settings } from "./Settings";

/**
 * Provides settings.
 */
export class SettingsStore
{
    /**
     * Loads settings for the specified target.
     *
     * @param target
     * The target to load the settings for.
     *
     * @return
     * The settings for the specified `target`.
     */
    public static Load(target?: string)
    {
        let settings = new Settings(target || "Debug");
        settings.Debug = settings.Target === "Debug";
        return settings;
    }
}
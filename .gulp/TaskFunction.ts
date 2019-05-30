declare global
{
    interface Function
    {
        /**
         * The human-readable name of the function.
         */
        displayName: string;

        /**
         * The description of the function.
         */
        description: string;
    }
}

export {};
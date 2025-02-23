export const toolsDefinition = [
  {
    type: "function" as const,
    function: {
      name: "display_translation_options",
      description: `Display a list of translation options, works best with 3-5 options.`,
      parameters: {
        type: "object",
        properties: {
          translations: {
            type: "array",
            items: {
              type: "string",
            },
            description: "List of translation options",
          },
        },
      },
    },
  },
];

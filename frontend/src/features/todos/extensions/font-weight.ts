import { Extension } from "@tiptap/core";


declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontWeight: {
      setFontWeight: (weight: string) => ReturnType;
      unsetFontWeight: () => ReturnType;
    };
  }
}

interface FontWeightOptions {
  types: string[];
}

export const FontWeight = Extension.create<FontWeightOptions>({
  name: "fontWeight",

  addOptions() {
    return { types: ["textStyle"] };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontWeight: {
            default: null,
            parseHTML: (element) => element.style.fontWeight || null,
            renderHTML: (attributes) => {
              if (!attributes.fontWeight) return {};
              return { style: `font-weight: ${attributes.fontWeight}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontWeight:
        (weight: string) =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontWeight: weight }).run(),
      unsetFontWeight:
        () =>
        ({ chain }) =>
          chain()
            .setMark("textStyle", { fontWeight: null })
            .removeEmptyTextStyle()
            .run(),
    };
  },
});

import { Json } from "@/supabase/supabase";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface Props {
  content: JSONContent | Json;
}

export const ProductDescription = ({ content }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content as JSONContent,
    editable: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none sm:prose-base dark:prose-invert prose-p:text-choco dark:prose-p:text-cream",
      },
    },
  });

  return (
    <div className="px-4">
      <EditorContent editor={editor} />
    </div>
  );
};

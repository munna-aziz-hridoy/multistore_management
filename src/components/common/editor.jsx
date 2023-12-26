"use client";

import React from "react";

import { Editor } from "@tinymce/tinymce-react";

function RichEditor({
  setContent,
  prevContent,
  small = false,
  medium = false,
  large = false,
}) {
  const handleContent = (content) => {
    setContent && setContent(content);
  };

  return (
    <div>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_EDITOR_API}
        onEditorChange={handleContent}
        initialValue={prevContent || "<p>Start writing from here</p>"}
        init={{
          height: small ? 250 : medium ? 350 : large ? 700 : 450,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
    </div>
  );
}

export default RichEditor;

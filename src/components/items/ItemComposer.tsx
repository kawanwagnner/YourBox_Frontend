// Formulário texto/arquivo
import React from "react";
import { useCreateItem } from "../../pages/items.query";

export default function ItemComposer({ spaceId }: { spaceId: string }) {
  const [text, setText] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const createItem = useCreateItem(spaceId);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text && !file) return;
    try {
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        if (text) fd.append("content", text);
        await createItem.mutateAsync(fd);
      } else {
        await createItem.mutateAsync({ content: text });
      }
      setText("");
      setFile(null);
    } catch {}
  };

  return (
    <form className="item-composer flex flex-col gap-2" onSubmit={onSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Texto"
        className="rounded p-2"
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        type="submit"
        className="rounded bg-blue-600 text-white px-3 py-1"
      >
        Enviar
      </button>
    </form>
  );
}

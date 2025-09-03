// Card de item
import { formatDate } from "../../utils/time";

export default function ItemCard({
  item,
  onDelete,
}: {
  item: any;
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="item-card p-4 bg-white rounded-2xl shadow">
      <div className="flex justify-between items-start">
        <div>
          {item.content && (
            <p className="whitespace-pre-wrap">{item.content}</p>
          )}
          {item.fileUrl && (
            <a
              href={item.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-600"
            >
              Baixar arquivo
            </a>
          )}
          <div className="text-xs text-gray-500 mt-2">
            {item.author?.name || item.author?.email} ·{" "}
            {formatDate(item.createdAt)}
          </div>
        </div>
        <div>
          <button
            className="text-red-500 text-sm"
            onClick={() => onDelete?.(item._id)}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// Lista de itens
import ItemCard from "./ItemCard";

export default function ItemList({
  items,
  onDelete,
}: {
  items: any[];
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="item-list grid gap-3">
      {items.map((item) => (
        <ItemCard key={item._id} item={item} onDelete={onDelete} />
      ))}
    </div>
  );
}

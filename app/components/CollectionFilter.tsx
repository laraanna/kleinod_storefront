export function CollectionFilter({
  sortBy, // The current sort value
  onSortChange, // The function to update the sort value
}: {
  sortBy: string;
  onSortChange: (sortKey: string) => void;
}) {
  const onSortParam = (e: React.MouseEvent<HTMLLIElement>) => {
    const sortKey = e.currentTarget.getAttribute('data-sort-key');

    if (sortKey) {
      // Call the parent's function to update the URL
      onSortChange(sortKey);
    }
  };

  return (
    <div className="collection-filter">
      <p>Sort By</p>
      <ul>
        <li
          data-sort-key="TITLE"
          onClick={onSortParam}
          style={{fontWeight: sortBy === 'TITLE' ? 'bold' : 'normal'}}
        >
          Title
        </li>
        <li
          data-sort-key="PRICE"
          onClick={onSortParam}
          style={{fontWeight: sortBy === 'PRICE' ? 'bold' : 'normal'}}
        >
          Price
        </li>
      </ul>
    </div>
  );
}

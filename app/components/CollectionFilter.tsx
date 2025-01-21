import {categories, materials} from '~/filterData';

interface CollectionFilterProps {
  selectedCategory: string | null;
  selectedMaterial: string | null;
  selectedSortBy: string | undefined;
  onSortChange: (sortKey: string) => void;
  onMaterialChange: (material: string) => void;
  onCategoryChange: (category: string) => void;
}

export function CollectionFilter({
  selectedCategory,
  selectedMaterial,
  selectedSortBy,
  onSortChange,
  onMaterialChange,
  onCategoryChange,
}: CollectionFilterProps) {
  const handleCategoryChange = (category: string) => {
    onCategoryChange(category);
  };

  const handleMaterialChange = (material: string) => {
    onMaterialChange(material);
  };

  const handleSortChange = (sortKey: string) => {
    onSortChange(sortKey); // Update the sort by option
  };

  return (
    <div className="collection-filter">
      {/* Category Filter */}
      <ul>
        <li>
          <button
            onClick={() => handleCategoryChange('all')}
            className={selectedCategory === 'all' ? 'active' : ''}
          >
            All Categories
          </button>
        </li>
        {/* Add categories dynamically */}
        {categories.map((category) => (
          <li key={category.id}>
            <button
              onClick={() => handleCategoryChange(category.id)}
              className={selectedCategory === category.id ? 'active' : ''}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>

      {/* Material Filter */}
      <ul>
        <button
          onClick={() => handleMaterialChange('all')}
          className={selectedMaterial === 'all' ? 'active' : ''}
        >
          All Materials
        </button>
        {materials.map((material) => (
          <li key={material.id}>
            <button
              onClick={() => handleMaterialChange(material.id)}
              className={selectedMaterial === material.id ? 'active' : ''}
            >
              {material.name}
            </button>
          </li>
        ))}
      </ul>

      {/* Sort By Filter */}
      <ul>
        <li>
          <button
            onClick={() => handleSortChange('TITLE')}
            className={selectedSortBy === 'TITLE' ? 'active' : ''}
          >
            Title
          </button>
        </li>
        <li>
          <button
            onClick={() => handleSortChange('PRICE')}
            className={selectedSortBy === 'PRICE' ? 'active' : ''}
          >
            Price
          </button>
        </li>
      </ul>
    </div>
  );
}

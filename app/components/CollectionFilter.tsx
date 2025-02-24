import {categories, materials} from '~/filterData';
import {useState} from 'react';
import useMediaQuery from '../helper/matchMedia';

interface CollectionFilterProps {
  selectedCategory: string | null;
  selectedMaterial: string | null;
  selectedSortBy: string | undefined;
  onSortChange: (sortKey: string) => void;
  onMaterialChange: (material: string) => void;
  onCategoryChange: (category: string) => void;
  onResetFilter: (material: string, category: string) => void;
}

type StateFilterType =
  | 'material'
  | 'category'
  | 'sortBy'
  | 'inactive'
  | 'catmat';

export function CollectionFilter({
  selectedCategory,
  selectedMaterial,
  selectedSortBy,
  onSortChange,
  onMaterialChange,
  onCategoryChange,
  onResetFilter,
}: CollectionFilterProps) {
  const [stateFilter, setStateFilter] = useState<StateFilterType>('inactive');

  const handleCategoryChange = (category: string) => {
    onCategoryChange(category);
  };

  const handleMaterialChange = (material: string) => {
    onMaterialChange(material);
  };

  const handleReset = (material: string, category: string) => {
    onResetFilter(material, category);
  };

  const handleSortChange = (sortKey: string) => {
    onSortChange(sortKey); // Update the sort by option
  };

  const isLargeScreen = useMediaQuery('(min-width: 45em)');

  const svgCircle = (
    <svg
      width={8}
      height={8}
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="4" cy="4" r="4" fill="white" />
    </svg>
  );

  return (
    <div className="collection-filter">
      <div className="collection-filter--wrapper">
        <div className="collection-filter--header">
          <h5 onClick={() => setStateFilter('catmat')}> Filter by</h5>
          {/* Material Filter */}
          <div
            className="selectionBox"
            role="button"
            tabIndex={0}
            onClick={() => setStateFilter('material')}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setStateFilter('material');
              }
            }}
          >
            <div>
              {selectedMaterial === null || selectedMaterial === 'all'
                ? 'Material'
                : selectedMaterial}
            </div>
          </div>
          {/* Category Filter */}
          <div
            className="selectionBox"
            role="button"
            tabIndex={0}
            onClick={() => setStateFilter('category')}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setStateFilter('category');
              }
            }}
          >
            <div>
              {selectedCategory === null || selectedCategory === 'all'
                ? 'Category'
                : selectedCategory}
            </div>
          </div>

          {((selectedCategory !== null && selectedCategory !== 'all') ||
            (selectedMaterial !== null && selectedMaterial !== 'all')) && (
            <div
              role="button"
              tabIndex={0}
              className="btn-clear"
              onClick={() => {
                handleReset('all', 'all');
                setStateFilter('inactive');
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleMaterialChange('all');
                  handleCategoryChange('all');
                  setStateFilter('inactive');
                }
              }}
            >
              Clear all
            </div>
          )}

          <h5 onClick={() => setStateFilter('sortBy')}> Sort by</h5>
          <div
            className="selectionBox"
            role="button"
            tabIndex={0}
            onClick={() => setStateFilter('sortBy')}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setStateFilter('sortBy');
              }
            }}
          >
            <div>
              {selectedSortBy === null || selectedSortBy === 'Title'
                ? 'Category'
                : selectedSortBy}
            </div>
          </div>
          {stateFilter !== 'inactive' && (
            <div
              className=""
              role="button"
              tabIndex={0}
              onClick={() => setStateFilter('inactive')}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setStateFilter('inactive');
                }
              }}
            >
              <div>X</div>
            </div>
          )}
        </div>
        <div className="collection-filter--options">
          {/* Material Filter */}
          {(stateFilter === 'material' || stateFilter === 'catmat') && (
            <div className="selectionBox-items materials">
              <div>
                <h5>Material</h5>
              </div>

              <button
                onClick={() => handleMaterialChange('all')}
                className={selectedMaterial === 'all' ? 'active' : ''}
              >
                <span>All Materials</span>
                {svgCircle}
              </button>
              {materials.map((material) => (
                <button
                  key={material.id}
                  onClick={() => handleMaterialChange(material.id)}
                  className={selectedMaterial === material.id ? 'active' : ''}
                >
                  <span>{material.name}</span>
                  {svgCircle}
                </button>
              ))}
            </div>
          )}
          {/* Categories Filter */}
          {(stateFilter === 'category' || stateFilter === 'catmat') && (
            <div className="selectionBox-items categories">
              <div>
                <h5>Category</h5>
              </div>
              <button
                onClick={() => handleCategoryChange('all')}
                className={selectedCategory === 'all' ? 'active' : ''}
              >
                <span>All Categories</span>
                {svgCircle}
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={selectedCategory === category.id ? 'active' : ''}
                >
                  <span>{category.name}</span>
                  {svgCircle}
                </button>
              ))}
            </div>
          )}
          {/* Sortby Filter */}
          {stateFilter === 'sortBy' && (
            <div className="selectionBox-items sortby">
              <button
                onClick={() => handleSortChange('TITLE')}
                className={selectedSortBy === 'TITLE' ? 'active' : ''}
              >
                <span>Title</span>
                {svgCircle}
              </button>
              <button
                onClick={() => handleSortChange('PRICE')}
                className={selectedSortBy === 'PRICE' ? 'active' : ''}
              >
                <span>Price</span>
                {svgCircle}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

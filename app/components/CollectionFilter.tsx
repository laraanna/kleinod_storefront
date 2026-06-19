import {categories, materials} from '~/filterData';
import {useState, useEffect, useRef} from 'react';
import useMediaQuery from '../helper/matchMedia';
import {useTranslation} from 'react-i18next';

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
  const filterRef = useRef<HTMLDivElement>(null); // Create a ref for the filter container

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setStateFilter('inactive');
      }
    }

    if (stateFilter !== 'inactive') {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [stateFilter]);

  const {t} = useTranslation();

  return (
    <div className="collection-filter" ref={filterRef}>
      <div
        className={`collection-filter--wrapper ${
          stateFilter === 'inactive' ? '' : 'active'
        }`}
      >
        <div className="collection-filter--header">
          <h5
            role="button"
            tabIndex={0}
            onClick={() => setStateFilter('catmat')}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setStateFilter('catmat');
              }
            }}
          >
            {' '}
            {t('collection-filter.general.filter-by')}
          </h5>
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
                ? t('collection-filter.general.material')
                : t(`collection-filter.filters.materials.${selectedMaterial}`)}
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
                ? t('collection-filter.general.category')
                : t(`collection-filter.filters.categories.${selectedCategory}`)}
            </div>
          </div>

          <div
            role="button"
            tabIndex={0}
            className={`btn-clear ${
              (selectedCategory !== null && selectedCategory !== 'all') ||
              (selectedMaterial !== null && selectedMaterial !== 'all')
                ? 'active'
                : ''
            }`}
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
            {t('collection-filter.general.clear-all')}
          </div>
          {/* )} */}

          <h5
            role="button"
            tabIndex={0}
            onClick={() => setStateFilter('sortBy')}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setStateFilter('sortBy');
              }
            }}
          >
            {' '}
            {t('collection-filter.general.sort-by')}
          </h5>
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
              {selectedSortBy === null || selectedSortBy === 'TITLE'
                ? t('collection-filter.filters.sortby.title')
                : t('collection-filter.filters.sortby.price')}
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
                <h5>{t('collection-filter.general.material')}</h5>
              </div>

              <button
                onClick={() => handleMaterialChange('all')}
                className={selectedMaterial === 'all' ? 'active' : ''}
              >
                <span>
                  {t('collection-filter.filters.materials.all-materials')}
                </span>
                {svgCircle}
              </button>
              {materials.map((material) => (
                <button
                  key={material.id}
                  onClick={() => handleMaterialChange(material.id)}
                  className={selectedMaterial === material.id ? 'active' : ''}
                >
                  <span>
                    {t(`collection-filter.filters.materials.${material.id}`)}
                  </span>
                  {svgCircle}
                </button>
              ))}
            </div>
          )}
          {/* Categories Filter */}
          {(stateFilter === 'category' || stateFilter === 'catmat') && (
            <div className="selectionBox-items categories">
              <div>
                <h5>{t('collection-filter.general.category')}</h5>
              </div>
              <button
                onClick={() => handleCategoryChange('all')}
                className={selectedCategory === 'all' ? 'active' : ''}
              >
                <span>
                  {t('collection-filter.filters.categories.all-categories')}
                </span>
                {svgCircle}
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={selectedCategory === category.id ? 'active' : ''}
                >
                  <span>
                    {t(`collection-filter.filters.categories.${category.id}`)}
                  </span>
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
                <span>{t('collection-filter.filters.sortby.title')}</span>
                {svgCircle}
              </button>
              <button
                onClick={() => handleSortChange('PRICE')}
                className={selectedSortBy === 'PRICE' ? 'active' : ''}
              >
                <span>{t('collection-filter.filters.sortby.price')}</span>
                {svgCircle}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

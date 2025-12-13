import { categories } from "../../data/mockData";
import { searchVideos } from "../../redux/searchSlice";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../redux/store";
import { useState } from "react";

export const CategoryPills = () => {
    const [activeCategory, setActiveCategory] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();
    const handleCategoryClick = (category: string) => {
        setActiveCategory(category);
        dispatch(searchVideos(category));
    }
    return (
        <div className="flex overflow-x-auto gap-3 scrollbar-hide w-full mask-linear">
            <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`${category === activeCategory ? 'bg-black text-white' : 'bg-gray-100/80 hover:bg-gray-200'} px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

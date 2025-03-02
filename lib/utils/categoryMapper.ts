import { categories } from '@/components/ExpenseForm'; // Import your categories

// Function to find the best matching category
export function findMatchingCategory(input: string): { 
  category: string, 
  categoryDetail: string 
} {
  // Default fallback
  let result = { category: 'Other', categoryDetail: 'Other: Miscellaneous' };
  
  // Normalize input
  const normalizedInput = input.toLowerCase().trim();
  
  // Direct category match
  for (const [category, subcategories] of Object.entries(categories)) {
    // Check if input matches category name
    if (category.toLowerCase().includes(normalizedInput) || 
        normalizedInput.includes(category.toLowerCase())) {
      return {
        category,
        categoryDetail: `${category}: ${subcategories[0]}`
      };
    }
    
    // Check if input matches any subcategory
    for (const subcategory of subcategories) {
      if (subcategory.toLowerCase().includes(normalizedInput) || 
          normalizedInput.includes(subcategory.toLowerCase())) {
        return {
          category,
          categoryDetail: `${category}: ${subcategory}`
        };
      }
    }
  }
  
  // Additional synonym matching could be implemented here
  // using your existing categorySearchSynonyms
  
  return result;
} 
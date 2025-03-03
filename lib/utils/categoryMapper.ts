// Don't import categories directly from ExpenseForm
// Instead, define them here or import from a common location
const categories = [
  'Food',
  'Transportation',
  'Entertainment',
  'Housing',
  'Utilities',
  'Healthcare',
  'Shopping',
  'Other'
];

export function mapToCategory(text: string): { 
  category: string;
  categoryDetail?: string;
} {
  // Convert to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase();
  
  // Handle array-like input (might be from CSV)
  if (typeof text === 'string' && text.includes('[') && text.includes(']')) {
    try {
      const parsed = JSON.parse(text.replace(/'/g, '"'));
      if (Array.isArray(parsed) && parsed.length > 0) {
        const category = parsed[0].split(':')[0] || 'Other';
        return {
          category,
          categoryDetail: parsed[0]
        };
      }
    } catch (e) {
      // If parsing fails, continue with regular text matching
      console.error("Failed to parse array-like input:", e);
    }
  }
  
  // Try to match against known categories
  for (const category of categories) {
    const lowerCategory = category.toLowerCase();
    
    // Direct match with a main category
    if (lowerText === lowerCategory || lowerText.includes(lowerCategory)) {
      return { category };
    }
    
    // Check for subcategories if they're defined
    const subcategoriesMap: Record<string, string[]> = {
      'Food': ['Groceries', 'Restaurant', 'Fast Food', 'Coffee'],
      'Transportation': ['Fuel', 'Public Transit', 'Taxi', 'Car Maintenance'],
      // Add more mappings as needed
    };
    
    const subcategories = subcategoriesMap[category] || [];
    
    for (const subcategory of subcategories) {
      const lowerSubcategory = subcategory.toLowerCase();
      if (lowerText.includes(lowerSubcategory)) {
        return {
          category,
          categoryDetail: `${category}: ${subcategory}`
        };
      }
    }
  }
  
  // Default fallback
  return { category: 'Other' };
} 
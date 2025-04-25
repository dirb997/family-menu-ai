/**
 * Custom plugin to preprocess JSON files and sanitize them before parsing
 * This removes comments and ensures valid JSON
 */
export default function jsonPreprocessor() {
  return {
    name: 'json-preprocessor',
    
    // Transform runs before the json plugin does its parsing
    transform(code, id) {
      // Only process JSON files
      if (!id.endsWith('.json')) {
        return null;
      }
      
      try {
        // Try to parse the JSON to check if it's valid
        JSON.parse(code);
        return null; // If valid, let vite handle it normally
      } catch (error) {
        console.warn(`Preprocessing JSON file: ${id}`);
        
        // Remove potential comments (// and /* */ style)
        let sanitized = code
          .replace(/\/\/.*$/gm, '') // Remove line comments
          .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove block comments
        
        // Ensure no BOM or other invisible characters
        sanitized = sanitized.trim();
        
        try {
          // Validate the sanitized JSON
          JSON.parse(sanitized);
          return {
            code: sanitized,
            map: null
          };
        } catch (error) {
          console.error(`Failed to sanitize JSON file: ${id}`, error);
          
          // As a last resort, try a more aggressive approach:
          // Extract what looks like valid JSON
          const jsonMatch = sanitized.match(/(\{[\s\S]*\})/);
          if (jsonMatch && jsonMatch[1]) {
            try {
              JSON.parse(jsonMatch[1]);
              return {
                code: jsonMatch[1],
                map: null
              };
            } catch (e) {
              console.error(`Could not salvage JSON from ${id}`);
            }
          }
          
          // If we can't fix it, let Vite handle the error
          return null;
        }
      }
    }
  };
}
import { categories, pointValues } from '../data/mockQuestions';

/**
 * Converts a category and points value to board coordinates
 * @param category - The category name (e.g., 'HTML', 'CSS', etc.)
 * @param points - The point value (100, 200, 300, 400, or 500)
 * @returns An object containing the column and row indices (0-based)
 * @throws Error if category or points are invalid
 */
export function getBoardCoordinates(category: string, points: number): { col: number; row: number } {
  const colIndex = categories.indexOf(category);
  const rowIndex = pointValues.indexOf(points);

  if (colIndex === -1) {
    throw new Error(`Invalid category: ${category}`);
  }
  if (rowIndex === -1) {
    throw new Error(`Invalid points value: ${points}`);
  }

  return {
    col: colIndex,
    row: rowIndex
  };
} 
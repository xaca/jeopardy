export interface QuestionData {
  category: string;
  points: number;
  question: string;
  answer: string;
}

export interface QuestionsData {
  [key: string]: {
    [key: number]: QuestionData;
  };
}

export const categories = ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript'];
export const pointValues = [100, 200, 300, 400, 500];

export const questionsData: QuestionsData = {
  'HTML': {
    100: { category: 'HTML', points: 100, question: 'This tag is used to create a hyperlink', answer: 'What is <a>?' },
    200: { category: 'HTML', points: 200, question: 'This meta tag ensures proper rendering on mobile devices', answer: 'What is viewport?' },
    300: { category: 'HTML', points: 300, question: 'This semantic element represents a standalone section of content', answer: 'What is <article>?' },
    400: { category: 'HTML', points: 400, question: 'This attribute is used to specify custom data attributes', answer: 'What is data-*?' },
    500: { category: 'HTML', points: 500, question: 'This element is used to draw graphics on the webpage', answer: 'What is <canvas>?' },
  },
  'CSS': {
    100: { category: 'CSS', points: 100, question: 'This property is used to change the text color', answer: 'What is color?' },
    200: { category: 'CSS', points: 200, question: 'This display value makes an element disappear from the page', answer: 'What is none?' },
    300: { category: 'CSS', points: 300, question: 'This positioning value removes an element from the normal document flow', answer: 'What is absolute?' },
    400: { category: 'CSS', points: 400, question: 'This unit is relative to the font-size of the root element', answer: 'What is rem?' },
    500: { category: 'CSS', points: 500, question: 'This property is used to create a grid container', answer: 'What is display: grid?' },
  },
  'JavaScript': {
    100: { category: 'JavaScript', points: 100, question: 'This operator is used for strict equality comparison', answer: 'What is ===' },
    200: { category: 'JavaScript', points: 200, question: 'This method creates a new array with the results of calling a function for every array element', answer: 'What is map()?' },
    300: { category: 'JavaScript', points: 300, question: 'This keyword is used to declare variables that cannot be reassigned', answer: 'What is const?' },
    400: { category: 'JavaScript', points: 400, question: 'This object method creates a shallow copy of an array', answer: 'What is Object.assign()?' },
    500: { category: 'JavaScript', points: 500, question: 'This feature allows you to extract array elements or object properties into distinct variables', answer: 'What is destructuring?' },
  },
  'React': {
    100: { category: 'React', points: 100, question: 'This hook is used to handle side effects in function components', answer: 'What is useEffect?' },
    200: { category: 'React', points: 200, question: 'This method is called just before a component is unmounted', answer: 'What is componentWillUnmount?' },
    300: { category: 'React', points: 300, question: 'This prop is used to pass content between component tags', answer: 'What is children?' },
    400: { category: 'React', points: 400, question: 'This technique is used to prevent unnecessary re-renders of components', answer: 'What is memoization?' },
    500: { category: 'React', points: 500, question: 'This pattern is used to share behavior between components', answer: 'What is render props?' },
  },
  'TypeScript': {
    100: { category: 'TypeScript', points: 100, question: 'This type represents a value that could be one of several types', answer: 'What is union type?' },
    200: { category: 'TypeScript', points: 200, question: 'This keyword is used to define a custom type', answer: 'What is interface?' },
    300: { category: 'TypeScript', points: 300, question: 'This operator is used to assert a type', answer: 'What is as?' },
    400: { category: 'TypeScript', points: 400, question: 'This utility type makes all properties of a type optional', answer: 'What is Partial<T>?' },
    500: { category: 'TypeScript', points: 500, question: 'This feature allows you to create a type that depends on another type', answer: 'What is generics?' },
  },
}; 
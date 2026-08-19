/**
 * Registry of full teaching modules, keyed by course id.
 *
 * A course in the catalogue may or may not have a module. Add new modules here
 * and set `hasModule: true` on the matching entry in src/data/courses.js.
 */
import researchMethodsModule from './research-methods';
import quantitativeAnalysisModule from './quantitative-analysis';

const modulesByCourse = {
  'research-methods-design': researchMethodsModule,
  'quantitative-data-analysis': quantitativeAnalysisModule
};

/** Directory under public/materials where a course's generated files live. */
export const materialsFolderByCourse = {
  'research-methods-design': 'research-methods',
  'quantitative-data-analysis': 'quantitative-analysis'
};

export const getModule = (courseId) => modulesByCourse[courseId] || null;

export default modulesByCourse;

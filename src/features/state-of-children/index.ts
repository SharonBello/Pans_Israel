// ==========================================================================
// State of Children 2025 Survey - Main Exports
// ==========================================================================

// Pages
export { default as SOCSurveyPage } from './pages/SOCSurveyPage/SOCSurveyPage';
export { default as SOCResultsPage } from './pages/SOCResultsPage/SOCResultsPage';
export { default as SOCAdminPage } from './pages/SOCAdminPage/SOCAdminPage';

// Data
export { 
    socCategories, 
    socSurveyDefinition, 
    getAllQuestions,
    getQuestionById,
    getCategoryById,
    getTotalQuestionCount,
} from './data/socQuestions';

// Types
export * from './types/socTypes';

// Constants
export { SOC_SURVEY_ID, SOC_SURVEY_SLUG, SOC_SURVEY_VERSION } from './types/socTypes';

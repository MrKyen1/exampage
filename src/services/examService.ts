import { ExamData } from '../features/exam/types';

export const examService = {
  /**
   * Fetches exam data from a JSON file.
   * In a real application, this could fetch from a real backend API.
   */
  async fetchExamData(): Promise<ExamData> {
    try {
      const response = await fetch('/exam-data.json');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: ExamData = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching exam data:', error);
      throw error;
    }
  },
  
  /**
   * Stub function demonstrating how PDF to JSON might be implemented.
   * E.g., uploading the file to a backend which uses Gemini API, returning parsed JSON.
   */
  async convertPdfToJson(file: File): Promise<ExamData> {
    // In a real scenario, you'd send `file` via FormData to your /api/parse-pdf endpoint
    // which securely holds your GEMINI_API_KEY and processes the document.
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'mock_converted_exam',
          title: 'Đề thi trích xuất từ PDF (Mock)',
          timeLimit: 2700,
          questions: []
        });
      }, 1500);
    });
  }
};

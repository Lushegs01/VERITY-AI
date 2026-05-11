export const mockStats = {
  balance: 15000,
  totalVerifications: 47,
  verified: 38,
  flagged: 9,
};

export const mockVerifications = [
  { id: 'v1', type: 'BSc Computer Science', institution: 'University of Lagos', date: '2024-05-08', score: 95, status: 'verified' },
  { id: 'v2', type: 'MSc Data Science', institution: 'Covenant University', date: '2024-05-07', score: 42, status: 'suspicious' },
  { id: 'v3', type: 'BEng Civil Engineering', institution: 'Obafemi Awolowo University', date: '2024-05-06', score: 88, status: 'verified' },
  { id: 'v4', type: 'Professional Certificate', institution: 'LBS Nigeria', date: '2024-05-05', score: 12, status: 'fake' },
  { id: 'v5', type: 'BSc Accounting', institution: 'University of Ibadan', date: '2024-05-04', score: 91, status: 'verified' },
  { id: 'v6', type: 'Diploma in Law', institution: 'University of Benin', date: '2024-05-03', score: 76, status: 'verified' },
  { id: 'v7', type: 'MBA', institution: 'Lagos Business School', date: '2024-05-02', score: 98, status: 'verified' },
  { id: 'v8', type: 'BSc Economics', institution: 'Ahmadu Bello University', date: '2024-05-01', score: 35, status: 'suspicious' },
  { id: 'v9', type: 'MSc Architecture', institution: 'Enugu State University', date: '2024-04-30', score: 92, status: 'verified' },
  { id: 'v10', type: 'BSc Microbiology', institution: 'University of Port Harcourt', date: '2024-04-29', score: 89, status: 'verified' },
];

export const mockTransactions = [
  { id: 't1', date: '2024-05-08', amount: 5000, type: 'credit', ref: 'SQ-12345678' },
  { id: 't2', date: '2024-05-05', amount: 2000, type: 'debit', ref: 'VF-87654321' },
  { id: 't3', date: '2024-05-01', amount: 10000, type: 'credit', ref: 'SQ-99887766' },
  { id: 't4', date: '2024-04-25', amount: 3000, type: 'debit', ref: 'VF-11223344' },
  { id: 't5', date: '2024-04-20', amount: 5000, type: 'credit', ref: 'SQ-55443322' },
];

export const mockChartData = [
  { date: '05/03', verified: 4, flagged: 1 },
  { date: '05/04', verified: 6, flagged: 0 },
  { date: '05/05', verified: 3, flagged: 2 },
  { date: '05/06', verified: 8, flagged: 1 },
  { date: '05/07', verified: 5, flagged: 3 },
  { date: '05/08', verified: 7, flagged: 0 },
  { date: '05/09', verified: 5, flagged: 2 },
];

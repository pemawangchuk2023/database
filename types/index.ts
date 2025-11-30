// Document Types
export interface Document {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  filePath: string;
  documentType: DocumentType;
  category: string;
  tags: string[];
  uploadedBy: string;
  uploadedAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
  accessLevel: 'public' | 'internal' | 'confidential';
  version: number;
}

export interface DocumentType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  avatar?: string;
  department?: string;
}

export interface SearchFilters {
  query?: string;
  documentType?: string;
  category?: string;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  uploadedBy?: string;
  status?: Document['status'];
  accessLevel?: Document['accessLevel'];
}

export interface Stats {
  totalDocuments: number;
  documentsThisMonth: number;
  totalCategories: number;
  totalSize: string;
}

// Mock Data for Frontend Demo
export const mockDocumentTypes: DocumentType[] = [
  {
    id: '1',
    name: 'Minutes',
    description: 'Meeting minutes and records',
    icon: 'FileText',
    color: 'blue'
  },
  {
    id: '2',
    name: 'Notifications',
    description: 'Official notifications and announcements',
    icon: 'Bell',
    color: 'yellow'
  },
  {
    id: '3',
    name: 'Reports',
    description: 'Financial and operational reports',
    icon: 'FileBarChart',
    color: 'green'
  },
  {
    id: '4',
    name: 'Circulars',
    description: 'Circulars and policy documents',
    icon: 'FileSpreadsheet',
    color: 'purple'
  },
  {
    id: '5',
    name: 'Contracts',
    description: 'Contracts and agreements',
    icon: 'FileCheck',
    color: 'red'
  },
  {
    id: '6',
    name: 'Budgets',
    description: 'Budget documents and allocations',
    icon: 'DollarSign',
    color: 'emerald'
  }
];

export const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Q4 2024 Financial Report',
    description: 'Comprehensive financial report for the fourth quarter of 2024',
    fileName: 'Q4-2024-Financial-Report.pdf',
    fileSize: 2458624,
    fileType: 'application/pdf',
    filePath: '/uploads/q4-2024-financial-report.pdf',
    documentType: mockDocumentTypes[2],
    category: 'Financial Reports',
    tags: ['quarterly', 'finance', '2024', 'report'],
    uploadedBy: 'John Doe',
    uploadedAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-15'),
    status: 'published',
    accessLevel: 'internal',
    version: 1
  },
  {
    id: '2',
    title: 'Budget Allocation 2025',
    description: 'Annual budget allocation for fiscal year 2025',
    fileName: 'Budget-Allocation-2025.xlsx',
    fileSize: 1024000,
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    filePath: '/uploads/budget-allocation-2025.xlsx',
    documentType: mockDocumentTypes[5],
    category: 'Budget Planning',
    tags: ['budget', '2025', 'planning', 'allocation'],
    uploadedBy: 'Jane Smith',
    uploadedAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-11-22'),
    status: 'published',
    accessLevel: 'confidential',
    version: 2
  },
  {
    id: '3',
    title: 'Board Meeting Minutes - November 2024',
    description: 'Minutes from the monthly board meeting held on November 25, 2024',
    fileName: 'Board-Meeting-Minutes-Nov-2024.pdf',
    fileSize: 512000,
    fileType: 'application/pdf',
    filePath: '/uploads/board-meeting-minutes-nov-2024.pdf',
    documentType: mockDocumentTypes[0],
    category: 'Meeting Records',
    tags: ['meeting', 'minutes', 'board', 'november'],
    uploadedBy: 'Admin User',
    uploadedAt: new Date('2024-11-26'),
    updatedAt: new Date('2024-11-26'),
    status: 'published',
    accessLevel: 'internal',
    version: 1
  },
  {
    id: '4',
    title: 'Policy Update Circular - Remote Work',
    description: 'Updated remote work policy effective December 2024',
    fileName: 'Remote-Work-Policy-Circular.pdf',
    fileSize: 256000,
    fileType: 'application/pdf',
    filePath: '/uploads/remote-work-policy-circular.pdf',
    documentType: mockDocumentTypes[3],
    category: 'HR Policies',
    tags: ['policy', 'circular', 'remote-work', 'hr'],
    uploadedBy: 'HR Manager',
    uploadedAt: new Date('2024-11-28'),
    updatedAt: new Date('2024-11-28'),
    status: 'published',
    accessLevel: 'public',
    version: 1
  },
  {
    id: '5',
    title: 'Vendor Contract - IT Services',
    description: 'Service contract with IT vendor for 2025',
    fileName: 'IT-Vendor-Contract-2025.pdf',
    fileSize: 1536000,
    fileType: 'application/pdf',
    filePath: '/uploads/it-vendor-contract-2025.pdf',
    documentType: mockDocumentTypes[4],
    category: 'Contracts',
    tags: ['contract', 'vendor', 'it', '2025'],
    uploadedBy: 'Procurement Officer',
    uploadedAt: new Date('2024-11-10'),
    updatedAt: new Date('2024-11-12'),
    status: 'published',
    accessLevel: 'confidential',
    version: 1
  },
  {
    id: '6',
    title: 'Annual Audit Notification',
    description: 'Notification for upcoming annual audit scheduled for December 2024',
    fileName: 'Annual-Audit-Notification.pdf',
    fileSize: 128000,
    fileType: 'application/pdf',
    filePath: '/uploads/annual-audit-notification.pdf',
    documentType: mockDocumentTypes[1],
    category: 'Audit',
    tags: ['audit', 'notification', 'annual', '2024'],
    uploadedBy: 'Audit Department',
    uploadedAt: new Date('2024-11-29'),
    updatedAt: new Date('2024-11-29'),
    status: 'published',
    accessLevel: 'internal',
    version: 1
  }
];

export const mockUser: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@finance.gov',
  role: 'admin',
  department: 'Administration'
};

export const mockStats: Stats = {
  totalDocuments: 156,
  documentsThisMonth: 24,
  totalCategories: 12,
  totalSize: '2.4 GB'
};

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
  }
  
  export interface Event {
    id: string;
    occasionType: string;
    brideName: string;
    groomName: string;
    eventDate: string;
    upiId: string;
    userId: string;
    totalAmount: number;
    contributionsCount: number;
    createdAt: {
      _seconds: number;
      _nanoseconds: number;
    };
    updatedAt: {
      _seconds: number;
      _nanoseconds: number;
    };
  }
  
  export interface Contribution {
    id: string;
    name: string;
    amount: number;
    relation: 'bride' | 'groom';
    message?: string;
    createdAt: {
      _seconds: number;
      _nanoseconds: number;
    };
  }
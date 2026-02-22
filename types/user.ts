export interface User {
    id: string; // Firebase Auth UID
    email: string;
    displayName: string;
    photoURL?: string;
    preferences?: {
        dietary?: string;
        notifications?: boolean;
    };
    bookings: string[]; // Array of booking Document IDs
    favorites: string[]; // Array of program Document IDs
    createdAt: Date;
    updatedAt: Date;
    lastLogin: Date;
}

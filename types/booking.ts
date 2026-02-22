export interface Booking {
    id: string; // Document ID
    userId: string;
    programId: string;
    program: {
        // Denormalized
        title: string;
        image: string;
        destination: string;
    };
    startDate: Date;
    endDate: Date;
    duration: 2 | 4;
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        dob: Date;
        nationality: string;
        emergencyContact: {
            name: string;
            phone: string;
            relationship: string;
        };
        dietary: string;
        specialRequests?: string;
    };
    experience: {
        previousExperience: boolean;
        description?: string;
        motivation: string;
        skills: string[];
        source: string;
    };
    travel: {
        arrival: {
            date: Date;
            time: string;
            flightNumber?: string;
        };
        departure: {
            date: Date;
            time: string;
            flightNumber?: string;
        };
        hasInsurance: boolean;
        visaStatus: "have" | "applying" | "need_help";
    };
    pricing: {
        programFee: number;
        processingFee: number;
        total: number;
    };
    payment: {
        intentId?: string;
        amountPaid: number;
        status: "pending" | "paid" | "failed" | "refunded";
        type: "full" | "deposit";
    };
    status: "pending" | "confirmed" | "cancelled" | "completed";
    createdAt: Date;
    updatedAt: Date;
    confirmedAt?: Date;
}

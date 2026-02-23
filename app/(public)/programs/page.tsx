import { fetchProgramsREST } from "@/lib/firebase/firestore-rest";
import { ProgramsClientList } from "./ProgramsClientList";

export default async function ProgramsListingPage() {
    const programs = await fetchProgramsREST();

    return <ProgramsClientList initialPrograms={programs} />;
}

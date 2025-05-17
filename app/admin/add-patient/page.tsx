import { Suspense } from "react";
import AddPatientForm from "./AddPatientForm";

export default function AddPatientPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <AddPatientForm />
    </Suspense>
  );
}

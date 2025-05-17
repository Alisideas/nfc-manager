// app/admin/add-patient/page.tsx
import { Suspense } from "react";
import AddPatientForm from "./AddPatientForm";

export default function AddPatientPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddPatientForm />
    </Suspense>
  );
}

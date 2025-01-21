// types.ts

// Parent type for parents or guardians
export interface Parent {
    id: string;
    full_name: string;
    email?: string;
    phone?: string;
  }
  
  // Student data type

  export interface FormData {
    parents: Parent[]; // Array of selected parents
  }



// Student data type
export interface StudentData {
  student_email: string;
  last_name: string;
  first_name: string;
  other_names: string;
  gender: "M" | "F"; // Gender field can be 'M' or 'F'
  registration_number: string;
  nationality: string;
  date_of_birth: string; // Format 'dd-mm-yyyy'
  blood_group: string;
  id_or_birth_cert_number: string;
  religion: string;
  contact_phone: string;
  province_or_state: string;
  zip_or_lga: string;
  place_of_origin: string;
  permanent_address: string;
  residential_address: string;
  guardian: any[]; // This will hold an array of Parent objects
  profile_pic ?: File | null,

  // Academic session
  student_class?: string;
  academic_session?: string;
  admission_date?: string;
  index_number: string;
  class_division?: string;
  tags : number []
}
  
export interface Class{
  value: string;
  label: string
}
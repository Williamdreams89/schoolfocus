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

export interface SystemSettings {
  id: number;
  active_services: string;
  school_name: string;
  school_motto: string;
  mission: string;
  vision: string;
  core_values: string;
  school_email: string | null;
  school_phone: string | null;
  fees_support_contact: string | null;
  school_address: string;
  country: string;
  city_state: string;
  currency_symbol: string;
  absence_sms_to_parent: boolean;
  head_staff_title: string;
  user: number;
}

export interface Props {
  data: SystemSettings[];
}

export interface AcademicTerm{
  id: any;
  _session: string;
  start_year: string;
  end_year : string;
  is_active: any
}

export interface AcademicSession{
  id: any;
  _session: string;
  start_year: string;
  end_year : string;
  academic_year: string;
  active: boolean
}

export interface TermSessionProps{
  academicSettingsData: AcademicTerm;
  academicSessionSettingsData: AcademicSession
}


// types.ts

// Parent type for parents or guardians
export interface Parent {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  }
  
  // Student data type
  export interface StudentData {
    fatherFullName: string;
    fatherEmail: string;
    fatherPhone: string;
    motherFullName: string;
    motherEmail: string;
    motherPhone: string;
    studentEmail: string;
    surname: string;
    firstName: string;
    otherNames: string;
    gender: "M" | "F"; // Gender field can be 'M' or 'F'
    registrationNumber: string;
    nationality: string;
    dateOfBirth: string; // Format 'dd-mm-yyyy'
    bloodGroup: string;
    idOrBirthCertNumber: string;
    religion: string;
    contactPhone: string;
    provinceOrState: string;
    zipOrLga: string;
    townOfOrigin: string;
    permanentAddress: string;
    residentialAddress: string;
    parents: Parent[]; // This will hold an array of Parent objects
  }
  
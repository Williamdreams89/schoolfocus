import React from 'react'

export const APIContext = React.createContext<APIContextTypes | undefined>(undefined)

interface StudentsManagementDetails{
    isLoading?: boolean;
    getIDForStudentDetailPage?: number | null;
}

interface APIContextTypes{
    studentsManagementDetails : StudentsManagementDetails;
    setStudentsManagementDetails: React.Dispatch<React.SetStateAction<StudentsManagementDetails>>
}




const MyContext = ({children}:{children: React.ReactNode}) =>{
    const [studentsManagementDetails, setStudentsManagementDetails] = React.useState<StudentsManagementDetails>({
        isLoading: false,
        getIDForStudentDetailPage: null
    })
    return <APIContext.Provider value={{studentsManagementDetails, setStudentsManagementDetails}}>
        {children}
    </APIContext.Provider>
}

export default MyContext
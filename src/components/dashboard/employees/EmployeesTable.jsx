"use client";

import { useMemo, useState } from "react";

export default function EmployeesTable() {
    // Static data - replace with API data when endpoint is ready
    const staticData = [
        {
            id: 1,
            employee: "Christina Skentos",
            phone_call: 3,
            zoom_meeting: 2,
            face_to_face: 1,
            email: 2,
            linkedin_message: 0,
            acquaintance: 0
        },
        {
            id: 2,
            employee: "Moustafa Sayed",
            phone_call: 0,
            zoom_meeting: 0,
            face_to_face: 0,
            email: 0,
            linkedin_message: 0,
            acquaintance: 0
        },
        {
            id: 3,
            employee: "Nourel Moulay",
            phone_call: 0,
            zoom_meeting: 0,
            face_to_face: 0,
            email: 0,
            linkedin_message: 0,
            acquaintance: 0
        },
        {
            id: 4,
            employee: "Pretti Nayak",
            phone_call: 0,
            zoom_meeting: 0,
            face_to_face: 1,
            email: 0,
            linkedin_message: 1,
            acquaintance: 0
        },
        {
            id: 5,
            employee: "Sedra Quraid",
            phone_call: 0,
            zoom_meeting: 0,
            face_to_face: 1,
            email: 0,
            linkedin_message: 0,
            acquaintance: 0
        }
    ];

    const [data] = useState(staticData);

    // TODO: Uncomment when API endpoint is ready
    // useEffect(() => {
    //     const fetchEmployees = async () => {
    //         try {
    //             const response = await axios.get('/api/employees');
    //             setData(response.data);
    //         } catch (error) {
    //             console.error('Error fetching employees:', error);
    //         }
    //     };
    //     fetchEmployees();
    // }, []);

    return (
        <>
        <h5 className="mb-3 mt-5"> Activity Breakdown per Employee </h5>
        <div className="table-responsive position-relative">
            <table className="table table-hover align-middle">
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Phone call</th>
                        <th>Zoom meeting</th>
                        <th>Face to face</th>
                        <th>Email</th>
                        <th>Linkedin message</th>
                        <th>Acquaintance</th>
                    </tr>
                </thead>

                <tbody>
                    {!data.length && (
                        <tr>
                            <td colSpan={7} className="text-center text-muted py-4">
                                No employees found
                            </td>
                        </tr>
                    )}

                    {data.map((employee) => (
                        <tr key={employee.id}>
                            <td>
                                <div className="d-flex align-items-center">
                                    <span>{employee.employee}</span>
                                </div>
                            </td>
                            <td>{employee.phone_call}</td>
                            <td>{employee.zoom_meeting}</td>
                            <td>{employee.face_to_face}</td>
                            <td>{employee.email}</td>
                            <td>{employee.linkedin_message}</td>
                            <td>{employee.acquaintance}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
}

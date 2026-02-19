"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ContactListsContext = createContext();

const MOCK_CONTACT_LISTS = [
    { id: 1, title: "Q1 Campaign Leads", description: "Leads from Q1 marketing campaign", created_at: "2026-01-10" },
    { id: 2, title: "Tech Summit Attendees", description: "Contacts gathered at the Tech Summit", created_at: "2026-01-12" },
    { id: 3, title: "Newsletter Subscribers", description: "Regular blog newsletter subscribers", created_at: "2026-01-15" },
    { id: 4, title: "Enterprise Prospects", description: "High-value enterprise target accounts", created_at: "2026-01-18" },
];

export function ContactListsProvider({ children }) {
    const [contacts, setContacts] = useState(MOCK_CONTACT_LISTS);

    /* 
    // 🌐 Future API Integration:
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await api.get("/contact-lists");
                setContacts(res.data);
            } catch (error) {
                console.error("Failed to fetch contact lists:", error);
            }
        };
        // fetchContacts(); 
    }, []);
    */

    return (
        <ContactListsContext.Provider value={{ contacts, setContacts }}>
            {children}
        </ContactListsContext.Provider>
    );
}

export function useContactLists() {
    const context = useContext(ContactListsContext);
    if (!context) {
        throw new Error("useContactLists must be used within a ContactListsProvider");
    }
    return context;
}

import ContactListsClient from "@/components/dashboard/contact-lists/ContactListsClient";
import api from "@/app/api/api"; // 🔌 Import your configured axios instance

/**
 * 🎯 Server Component for Contact Lists Page
 * 
 * Benefits:
 * - Fast initial page load (no hydration delay)
 * - Server-side rendering for better SEO
 * - Ready for async data fetching from API
 * 
 * 🔌 API READY: Replace MOCK_CONTACTS with actual data fetching:
 * 
 * async function getContactLists() {
 *   try {
 *     const res = await api.get('/contact-lists');
 *     return res.data;
 *   } catch (error) {
 *     console.error('Failed to fetch contact lists:', error);
 *     return [];
 *   }
 * }
 * 
 * export default async function ContactListsPage() {
 *   const contacts = await getContactLists();
 *   return <ContactListsClient initialContacts={contacts} />;
 * }
 */

// Mock data - Replace with API call when backend is ready
const MOCK_CONTACTS = [
  {
    id: 1,
    name: "Shaima Al Suwaidi",
    address: "Dubai culture and art authority",
    phone: "+971501014411",
    email: "shaima.alsuwaidi@dubaiculture.ae",
    top_customer: false,
    decision_maker_status: "yes",
    status: "New Lead",
    employee: "Sedra Quraid",
    country: "United Arab Emirates",
    company: "Dubai Culture & Arts Authority",
    budget: "5000",
    avg_stands_year: "2024",
    avg_events_year: "2025",
    company_website_url: "https://example.com",
    job_title: "CEO",
    sector: "Government",
    notes: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    created_at: "2026-01-20"
  },
  {
    id: 2,
    name: "maitha al blooshi",
    address: "Dubai culture and art authority",
    phone: "+971508879993 , +971508879993",
    email: "alblooshi@dubaiculture.gov.ae",
    top_customer: false,
    decision_maker_status: "no",
    status: "New Lead",
    employee: "Sedra Quraid",
    country: "United Arab Emirates",
    company: "Dubai Culture & Arts Authority",
    budget: "10000",
    avg_stands_year: "2024",
    avg_events_year: "2025",
    company_website_url: "https://example.com",
    job_title: "event manager",
    sector: "Government",
    notes: "she is responsible for Al Marmoom film festival...",
    created_at: "2026-01-20"
  },
  {
    id: 3,
    name: "Fakhry Al sarraj",
    address: "DCT Abu Dhabi",
    phone: "0505962404",
    email: "falsarraj@dctabudhabi.ae",
    top_customer: true,
    decision_maker_status: "yes",
    status: "1st Contact Done",
    employee: "Sedra Quraid",
    country: "United Arab Emirates",
    company: "Department of Culture and Tourism",
    budget: "15000",
    avg_stands_year: "2024",
    avg_events_year: "2025",
    company_website_url: "https://example.com",
    job_title: "Director",
    sector: "Government",
    notes: "Email sent with company profile...",
    created_at: "2026-01-19"
  },
];

export default function ContactListsPage() {
  // 🔌 When API is ready, make this async and fetch data here
  // const contacts = await getContactLists();
  
  return <ContactListsClient initialContacts={MOCK_CONTACTS} />;
}

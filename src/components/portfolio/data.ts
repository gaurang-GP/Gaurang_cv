// Edit your portfolio content here.
export const profile = {
  name: "Gaurang Parmar",
  roles: ["Full Stack Developer", "Laravel Specialist", "PHP Developer", "React / Next.js Developer"],
  location: "Vadodara, Gujarat, India",
  email: "gaurangp830@gmail.com",
  phone: "+91 97372 88830",
  github: "https://github.com/", // TODO: your GitHub URL
  linkedin: "https://www.linkedin.com/", // TODO: your LinkedIn URL
  summary:
    "Results-driven Software Engineer with 4+ years of experience in full-stack web development, specializing in PHP, Laravel, RESTful APIs and modern JavaScript frameworks. I build scalable SaaS, multi-tenant platforms and CRM systems with clean, secure, maintainable code.",
};

export const stats = [
  { value: "4+", label: "Years experience" },
  { value: "7+", label: "Projects shipped" },
  { value: "20+", label: "Technologies" },
];

export const skills = [
  { group: "Backend", items: ["PHP", "Laravel", "MVC Architecture", "RESTful APIs"] },
  { group: "Frontend", items: ["JavaScript", "React.js", "Next.js", "Vue.js", "jQuery", "HTML5 / CSS3", "Bootstrap"] },
  { group: "Database", items: ["MySQL", "Database Design", "Query Optimization", "Relationships"] },
  { group: "Security", items: ["Authentication", "JWT", "RBAC", "Input Validation"] },
  { group: "Integrations", items: ["Firebase", "Push Notifications", "Payment Gateways", "Third-Party APIs"] },
  { group: "Tools & AI", items: ["Git", "GitHub", "Cursor AI", "Claude AI", "ChatGPT", "Antigravity"] },
];

export const projects = [
  { title: "Project Management System", desc: "Jira-inspired platform for projects, tasks, sprints and leave management with custom RBAC and multi-organization data isolation.", tags: ["Laravel", "Vue.js", "MySQL"], github: "#", live: "#" },
  { title: "Align Pro – CRM", desc: "Lead management and CRM with pipeline workflows, lead-to-project conversion, JWT auth and role-specific dashboards.", tags: ["Next.js", "React", "Laravel"], github: "#", live: "#" },
  { title: "Driveo – Taxi Booking", desc: "REST APIs for ride requests, driver assignment, live location tracking and payment gateway integration.", tags: ["Laravel", "REST APIs", "MySQL"], github: "#", live: "#" },
  { title: "Hospital Management", desc: "Patient registration, doctor scheduling, appointments and billing, with RBAC for admins, doctors, nurses and staff.", tags: ["React", "Laravel", "MySQL"], github: "#", live: "#" },
  { title: "Blaxity – Lifestyle Platform", desc: "Backend for web and iOS: auth, membership verification, real-time chat, private photos and filtered discovery.", tags: ["Laravel", "Vue.js", "REST APIs"], github: "#", live: "#" },
  { title: "Surya Namaskar – Gujarat Govt.", desc: "Backend APIs for a government application with secure data handling, validation and integrations.", tags: ["Laravel", "MySQL", "REST APIs"], github: "#", live: "#" },
];

export const timeline = [
  { kind: "Experience", title: "PHP Developer", org: "Consumer Sketch", period: "Oct 2025 – Present", desc: "SaaS apps with Laravel, React and Next.js; multi-tenant platforms, scalable REST APIs, RBAC and performance tuning." },
  { kind: "Experience", title: "PHP Developer", org: "iCoderz Solutions Pvt. Ltd.", period: "Oct 2023 – Jul 2025", desc: "Web apps and APIs for web and mobile, third-party integrations, bug fixing and cross-team feature delivery." },
  { kind: "Experience", title: "PHP Developer", org: "Webcreta Technologies", period: "Aug 2022 – Sep 2023", desc: "Dynamic web apps, REST APIs, CRUD modules, business logic and server-side validation." },
  { kind: "Education", title: "Master of Computer Applications", org: "Gujarat Technological University", period: "2015 – 2017", desc: "Shri Chimanbhai Patel Institute of Computer Applications, Ahmedabad." },
];

export type ProjectArt = "ring" | "square" | "path";

export type GalleryImage = {
  src: string | null;
  alt: string;
  art: ProjectArt;
};

export type ProjectFact = { label: string; value: string };

export type Project = {
  slug: string;
  title: string;
  summary: string;
  context: string;
  tags: string[];
  gallery: GalleryImage[];
  detail: {
    overview: string[];
    facts: ProjectFact[];
    links: { label: string; href: string }[];
  };
};

const img = (src: string, alt: string): GalleryImage => ({ src, alt, art: "ring" });

export const projects: Project[] = [
  {
    slug: "retail-sales-analytics-sql-nosql",
    title: "Retail Sales Analytics with SQL & NoSQL",
    summary: "Analyzing retail transaction data through relational and non-relational databases to uncover business insights and sales patterns.",
    context: "Group Coursework",
    tags: ["MySQL", "MongoDB", "SQL", "NoSQL", "OLAP", "Star Schema"],
    gallery: [
      img("/images/projects/pdds-1.png", "Superstore Data Analysis dashboard showing monthly sales trends and filters."),
      img("/images/projects/pdds-2.png", "Superstore analytics dashboard comparing discounts and profit margins."),
      img("/images/projects/pdds-3.png", "Superstore profitability dashboard with sales metrics and a regional category heatmap."),
    ],
    detail: {
      overview: [
        "This project explores how relational and non-relational databases can work together to support multidimensional retail sales analysis. Using the Superstore dataset, the project develops an OLAP-based analytical system to uncover business insights across product categories, customer segments, geographical regions, and time periods.",
        "Retail transaction data contains valuable information, but extracting meaningful business insights requires more than simply storing sales records. The project addresses this by organizing transactional data into a MySQL data warehouse using a Star Schema, while leveraging MongoDB to store aggregated analytical results and support flexible trend analysis.",
      ],
      facts: [
        { label: "Context", value: "Group Coursework" },
        { label: "My Contribution", value: "Collaborated with the team throughout the development of a multi-database retail sales analytics system, contributing to various stages of the project." },
        { label: "Technologies", value: "MySQL, MongoDB, SQL, NoSQL, OLAP, Star Schema" },
        { label: "Dataset", value: "Superstore Dataset from Kaggle; approximately 10,000 transaction line items from 2014–2017." },
      ],
      links: [],
    },
  },
  {
    slug: "kosku-smart-boarding-house-platform",
    title: "KosKu — Smart Boarding House Platform",
    summary: "Designing and developing selected interfaces for a smart boarding house platform that connects property seekers, tenants, and property owners.",
    context: "Group Coursework",
    tags: ["Figma", "Laravel Blade", "Tailwind CSS", "UI/UX"],
    gallery: [
      img("/images/projects/uiux-1.png", "KosKu boarding house landing page with a property search form and featured room."),
      img("/images/projects/uiux-2.png", "KosKu owner dashboard showing account navigation, payment alerts, and property metrics."),
      img("/images/projects/uiux-3.png", "KosKu property search page with filters and boarding house listing cards."),
    ],
    detail: {
      overview: [
        "KosKu is a smart boarding house platform designed to streamline the rental experience for property seekers, active tenants, and boarding house owners. It brings together property discovery, booking, payment tracking, digital contracts, and maintenance reporting through dedicated role-based interfaces.",
        "Managing boarding house rentals involves various processes, from finding suitable accommodation to handling payments and maintenance requests. KosKu brings these processes together through dedicated interfaces for three user roles: property seekers, active tenants, and property owners.",
      ],
      facts: [
        { label: "Context", value: "Group Coursework" },
        { label: "My Contribution", value: "Contributed to UI design and frontend implementation of selected interfaces, particularly the admin interface. Also participated in collaborative brainstorming sessions to explore interface concepts, layouts, and design directions." },
        { label: "Usability Testing", value: "The platform was evaluated with seven participants across three user roles through six scenario-based tasks. The evaluation achieved an average System Usability Scale (SUS) score of 76.50, above the commonly used benchmark of 68." },
        { label: "Technologies", value: "Figma, Laravel Blade, Tailwind CSS" },
      ],
      links: [{ label: "Repository", href: "https://github.com/Feaule/kosku-ux" }],
    },
  },
  {
    slug: "student-grade-prediction-knn",
    title: "Student Grade Prediction Using KNN",
    summary: "Exploring student grade prediction using K-Nearest Neighbors regression and historical academic and behavioral data.",
    context: "Group Coursework",
    tags: ["PHP", "KNN Regressor", "Euclidean Distance", "CSV Dataset"],
    gallery: [
      img("/images/projects/aiml-1.png", "Student grade prediction form with personal, academic, and behavioral input fields."),
      img("/images/projects/aiml-2.png", "Student grade prediction result and an explanation of the KNN regression calculation."),
      img("/images/projects/aiml-3.png", "Table showing the nearest student records and their academic and behavioral attributes."),
    ],
    detail: {
      overview: [
        "This project explores the application of machine learning in student grade prediction by analyzing historical academic data. It uses the K-Nearest Neighbors (KNN) Regressor to estimate student grades based on similarities between academic and behavioral attributes.",
        "Student performance can be influenced by various academic and lifestyle factors. To explore these relationships, the project processes historical student data from a Kaggle CSV dataset and applies KNN Regression to predict grades from user-provided inputs through a webpage. The prediction workflow uses Euclidean Distance to identify the nearest records, with 45 neighbors selected for the regression model.",
      ],
      facts: [
        { label: "Context", value: "Group Coursework" },
        { label: "My Contribution", value: "Contributed to the team's data preparation process by defining categorical attribute mappings and numerical value ranges. This helped prepare student data for processing and similarity calculations within the KNN regression workflow." },
        { label: "Technologies", value: "PHP, KNN Regressor, Euclidean Distance, CSV Dataset" },
      ],
      links: [],
    },
  },
];

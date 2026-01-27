import { getDictionary } from '@/utils/get-dictionary';
import ProjectsClient from './ProjectsClient';
import { Project } from '@/utils/types';

import { PageProps } from '@/utils/types';

// ejemplo, also id es id del canva donde esta el nodo root etc
const initialProjects: Project[] = [
  { "id": "6", "title": "Eco Tracker", "description": "An application for monitoring personal carbon footprints." },
  { "id": "7", "title": "Code Catalyst", "description": "An open-source initiative for mentoring junior developers." },
  { "id": "8", "title": "Urban Harvest", "description": "A guide to sustainable rooftop gardening in city environments." },
  { "id": "9", "title": "Sound Sphere", "description": "An experimental spatial audio project using Web Audio API." },
  { "id": "10", "title": "Data Stream", "description": "Visualizing real-time global stock market fluctuations." },
  { "id": "11", "title": "Mindful Minutes", "description": "A productivity tool focused on interval-based meditation." },
  { "id": "12", "title": "Neon Nights", "description": "A collection of cyberpunk-themed digital illustrations." },
  { "id": "13", "title": "Swift Logic", "description": "High-performance algorithm implementations in modern languages." },
  { "id": "14", "title": "Blue Horizon", "description": "Research on ocean plastic cleanup technologies." },
  { "id": "15", "title": "Velocity Kit", "description": "A lightweight boilerplate for building fast React applications." },
  { "id": "16", "title": "The Long Game", "description": "A strategic guide to personal finance and long-term investing." },
  { "id": "17", "title": "Circuit Flow", "description": "Exploring minimalist hardware design and IoT connectivity." },
  { "id": "18", "title": "Abstract Reality", "description": "A series of VR environments based on surrealist paintings." },
  { "id": "19", "title": "Golden Ratio", "description": "Designing layouts using classical mathematical proportions." },
  { "id": "20", "title": "Terraform Pro", "description": "Infrastructure as code templates for multi-cloud deployments." },
  { "id": "21", "title": "Silent Pulse", "description": "Monitoring biometric data for stress management." },
  { "id": "22", "title": "Peak Performance", "description": "A workout logging app for professional athletes." },
  { "id": "23", "title": "Lunar Phase", "description": "Tracking celestial events and their impact on tides." },
  { "id": "24", "title": "Infinity Scroll", "description": "A creative writing blog exploring endless storytelling." }
];

export default async function ProjectsPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  // mdidle ware log in protection, here justfetch projects

  return (
    <ProjectsClient
      lang={lang}
      dict={dict.projects}
      initialProjects={initialProjects ?? []}
    />
  );
}
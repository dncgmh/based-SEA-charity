// Sample data for charities
const charities = [
  {
    slug: 'eco-warriors-sg',
    name: 'Eco Warriors Singapore',
    description:
      "Eco Warriors Singapore is a non-profit organization dedicated to preserving and protecting Singapore's unique ecosystems. Founded in 2010 by a group of passionate environmentalists, we have been at the forefront of conservation efforts in the city-state for over a decade.\n\nOur mission encompasses a wide range of activities, from mangrove restoration and coral reef protection to urban greenery initiatives and wildlife conservation. We believe in the power of education and community engagement to create lasting change, and we regularly organize workshops, nature walks, and clean-up drives to involve citizens in our cause.",
    address: '123 Green Street, #05-01, Singapore 123456',
    phoneNumber: '+65 6123 4567',
    email: 'info@ecowarriors.sg',
    type: 'organization',
    links: [
      { type: 'website', url: 'https://www.ecowarriors.sg' },
      { type: 'facebook', url: 'https://www.facebook.com/ecowarriorsg' },
    ],
    logo: 'https://example.com/logos/eco-warriors-sg.png',
    onchainAddress: '0x1234567890123456789012345678901234567890',
    isVerify: true,
  },
  {
    slug: 'nurture-indonesia',
    name: 'Nurture Indonesia',
    description:
      "Nurture Indonesia is a grassroots organization committed to improving the lives of underprivileged children across the Indonesian archipelago. Since our inception in 2015, we have been working tirelessly to provide access to quality education, healthcare, and nutrition to children in remote and underserved areas.\n\nOur holistic approach focuses not just on immediate relief, but on creating sustainable solutions that empower communities to break the cycle of poverty. We collaborate with local leaders, educators, and health professionals to develop programs tailored to each community's unique needs and challenges.",
    address: 'Jl. Merdeka No. 45, Jakarta Pusat, Indonesia',
    phoneNumber: '+62 21 5678 9012',
    email: 'contact@nurtureindonesia.org',
    type: 'organization',
    links: [
      { type: 'website', url: 'https://www.nurtureindonesia.org' },
      { type: 'instagram', url: 'https://www.instagram.com/nurture_indonesia' },
    ],
    logo: 'https://example.com/logos/nurture-indonesia.png',
    onchainAddress: '0x2345678901234567890123456789012345678901',
    isVerify: true,
  },
  {
    slug: 'clean-seas-malaysia',
    name: 'Clean Seas Malaysia',
    description:
      "Clean Seas Malaysia is a marine conservation organization dedicated to protecting Malaysia's coastal and marine ecosystems. Founded by marine biologist Dr. Lim Sook Ling in 2012, our organization has been at the forefront of efforts to combat marine pollution, protect endangered species, and promote sustainable fishing practices.\n\nOur work spans the entire coastline of Malaysia, from the coral-rich waters of Sabah to the mangrove forests of Peninsular Malaysia. We conduct regular coastal clean-ups, run educational programs for schools and local communities, and collaborate with government agencies and other NGOs to advocate for stronger marine protection policies.",
    address: '88 Ocean View, Batu Ferringhi, 11100 Penang, Malaysia',
    phoneNumber: '+60 4 123 4567',
    email: 'info@cleanseasmalaysia.org',
    type: 'organization',
    links: [
      { type: 'website', url: 'https://www.cleanseasmalaysia.org' },
      { type: 'twitter', url: 'https://twitter.com/cleanseasmy' },
    ],
    logo: 'https://example.com/logos/clean-seas-malaysia.png',
    onchainAddress: '0x3456789012345678901234567890123456789012',
    isVerify: true,
  },
];

// Sample data for projects
const projects = [
  // Projects for Eco Warriors Singapore
  {
    slug: 'mangrove-restoration-sg',
    title: 'Sungei Buloh Mangrove Restoration Project',
    description:
      "The Sungei Buloh Mangrove Restoration Project aims to revitalize and expand the mangrove ecosystems in Singapore's Sungei Buloh Wetland Reserve. Mangroves play a crucial role in coastal protection, carbon sequestration, and providing habitats for numerous species of flora and fauna.\n\nOur project involves planting 10,000 mangrove saplings over the course of one year, engaging local communities and schools in the planting process. We will also conduct regular monitoring and maintenance to ensure the long-term success of the restored areas.",
    images: ['https://example.com/images/mangrove-restoration-1.jpg', 'https://example.com/images/mangrove-restoration-2.jpg'],
    link: 'https://www.ecowarriors.sg/projects/mangrove-restoration',
    tags: ['mangrove', 'ecosystem', 'conservation', 'community'],
    charityId: 'INSERT_CHARITY_ID_HERE',
    startDate: new Date('2024-11-01'),
    endDate: new Date('2025-10-31'),
    targetAmount: 50000,
    contractAddress: '0x4567890123456789012345678901234567890123',
  },
  {
    slug: 'urban-garden-sg',
    title: 'Rooftop Urban Garden Initiative',
    description:
      "The Rooftop Urban Garden Initiative is an innovative project aimed at transforming unused rooftop spaces in Singapore's public housing estates into thriving community gardens. This project addresses multiple urban challenges, including food security, community bonding, and urban heat island effect mitigation.\n\nWe plan to establish 20 rooftop gardens across Singapore, working closely with town councils and resident committees. Each garden will be designed to grow a variety of vegetables, herbs, and fruits suitable for Singapore's climate. Residents will be trained in urban farming techniques and will collectively manage these spaces.",
    images: ['https://example.com/images/urban-garden-1.jpg', 'https://example.com/images/urban-garden-2.jpg'],
    link: 'https://www.ecowarriors.sg/projects/urban-garden',
    tags: ['urban farming', 'community', 'food security', 'sustainability'],
    charityId: 'INSERT_CHARITY_ID_HERE',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
    targetAmount: 75000,
    contractAddress: '0x5678901234567890123456789012345678901234',
  },
  {
    slug: 'coral-revival-sg',
    title: "Sisters' Islands Coral Revival Program",
    description:
      "The Sisters' Islands Coral Revival Program is a concerted effort to restore and protect the coral reefs around Sisters' Islands Marine Park, one of Singapore's most important marine biodiversity hotspots. Climate change, water pollution, and physical damage have significantly impacted these coral ecosystems in recent years.\n\nOur program involves a combination of in-situ and ex-situ coral propagation techniques. We will establish a coral nursery where fragments from healthy corals will be grown before being transplanted onto degraded reef areas. The project also includes regular monitoring of water quality and coral health, as well as educational dive trips for the public to raise awareness about the importance of coral ecosystems.",
    images: ['https://example.com/images/coral-revival-1.jpg', 'https://example.com/images/coral-revival-2.jpg'],
    link: 'https://www.ecowarriors.sg/projects/coral-revival',
    tags: ['coral', 'marine conservation', 'biodiversity', 'education'],
    charityId: 'INSERT_CHARITY_ID_HERE',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2026-06-30'),
    targetAmount: 100000,
    contractAddress: '0x6789012345678901234567890123456789012345',
  },

  // Projects for Nurture Indonesia
  {
    slug: 'mobile-schools-papua',
    title: 'Mobile Schools for Remote Papua',
    description:
      'The Mobile Schools for Remote Papua project aims to bring quality education to children in the most isolated regions of Papua, Indonesia. Many children in these areas lack access to formal schooling due to geographical barriers and limited infrastructure.\n\nOur mobile schools will consist of specially equipped vehicles that can navigate difficult terrains, carrying teachers, educational materials, and basic classroom equipment. These mobile units will rotate between different villages on a regular schedule, ensuring that children in each community receive consistent education. The curriculum will be tailored to the local context and culture while meeting national educational standards.',
    images: ['https://example.com/images/mobile-schools-1.jpg', 'https://example.com/images/mobile-schools-2.jpg'],
    link: 'https://www.nurtureindonesia.org/projects/mobile-schools-papua',
    tags: ['education', 'rural development', 'Papua', 'mobile learning'],
    charityId: 'INSERT_CHARITY_ID_HERE',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2027-12-31'),
    targetAmount: 150000,
    contractAddress: '0x7890123456789012345678901234567890123456',
  },
  {
    slug: 'nutrition-gardens-bali',
    title: 'School Nutrition Gardens in Bali',
    description:
      'The School Nutrition Gardens in Bali project combines education and nutrition by establishing vegetable gardens in 50 primary schools across rural Bali. This initiative addresses the dual challenges of malnutrition and lack of practical agricultural knowledge among young Balinese.\n\nEach school will receive support to create a sustainable garden, growing a variety of nutritious vegetables suited to the local climate. Students will be actively involved in planting, maintaining, and harvesting the produce, learning valuable skills in sustainable agriculture and nutrition. The harvested vegetables will supplement school meal programs, improving the nutritional intake of the students.',
    images: ['https://example.com/images/nutrition-gardens-1.jpg', 'https://example.com/images/nutrition-gardens-2.jpg'],
    link: 'https://www.nurtureindonesia.org/projects/nutrition-gardens-bali',
    tags: ['nutrition', 'education', 'agriculture', 'Bali'],
    charityId: 'INSERT_CHARITY_ID_HERE',
    startDate: new Date('2024-09-01'),
    endDate: new Date('2025-08-31'),
    targetAmount: 80000,
    contractAddress: '0x8901234567890123456789012345678901234567',
  },
  {
    slug: 'telemedicine-sumatra',
    title: 'Telemedicine Network for Rural Sumatra',
    description:
      'The Telemedicine Network for Rural Sumatra project aims to improve access to healthcare for communities in remote areas of Sumatra. Many villages in the region lack proper medical facilities and struggle to attract and retain healthcare professionals.\n\nOur project will establish a network of telemedicine centers in 30 villages across rural Sumatra. Each center will be equipped with basic diagnostic tools and a stable internet connection, allowing local health workers to consult with doctors and specialists in urban areas. This will enable remote diagnoses, treatment recommendations, and follow-ups for a wide range of health issues.',
    images: ['https://example.com/images/telemedicine-sumatra-1.jpg', 'https://example.com/images/telemedicine-sumatra-2.jpg'],
    link: 'https://www.nurtureindonesia.org/projects/telemedicine-sumatra',
    tags: ['healthcare', 'technology', 'rural development', 'Sumatra'],
    charityId: 'INSERT_CHARITY_ID_HERE',
    startDate: new Date('2025-03-01'),
    endDate: new Date('2027-02-28'),
    targetAmount: 200000,
    contractAddress: '0x9012345678901234567890123456789012345678',
  },

  // Projects for Clean Seas Malaysia
  {
    slug: 'turtle-nesting-terengganu',
    title: 'Turtle Nesting Site Protection in Terengganu',
    description:
      'The Turtle Nesting Site Protection project focuses on safeguarding critical nesting beaches for endangered sea turtles along the coast of Terengganu, Malaysia. These beaches are vital for the survival of species like the Green Sea Turtle and the Hawksbill Turtle, but they face threats from poaching, coastal development, and climate change.\n\nOur project involves implementing 24/7 monitoring of key nesting sites during the peak nesting season, employing local community members as beach patrollers. We will also conduct awareness programs in nearby villages and schools to educate the community about the importance of sea turtle conservation. Additionally, we plan to work with local authorities to implement and enforce regulations that protect these crucial nesting habitats.',
    images: ['https://example.com/images/turtle-nesting-1.jpg', 'https://example.com/images/turtle-nesting-2.jpg'],
    link: 'https://www.cleanseasmalaysia.org/projects/turtle-nesting-terengganu',
    tags: ['sea turtles', 'conservation', 'community engagement', 'Terengganu'],
    charityId: 'INSERT_CHARITY_ID_HERE',
    startDate: new Date('2024-05-01'),
    endDate: new Date('2026-04-30'),
    targetAmount: 120000,
    contractAddress: '0x0123456789012345678901234567890123456789',
  },
  {
    slug: 'coral-restoration-redang',
    title: 'Coral Restoration Project in Pulau Redang',
    description:
      "The Coral Restoration Project in Pulau Redang aims to rejuvenate damaged coral reefs around this beautiful island off the coast of Terengganu, Malaysia. Pulau Redang's coral ecosystems have suffered from bleaching events, destructive fishing practices, and tourism impacts over the years.\n\nOur project will establish a coral nursery where we will grow resilient coral species. Using innovative techniques like micro-fragmentation, we aim to accelerate coral growth rates. Once the coral fragments have reached a suitable size, they will be transplanted onto degraded reef areas around the island. We will also work closely with local resorts and tour operators to implement responsible tourism practices that minimize impact on the reefs.",
    images: ['https://example.com/images/coral-restoration-1.jpg', 'https://example.com/images/coral-restoration-2.jpg'],
    link: 'https://www.cleanseasmalaysia.org/projects/coral-restoration-redang',
    tags: ['coral reefs', 'marine conservation', 'ecotourism', 'Pulau Redang'],
    charityId: 'INSERT_CHARITY_ID_HERE',
    startDate: new Date('2025-02-01'),
    endDate: new Date('2027-01-31'),
    targetAmount: 180000,
    contractAddress: '0x1234567890123456789012345678901234567890',
  },
  {
    slug: 'mangrove-conservation-sabah',
    title: 'Mangrove Conservation and Livelihood Project in Sabah',
    description:
      "The Mangrove Conservation and Livelihood Project in Sabah is a comprehensive initiative that aims to protect and restore mangrove forests while supporting the livelihoods of local coastal communities. Mangroves in Sabah play a crucial role in coastal protection, carbon sequestration, and as nurseries for many marine species.\n\nOur project will focus on the restoration of degraded mangrove areas through community-based planting programs. We will work closely with local villages to establish mangrove nurseries and conduct large-scale replanting efforts. Simultaneously, we will implement alternative livelihood programs, such as sustainable aquaculture and ecotourism initiatives, to reduce the community's dependence on mangrove resources. Through education and capacity building, we aim to empower local communities to become long-term stewards of their mangrove ecosystems.",
    images: ['https://example.com/images/mangrove-conservation-1.jpg', 'https://example.com/images/mangrove-conservation-2.jpg'],
    link: 'https://www.cleanseasmalaysia.org/projects/mangrove-conservation-sabah',
    tags: ['mangroves', 'community development', 'conservation', 'Sabah'],
    charityId: 'INSERT_CHARITY_ID_HERE',
    startDate: new Date('2024-08-01'),
    endDate: new Date('2027-07-31'),
    targetAmount: 250000,
    contractAddress: '0x2345678901234567890123456789012345678901',
  },
];

// Export the data
module.exports = {
  charities,
  projects,
};

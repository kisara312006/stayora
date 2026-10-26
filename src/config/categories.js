import {
  GraduationCap,
  Building2,
  DoorOpen,
  Users,
  Sofa,
  MapPin,
  Briefcase,
} from 'lucide-react'

// The "id" will be used in the address bar, e.g. /explore?category=student-hostels
export const categories = [
  {
    id: 'student-boarding',
    label: 'Student Boarding',
    description: 'Rooms in boarding houses close to campuses.',
    icon: GraduationCap,
  },
  {
    id: 'student-hostels',
    label: 'Student Hostels',
    description: 'Managed hostels with shared facilities.',
    icon: Building2,
  },
  {
    id: 'private-rooms',
    label: 'Private Rooms',
    description: 'A room of your own, for privacy and focus.',
    icon: DoorOpen,
  },
  {
    id: 'shared-rooms',
    label: 'Shared Rooms',
    description: 'Share a room and split the cost.',
    icon: Users,
  },
  {
    id: 'furnished',
    label: 'Furnished Accommodation',
    description: 'Move in with the essentials already there.',
    icon: Sofa,
  },
  {
    id: 'near-universities',
    label: 'Accommodation Near Universities',
    description: 'Stay within easy reach of your campus.',
    icon: MapPin,
  },
  {
    id: 'near-workplaces',
    label: 'Accommodation Near Workplaces',
    description: 'Shorter commutes for working professionals.',
    icon: Briefcase,
  },
]
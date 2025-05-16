// components/ClientFilters.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search, MapPin, Filter as FilterIcon, UsersIcon, GlobeIcon, HeartIcon,
  BrainIcon, BriefcaseIcon, UserCircleIcon, DollarSignIcon, VideoIcon, VideoOffIcon,
  PaletteIcon, // Example for Art Therapy
  MusicIcon,   // Example for Music Therapy
  BookOpenIcon, // Example for Degree/Education related
  MessageSquareIcon, // Example for communication/language
  ShieldCheckIcon, // Example for Insurance
  BabyIcon, // Example for Children/Postpartum
  LinkIcon, // Example for Relationship Issues
  LeafIcon, // Example for Eco-Therapy or Spirituality
} from 'lucide-react'; // Added more example icons

// Interface for structured filter options
export interface FilterOption {
  id: string;          // Unique slug/identifier (stored in DB, used in URL params)
  name: string;        // Human-readable display name
  icon?: React.ElementType; // Optional: The React component for an icon
  description?: string; // Optional: For tooltips or more info
}

// Define filter categories - ADD ANY NEW CATEGORIES HERE
const FILTERS = [
  'Gender', 'Insurance', 'Remote', 'Degree', 'Age', 'Condition',
  'Price', 'Faith', 'Language', 'Type of Therapy', 'Communities', // Example new filter
] as const;

type FilterKey = typeof FILTERS[number];

// Map display labels to URL query parameter keys
const FILTER_KEY_MAP: Record<FilterKey, string> = {
  'Gender': 'gender',
  'Insurance': 'insurance',
  'Remote': 'remote',
  'Degree': 'degree',
  'Age': 'age',
  'Condition': 'condition',
  'Price': 'price',
  'Faith': 'faith',
  'Language': 'language',
  'Type of Therapy': 'treatmentStyle',
  'Communities': 'community', // Param key for 'Communities' filter
};

// --- FILTER OPTIONS (STRUCTURED FOR FLEXIBILITY) ---
// YOU MUST COMPLETE THESE LISTS BASED ON YOUR IMAGE AND REQUIREMENTS.
// Assign a unique 'id' (slug) to each option.
// Icons are conceptual; choose/create appropriate ones.
// These icons won't render in native <option> tags but prepare for custom dropdowns.

const GENDER_OPTIONS: FilterOption[] = [
  { id: 'female', name: 'Female', icon: UserCircleIcon },
  { id: 'male', name: 'Male', icon: UserCircleIcon },
  { id: 'non-binary', name: 'Non-Binary', icon: UserCircleIcon },
  { id: 'transgender', name: 'Transgender', icon: UserCircleIcon },
  { id: 'intersex', name: 'Intersex', icon: UserCircleIcon }, // From your image's implications
  { id: 'prefer-not-to-say', name: 'Prefer not to say' },
  { id: 'other', name: 'Other' },
];

const INSURANCE_OPTIONS: FilterOption[] = [
  { id: 'aetna', name: 'Aetna', icon: ShieldCheckIcon },
  { id: 'cigna', name: 'Cigna', icon: ShieldCheckIcon },
  { id: 'blue-cross', name: 'Blue Cross Blue Shield', icon: ShieldCheckIcon }, // simplified slug
  { id: 'united', name: 'UnitedHealthcare', icon: ShieldCheckIcon },
  { id: 'medicare', name: 'Medicare', icon: ShieldCheckIcon },
  { id: 'medicaid', name: 'Medicaid', icon: ShieldCheckIcon },
  { id: 'out-of-network', name: 'Out of Network' },
  // ... (Add ALL your insurance options)
];

const REMOTE_OPTIONS: FilterOption[] = [
  { id: 'yes', name: 'Yes (Online)', icon: VideoIcon },
  { id: 'no', name: 'No (In-Person Only)', icon: VideoOffIcon },
];

const DEGREE_OPTIONS: FilterOption[] = [
  { id: 'lmft', name: 'LMFT', icon: BookOpenIcon },
  { id: 'lcsw', name: 'LCSW', icon: BookOpenIcon },
  { id: 'lpcc', name: 'LPCC', icon: BookOpenIcon },
  { id: 'psyd', name: 'PsyD', icon: BookOpenIcon },
  { id: 'phd', name: 'PhD', icon: BookOpenIcon },
  { id: 'md-psychiatrist', name: 'MD (Psychiatrist)', icon: BookOpenIcon },
  // ... (Add ALL your degree options)
];

const AGE_OPTIONS: FilterOption[] = [
  { id: 'children', name: 'Children (0-12)', icon: BabyIcon },
  { id: 'teens', name: 'Teens (13-17)', icon: UserCircleIcon },
  { id: 'young-adults', name: 'Young Adults (18-25)', icon: UserCircleIcon },
  { id: 'adults', name: 'Adults (26-64)', icon: UserCircleIcon },
  { id: 'seniors', name: 'Seniors (65+)', icon: UserCircleIcon },
];

const CONDITION_OPTIONS: FilterOption[] = [
  { id: 'academic-work-stress', name: 'Academic/Work Stress', icon: BriefcaseIcon },
  { id: 'adhd', name: 'ADHD (Adult & Child)', icon: BrainIcon },
  { id: 'adoption-foster', name: 'Adoption & Foster Care', icon: HeartIcon },
  { id: 'anger-management', name: 'Anger Management' },
  { id: 'anxiety-general', name: 'Anxiety (General)', icon: BrainIcon },
  { id: 'anxiety-panic', name: 'Anxiety (Panic Attacks)', icon: BrainIcon },
  { id: 'anxiety-social', name: 'Anxiety (Social)', icon: UsersIcon },
  { id: 'autism-spectrum', name: 'Autism Spectrum', icon: BrainIcon },
  { id: 'bipolar', name: 'Bipolar Disorder', icon: BrainIcon },
  { id: 'body-image', name: 'Body Image Issues' },
  { id: 'eating-disorders', name: 'Eating Disorders (e.g., Anorexia, Bulimia)', icon: BrainIcon },
  { id: 'chronic-illness-pain', name: 'Chronic Illness/Pain' },
  { id: 'codependency', name: 'Codependency', icon: LinkIcon },
  { id: 'communication-issues', name: 'Communication Issues', icon: MessageSquareIcon },
  { id: 'depression', name: 'Depression', icon: BrainIcon },
  { id: 'divorce-separation', name: 'Divorce & Separation' },
  { id: 'domestic-abuse', name: 'Domestic Abuse/Violence' },
  { id: 'family-conflict', name: 'Family Conflict', icon: UsersIcon },
  { id: 'grief-loss', name: 'Grief & Loss', icon: HeartIcon },
  { id: 'identity-development', name: 'Identity Development (Cultural, Gender, Sexual)' },
  { id: 'infertility', name: 'Infertility', icon: BabyIcon },
  { id: 'infidelity', name: 'Infidelity' },
  { id: 'learning-disabilities', name: 'Learning Disabilities' },
  { id: 'life-transitions', name: 'Life Transitions' },
  { id: 'mens-issues', name: "Men's Issues" },
  { id: 'ocd', name: 'Obsessive-Compulsive (OCD)', icon: BrainIcon },
  { id: 'parenting', name: 'Parenting', icon: UsersIcon },
  { id: 'peer-relationships', name: 'Peer Relationships' },
  { id: 'personality-disorders', name: 'Personality Disorders' },
  { id: 'postpartum', name: 'Postpartum Depression/Anxiety', icon: BabyIcon },
  { id: 'racial-identity-trauma', name: 'Racial Identity & Trauma' },
  { id: 'relationship-issues', name: 'Relationship Issues', icon: LinkIcon },
  { id: 'self-esteem', name: 'Self-Esteem' },
  { id: 'sexual-abuse', name: 'Sexual Abuse' },
  { id: 'sleep-insomnia', name: 'Sleep or Insomnia' },
  { id: 'spirituality-issues', name: 'Spirituality Issues', icon: LeafIcon }, // If distinct from Faith filter
  { id: 'stress-management', name: 'Stress Management' },
  { id: 'substance-use-addiction', name: 'Substance Use & Addiction' },
  { id: 'suicidal-ideation-self-harm', name: 'Suicidal Ideation/Self-Harm' },
  { id: 'ptsd-trauma', name: 'Trauma & PTSD', icon: BrainIcon },
  { id: 'womens-issues', name: "Women's Issues" },
  // --- YOU MUST ADD ALL OTHER CONDITIONS FROM YOUR IMAGE ---
  // Assign a unique `id` (slug) to each. Be thorough.
];

const PRICE_OPTIONS: FilterOption[] = [
  { id: '<100', name: '<$100 per session', icon: DollarSignIcon },
  { id: '100-150', name: '$100 - $150', icon: DollarSignIcon },
  { id: '150-200', name: '$150 - $200', icon: DollarSignIcon },
  { id: '200+', name: '$200+ per session', icon: DollarSignIcon },
];

const FAITH_OPTIONS: FilterOption[] = [
  { id: 'agnostic', name: 'Agnostic', icon: HeartIcon },
  { id: 'atheist', name: 'Atheist', icon: HeartIcon },
  { id: 'buddhist', name: 'Buddhist', icon: LeafIcon }, // Example more specific
  { id: 'christian', name: 'Christian', icon: HeartIcon }, // Replace with actual symbols if desired & appropriate
  { id: 'earth-based', name: 'Earth-Based Spirituality', icon: LeafIcon },
  { id: 'hindu', name: 'Hindu', icon: HeartIcon },
  { id: 'interfaith', name: 'Interfaith', icon: UsersIcon },
  { id: 'jewish', name: 'Jewish', icon: HeartIcon },
  { id: 'muslim', name: 'Muslim', icon: HeartIcon },
  { id: 'pagan', name: 'Pagan', icon: LeafIcon },
  { id: 'spiritual-not-religious', name: 'Spiritual but not religious', icon: HeartIcon },
  { id: 'no-preference', name: 'No Preference' },
  { id: 'open-to-all', name: 'Open to All Faiths' },
  // --- YOU MUST ADD ALL OTHER FAITH OPTIONS FROM YOUR IMAGE ---
];

const LANGUAGE_OPTIONS: FilterOption[] = [
  { id: 'en', name: 'English', icon: GlobeIcon },
  { id: 'es', name: 'Spanish (Español)', icon: GlobeIcon },
  { id: 'zh-mandarin', name: 'Mandarin (普通话)', icon: GlobeIcon },
  { id: 'fr', name: 'French (Français)', icon: GlobeIcon },
  { id: 'de', name: 'German (Deutsch)', icon: GlobeIcon },
  { id: 'asl', name: 'ASL', icon: MessageSquareIcon }, // American Sign Language
  { id: 'ar', name: 'Arabic (العربية)', icon: GlobeIcon },
  { id: 'he', name: 'Hebrew (עברית)', icon: GlobeIcon },
  { id: 'hi', name: 'Hindi (हिन्दी)', icon: GlobeIcon },
  { id: 'ja', name: 'Japanese (日本語)', icon: GlobeIcon },
  { id: 'ko', name: 'Korean (한국어)', icon: GlobeIcon },
  { id: 'pt', name: 'Portuguese (Português)', icon: GlobeIcon },
  { id: 'ru', name: 'Russian (Русский)', icon: GlobeIcon },
  // --- YOU MUST ADD ALL OTHER LANGUAGE OPTIONS FROM YOUR IMAGE ---
];

const TYPE_OF_THERAPY_OPTIONS: FilterOption[] = [
  { id: 'act', name: 'Acceptance & Commitment (ACT)', icon: BrainIcon },
  { id: 'art-therapy', name: 'Art Therapy', icon: PaletteIcon },
  { id: 'attachment-based', name: 'Attachment-Based Therapy', icon: LinkIcon },
  { id: 'brainspotting', name: 'Brainspotting' },
  { id: 'cbt', name: 'Cognitive Behavioral (CBT)', icon: BrainIcon },
  { id: 'cpt', name: 'Cognitive Processing (CPT)' },
  { id: 'culturally-sensitive', name: 'Culturally Sensitive Therapy', icon: UsersIcon },
  { id: 'dbt', name: 'Dialectical Behavior (DBT)', icon: BrainIcon },
  { id: 'emdr', name: 'EMDR', icon: BrainIcon },
  { id: 'eft', name: 'Emotionally Focused (EFT)', icon: HeartIcon },
  { id: 'existential', name: 'Existential Therapy' },
  { id: 'erp', name: 'Exposure Response Prevention (ERP)' },
  { id: 'family-marital', name: 'Family / Marital Therapy', icon: UsersIcon },
  { id: 'family-systems', name: 'Family Systems' },
  { id: 'feminist-therapy', name: 'Feminist Therapy' },
  { id: 'gestalt', name: 'Gestalt Therapy' },
  { id: 'gottman', name: 'Gottman Method' },
  { id: 'humanistic', name: 'Humanistic Therapy' },
  { id: 'ifs', name: 'Internal Family Systems (IFS)' },
  { id: 'integrative', name: 'Integrative Therapy' },
  { id: 'ipt', name: 'Interpersonal Therapy (IPT)' },
  { id: 'jungian', name: 'Jungian Therapy' },
  { id: 'mindfulness', name: 'Mindfulness-Based (MBCT/MBSR)', icon: LeafIcon },
  { id: 'motivational-interviewing', name: 'Motivational Interviewing' },
  { id: 'music-therapy', name: 'Music Therapy', icon: MusicIcon },
  { id: 'narrative', name: 'Narrative Therapy' },
  { id: 'pcit', name: 'Parent-Child Interaction (PCIT)' },
  { id: 'person-centered', name: 'Person-Centered (Rogerian)' },
  { id: 'play-therapy', name: 'Play Therapy', icon: BabyIcon }, // Or a game controller
  { id: 'positive-psychology', name: 'Positive Psychology' },
  { id: 'psychoanalytic', name: 'Psychoanalytic Therapy' },
  { id: 'psychodynamic', name: 'Psychodynamic Therapy' },
  { id: 'sfbt', name: 'Solution-Focused Brief (SFBT)' },
  { id: 'somatic', name: 'Somatic Experiencing' },
  { id: 'strength-based', name: 'Strength-Based Therapy' },
  { id: 'tf-cbt', name: 'Trauma-Focused CBT (TF-CBT)' },
  // --- YOU MUST ADD ALL OTHER THERAPY TYPES FROM YOUR IMAGE ---
];

const COMMUNITIES_OPTIONS: FilterOption[] = [
  { id: 'activists', name: 'Activists', icon: UsersIcon },
  { id: 'adopted', name: 'Adopted Individuals', icon: UsersIcon },
  { id: 'cancer-survivors', name: 'Cancer Survivors/Patients', icon: HeartIcon },
  { id: 'caregivers', name: 'Caregivers', icon: UsersIcon },
  { id: 'college-students', name: 'College Students', icon: BookOpenIcon },
  { id: 'corporate-professionals', name: 'Corporate Professionals', icon: BriefcaseIcon },
  { id: 'creatives-artists', name: 'Creatives / Artists', icon: PaletteIcon },
  { id: 'entrepreneurs', name: 'Entrepreneurs', icon: BriefcaseIcon },
  { id: 'essential-workers', name: 'Essential Workers', icon: UsersIcon },
  { id: 'first-responders', name: 'First Responders', icon: ShieldCheckIcon },
  { id: 'immigrants-refugees', name: 'Immigrants / Refugees', icon: GlobeIcon },
  { id: 'indigenous-peoples', name: 'Indigenous Peoples', icon: LeafIcon },
  { id: 'disability-community', name: 'Individuals with Disabilities', icon: UsersIcon }, // Consider a specific disability icon
  { id: 'justice-involved', name: 'Justice-Involved Individuals', icon: ScaleIcon }, // Lucide 'Scale' for justice
  { id: 'lgbtq-plus', name: 'LGBTQ+ Individuals', icon: UsersIcon }, // Consider a more specific pride icon
  { id: 'lgbtq-allied', name: 'LGBTQ+ Allied', icon: UsersIcon },
  { id: 'military-veterans', name: 'Military / Veterans & Families', icon: ShieldCheckIcon },
  { id: 'poc', name: 'People of Color (POC)', icon: UsersIcon },
  { id: 'single-parents', name: 'Single Parents', icon: UsersIcon },
  // --- YOU MUST ADD ALL OTHER COMMUNITY OPTIONS FROM YOUR IMAGE ---
];

const ALL_FILTER_OPTIONS: Record<FilterKey, FilterOption[]> = {
  'Gender': GENDER_OPTIONS,
  'Insurance': INSURANCE_OPTIONS,
  'Remote': REMOTE_OPTIONS,
  'Degree': DEGREE_OPTIONS,
  'Age': AGE_OPTIONS,
  'Condition': CONDITION_OPTIONS,
  'Price': PRICE_OPTIONS,
  'Faith': FAITH_OPTIONS,
  'Language': LANGUAGE_OPTIONS,
  'Type of Therapy': TYPE_OF_THERAPY_OPTIONS,
  'Communities': COMMUNITIES_OPTIONS,
};


export default function ClientFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPathname = '/therapists'; // Base path for therapist search results

  const zip = searchParams.get('zip') || '';

  const handleFilterChange = (paramName: string, value: string) => {
    const currentQuery = new URLSearchParams(Array.from(searchParams.entries()));
    if (value) {
      currentQuery.set(paramName, value);
    } else {
      currentQuery.delete(paramName);
    }
    currentQuery.set('page', '1'); // Reset to page 1 on filter change
    router.push(`${currentPathname}?${currentQuery.toString()}`, { scroll: false }); // Add { scroll: false } if you don't want to scroll to top
  };

  const handleZipSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newZip = formData.get('zip') as string;

    const currentQuery = new URLSearchParams(Array.from(searchParams.entries()));
    if (newZip && newZip.trim() !== '') {
      currentQuery.set('zip', newZip.trim());
    } else {
      currentQuery.delete('zip');
    }
    currentQuery.set('page', '1');
    router.push(`${currentPathname}?${currentQuery.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    const currentQuery = new URLSearchParams();
    // Preserve ZIP if it's present and you want to keep it after clearing other filters
    // const currentZip = searchParams.get('zip');
    // if (currentZip) {
    //   currentQuery.set('zip', currentZip);
    // }
    // Or clear ZIP as well:
    if (zip) { // If you have a separate zip input that's not part of these FILTERS map
        currentQuery.set('zip', zip); // This will keep the current zip if handleZipSubmit doesn't clear it
    }
    // For a true "Clear All Filters" that clears everything except potentially a base query:
    const persistentParams = new URLSearchParams(); // Params you might want to always keep
    if (searchParams.get('zip')) { // only keep zip if it was already there
        persistentParams.set('zip', searchParams.get('zip')!);
    }
    persistentParams.set('page', '1');


    router.push(`${currentPathname}?${persistentParams.toString()}`, { scroll: false });
  };

  const activeFilterCount = FILTERS.reduce((count, label) => {
     const key = FILTER_KEY_MAP[label];
     if (searchParams.get(key)) {
       return count + 1;
     }
     return count;
  }, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-10 border border-gray-200">
      <form onSubmit={handleZipSubmit} className="contents"> {/* Use 'contents' if form is just for grouping submit logic */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-8 pb-6 border-b border-gray-200">
          <label htmlFor="zip-filter" className="flex items-center text-lg font-semibold text-gray-700 whitespace-nowrap">
            <MapPin size={22} className="mr-2 text-teal-600" />
            Find by Location
          </label>
          <div className="flex w-full sm:w-auto items-center gap-2 bg-slate-100 rounded-full border border-slate-300 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all px-1 py-1">
            <input
              id="zip-filter"
              type="text"
              name="zip" // Make sure this 'name' is used by FormData
              defaultValue={zip}
              aria-label="Enter ZIP Code"
              placeholder="Enter ZIP Code"
              className="flex-grow appearance-none bg-transparent text-gray-700 py-2 px-3 leading-tight focus:outline-none placeholder-gray-500 text-sm sm:min-w-[180px]"
              pattern="\d{5}(-\d{4})?"
              title="Enter a 5-digit or 9-digit ZIP code."
            />
            <button
              type="submit"
              aria-label="Search by ZIP code"
              className="bg-teal-600 text-white p-2.5 rounded-full hover:bg-teal-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
            >
              <Search size={18} />
            </button>
          </div>
        </div>
      </form>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <FilterIcon size={20} className="mr-2 text-teal-600"/>
          <h3 className="text-lg font-semibold text-gray-700">Refine Your Search</h3>
        </div>
        {activeFilterCount > 0 && (
           <button
            onClick={clearAllFilters}
            className="text-sm text-teal-600 hover:text-teal-700 hover:underline focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
          >
            Clear Filters ({activeFilterCount})
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-5">
        {FILTERS.map((label) => {
          const key = FILTER_KEY_MAP[label];
          const optionsForThisFilter = ALL_FILTER_OPTIONS[label];
          const currentValue = searchParams.get(key) || '';
          const currentOption = optionsForThisFilter.find(o => o.id === currentValue);

          return (
            <div key={label} className="relative">
              <label htmlFor={key} className="sr-only">{label}</label>
              <select
                id={key}
                name={key}
                value={currentValue}
                aria-label={`Filter by ${label}`}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className={`w-full appearance-none rounded-lg border py-2.5 pl-3 pr-10 text-sm transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm truncate ${
                  currentValue
                    ? 'bg-teal-600 text-white border-teal-700 font-semibold'
                    : 'bg-slate-50 text-gray-700 border-slate-300 hover:border-slate-400'
                }`}
              >
                <option value="" className={currentValue ? "text-gray-700 bg-white font-normal" : "text-gray-500 font-normal"}>
                  {/* Display the filter label, or the name of the selected option if one is active */}
                  {currentValue && currentOption ? currentOption.name : label}
                  {!currentValue && ' (All)'}
                </option>

                {optionsForThisFilter.map((opt) => (
                  <option key={opt.id} value={opt.id} className="text-gray-700 bg-white font-normal">
                    {/* Icons won't render here in standard HTML options */}
                    {/* opt.icon && <opt.icon className="inline h-4 w-4 mr-2 text-gray-500" /> */}
                    {opt.name}
                  </option>
                ))}
              </select>
              <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 ${currentValue ? 'text-white' : 'text-gray-500'}`}>
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
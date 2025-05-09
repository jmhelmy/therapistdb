'use client'

import BasicsForm from './tabs/BasicsForm'
import LocationForm from './tabs/LocationForm'
import FinancesForm from './tabs/FinancesForm'
import QualificationsForm from './tabs/QualificationsForm'
import PersonalStatementForm from './tabs/PersonalStatementForm'
import SpecialtiesForm from './tabs/SpecialtiesForm'
import TreatmentStyleForm from './tabs/TreatmentStyleForm'
import { Tab } from './ProfileWizard'

export default function WizardFormBody({ activeTab }: { activeTab: Tab }) {
  return (
    <>
      {activeTab === 'Basics' && <BasicsForm />}
      {activeTab === 'Location' && <LocationForm />}
      {activeTab === 'Finances' && <FinancesForm />}
      {activeTab === 'Qualifications' && <QualificationsForm />}
      {activeTab === 'PersonalStatement' && <PersonalStatementForm />}
      {activeTab === 'Specialties' && <SpecialtiesForm />}
      {activeTab === 'TreatmentStyle' && <TreatmentStyleForm />}
    </>
  )
}

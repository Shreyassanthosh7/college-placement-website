import { useSettings } from '../hooks/useSettings'
import Reveal from '../components/Reveal'

export default function About() {
  const { settings } = useSettings()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Reveal>
        <h1 className="font-display text-3xl font-bold mb-2">About the Placement Cell</h1>
        <p className="text-muted-foreground max-w-2xl mb-8">
          {settings.placementCellName}, {settings.collegeName}.
        </p>

        <section className="mb-8 glass rounded-xl p-6">
          <h2 className="font-display text-xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Our Mission</h2>
          <p className="text-muted-foreground">{settings.aboutText}</p>
        </section>
      </Reveal>

      <section className="mb-8">
        <h2 className="font-display text-xl font-bold mb-3">What We Do</h2>
        <Reveal stagger className="grid sm:grid-cols-2 gap-4">
          {[
            {
              title: 'Career Guidance',
              body: 'Counselling on litigation, corporate law, judiciary, and policy career tracks.',
            },
            {
              title: 'Skill Building',
              body: 'Workshops on legal drafting, case analysis, and interview preparation.',
            },
            {
              title: 'Internship Coordination',
              body: 'Verified internships with law firms, chambers, and corporates.',
            },
            {
              title: 'Campus Recruitment',
              body: 'End-to-end coordination of recruiter visits and interview rounds.',
            },
          ].map((item) => (
            <div key={item.title} className="glass glow-on-hover rounded-xl p-5 transition-transform duration-200 hover:-translate-y-1">
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <Reveal as="section">
        <h2 className="font-display text-xl font-bold mb-2">Placement Cell Team</h2>
        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-left" style={{ backgroundColor: 'var(--color-muted)' }}>
              <tr>
                <th className="px-4 py-2 font-semibold">Name</th>
                <th className="px-4 py-2 font-semibold">Designation</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="px-4 py-2">Prof. (Dr.) Ranjit Oommen Abraham</td>
                <td className="px-4 py-2">Director, School of Excellence in Law</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Only the Director is publicly listed by the University at this time. Additional
          faculty coordinators and student committee members can be added here by an admin
          once the Team feature is wired up in a later phase.
        </p>
      </Reveal>
    </div>
  )
}

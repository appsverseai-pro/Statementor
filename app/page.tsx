import Hero from '@/components/home/Hero'
import InstrumentGrid from '@/components/home/InstrumentGrid'
import HowItWorks from '@/components/home/HowItWorks'
import { getUniqueInstruments } from '@/lib/google-sheets'

export default async function HomePage() {
  const instruments = await getUniqueInstruments()

  return (
    <main>
      <Hero />
      <InstrumentGrid instruments={instruments} />
      <HowItWorks />
    </main>
  )
}

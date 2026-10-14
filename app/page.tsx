import Hero from '@/components/home/Hero'
import VideoSection from '@/components/home/VideoSection'
import InstrumentGrid from '@/components/home/InstrumentGrid'
import HowItWorks from '@/components/home/HowItWorks'
import { getUniqueInstruments } from '@/lib/google-sheets'

export default async function HomePage() {
  const instruments = await getUniqueInstruments()

  return (
    <main>
      <Hero />
      <VideoSection />
      <InstrumentGrid instruments={instruments} />
      <HowItWorks />
    </main>
  )
}

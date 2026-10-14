// ============================================================================
// To change the video: replace the ID below with your YouTube video's ID.
// The ID is the part after "watch?v=" in the URL, e.g. for
// https://www.youtube.com/watch?v=dQw4w9WgXcQ  the ID is  dQw4w9WgXcQ
// ============================================================================
const YOUTUBE_VIDEO_ID = 'tz1qxpnMUkE'

const HEADING = 'See StateMentor in action'
const SUBHEADING = 'Hear from the students behind the mission.'

export default function VideoSection() {
  return (
    <section className="bg-cream py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-navy sm:text-4xl mb-2">{HEADING}</h2>
        <p className="text-navy/60 mb-8">{SUBHEADING}</p>

        <div className="relative w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-navy/10"
             style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
            title="StateMentor"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}

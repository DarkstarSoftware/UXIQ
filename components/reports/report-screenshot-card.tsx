export function ReportScreenshotCard({
  screenshotUrl,
  site,
}: {
  screenshotUrl?: string | null;
  site: string;
}) {
  if (!screenshotUrl) return null;

  return (
    <section className="card app-section">
      <div className="app-toolbar">
        <div>
          <p className="app-kicker">Rendered Capture</p>
          <h2 className="section-title">Website Screenshot</h2>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
        <img src={screenshotUrl} alt={`${site} website screenshot`} className="block w-full" />
      </div>
    </section>
  );
}

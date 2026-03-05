import Link from "next/link";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Hippo Projects";

export function Footer() {
  return (
    <footer className="border-t border-aurora-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <p className="text-aurora-muted text-sm">{siteName} — Kanban boards & task management</p>
          <div className="flex gap-6 text-sm text-aurora-muted">
            <Link href="/board" className="hover:text-white">Board</Link>
            <Link href="/projects" className="hover:text-white">Projects</Link>
            <Link href="/members" className="hover:text-white">Team</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

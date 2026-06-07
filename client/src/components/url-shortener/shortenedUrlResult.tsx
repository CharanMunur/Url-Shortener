import { Button } from "@/components/ui/button"

type ShortenedUrlResultProps = {
  shortUrl: string
  error: string
  copied: boolean
  onCopy: () => void
}

export function ShortenedUrlResult({
  shortUrl,
  error,
  copied,
  onCopy,
}: ShortenedUrlResultProps) {
  if (error) {
    return <p className="text-sm text-destructive">{error}</p>
  }

  if (!shortUrl) {
    return null
  }

  return (
    <div className="space-y-3 border-t border-border/60 pt-4">
      <p className="text-sm font-medium text-muted-foreground">Shortened URL</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <a
          className="break-all text-sm font-medium text-primary underline-offset-4 hover:underline"
          href={shortUrl}
          rel="noreferrer"
          target="_blank"
        >
          {shortUrl}
        </a>
        <Button className="shrink-0" type="button" variant="outline" onClick={onCopy}>
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  )
}

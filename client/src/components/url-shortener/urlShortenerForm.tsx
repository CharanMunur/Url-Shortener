import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type UrlShortenerFormProps = {
  value: string
  isSubmitting: boolean
  onChange: (value: string) => void
  onSubmit: () => void
}

export function UrlShortenerForm({
  value,
  isSubmitting,
  onChange,
  onSubmit,
}: UrlShortenerFormProps) {
  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <Input
        aria-label="Long URL"
        autoComplete="off"
        className="h-11"
        inputMode="url"
        name="longUrl"
        placeholder="https://example.com/very/long/link"
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <Button className="h-11 shrink-0 px-5" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Shortening..." : "Shorten URL"}
      </Button>
    </form>
  )
}

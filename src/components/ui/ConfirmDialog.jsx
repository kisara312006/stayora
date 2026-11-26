import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import Button from './Button'

export default function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = 'Confirm',
  busy = false,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault() // Esc was pressed. Let the parent decide.
        if (!busy) onCancel()
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-taupe bg-surface p-6 text-charcoal shadow-xl backdrop:bg-black/50"
    >
      <h2 className="text-xl">{title}</h2>
      <div className="mt-3 text-sm">{children}</div>
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button variant="outline" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button onClick={onConfirm} disabled={busy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  )
}
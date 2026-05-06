"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"

type WarpDialogContextType = {
  open: boolean
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void
}

const WarpDialogContext = React.createContext<WarpDialogContextType | null>(null)

function useWarpDialogContext() {
  const ctx = React.useContext(WarpDialogContext)
  if (!ctx) throw new Error("WarpDialog components must be used inside <WarpDialog>")
  return ctx
}

export function WarpDialog({
  open: openProp,
  onOpenChange: setOpenProp,
  ...props
}: React.ComponentProps<"div"> & {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [_open, _setOpen] = React.useState(false)
  const open = openProp ?? _open

  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) setOpenProp(openState)
      else _setOpen(openState)
    },
    [setOpenProp, open]
  )

  const contextValue = React.useMemo(() => ({ open, setOpen }), [open, setOpen])

  return (
    <WarpDialogContext.Provider value={contextValue}>
      <div data-slot="dialog" {...props} />
    </WarpDialogContext.Provider>
  )
}

export function WarpDialogContent({
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) {
  const { open, setOpen } = useWarpDialogContext()

  return (
    <AnimatePresence>
      {open && (
        <div className="absolute">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            onClick={() => setOpen(false)}
          >
            {/* Warp glow effects */}
            <motion.div
              className="absolute rounded-full blur-3xl"
              style={{ width: "50%", height: "50%", left: "25%", top: "100%", background: "hsl(30, 50%, 30%)" }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 8, opacity: 0.15 }}
              exit={{ scale: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>

          {/* Dialog */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[1000] px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.59, 0, 0.35, 1] }}
            onClick={() => setOpen(false)}
            {...props}
          >
            <motion.div
              className="relative flex flex-col items-center justify-center gap-4"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              initial={{ rotateX: -5, skewY: -1.5, scaleY: 2, scaleX: 0.4, y: 100 }}
              animate={{
                rotateX: 0, skewY: 0, scaleY: 1, scaleX: 1, y: 0,
                transition: {
                  duration: 0.35,
                  ease: [0.59, 0, 0.35, 1],
                  y: { type: "spring", visualDuration: 0.7, bounce: 0.2 },
                },
              }}
              exit={{ rotateX: -5, skewY: -1.5, scaleY: 2, scaleX: 0.4, y: 100 }}
              transition={{ duration: 0.35, ease: [0.59, 0, 0.35, 1] }}
              style={{ transformPerspective: 1000, originX: 0.5, originY: 0 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

"use client"

import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

export type SelectorChipsProps = {
  options: string[]
  onChange?: (selected: string[]) => void
  single?: boolean
}

const SelectorChips: React.FC<SelectorChipsProps> = ({ options, onChange, single = false }) => {
  const [selected, setSelected] = useState<string[]>([options[0]])

  const toggleChip = (option: string) => {
    let updated: string[]
    if (single) {
      updated = [option]
    } else {
      updated = selected.includes(option)
        ? selected.filter((o) => o !== option)
        : [...selected, option]
    }
    setSelected(updated)
    onChange?.(updated)
  }

  return (
    <div className="flex flex-wrap gap-2 w-full p-1">
      {options.map((option) => {
        const isSelected = selected.includes(option)
        return (
          <motion.button
            key={option}
            onClick={() => toggleChip(option)}
            initial={false}
            animate={{
              backgroundColor: isSelected ? "#c8a97e" : "transparent",
              borderColor: isSelected ? "#c8a97e" : "rgba(122,98,72,0.5)",
              color: isSelected ? "#080808" : "#8a8070",
              transition: { backgroundColor: { duration: 0.15 }, color: { duration: 0.15 } },
            }}
            className="flex items-center justify-center px-4 py-2 rounded-full text-xs font-medium border tracking-widest uppercase cursor-pointer"
            style={{ fontFamily: "Inter, sans-serif", letterSpacing: "0.1em" }}
          >
            <div className="flex items-center gap-1">
              <span>{option}</span>
              <AnimatePresence>
                {isSelected && (
                  <motion.span
                    key="tick"
                    initial={{ scale: 0, opacity: 0, width: 0 }}
                    animate={{ scale: 1, opacity: 1, width: 14 }}
                    exit={{ scale: 0, opacity: 0, width: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <motion.path
                        d="M5 10.5L9 14.5L15 7.5"
                        stroke="#080808"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.25 }}
                      />
                    </svg>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}

export { SelectorChips }

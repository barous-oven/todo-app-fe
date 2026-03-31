import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export interface MultiSelectOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  disabled?: boolean
}

export interface MultiSelectGroup {
  heading: string
  options: MultiSelectOption[]
}

export interface MultiSelectRef {
  reset: () => void
  getSelectedValues: () => string[]
  setSelectedValues: (values: string[]) => void
  clear: () => void
  focus: () => void
}

interface MultiSelectProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "defaultValue"
> {
  options: MultiSelectOption[] | MultiSelectGroup[]
  value?: string[]
  defaultValue?: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  maxCount?: number
  modalPopover?: boolean
  hideSelectAll?: boolean
  searchable?: boolean
  emptyIndicator?: React.ReactNode
  closeOnSelect?: boolean
}

function isGroupedOptions(
  options: MultiSelectOption[] | MultiSelectGroup[]
): options is MultiSelectGroup[] {
  return options.length > 0 && "heading" in options[0]
}

function flattenOptions(
  options: MultiSelectOption[] | MultiSelectGroup[]
): MultiSelectOption[] {
  if (!options.length) return []
  return isGroupedOptions(options) ? options.flatMap((g) => g.options) : options
}

export const MultiSelect = React.forwardRef<MultiSelectRef, MultiSelectProps>(
  (
    {
      options,
      value,
      defaultValue = [],
      onValueChange,
      placeholder = "Select options",
      maxCount = 3,
      modalPopover = false,
      hideSelectAll = false,
      searchable = true,
      emptyIndicator = "No results found.",
      closeOnSelect = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] =
      React.useState<string[]>(defaultValue)
    const [open, setOpen] = React.useState(false)

    const selectedValues = isControlled ? value : internalValue
    const buttonRef = React.useRef<HTMLButtonElement>(null)

    const allOptions = React.useMemo(() => flattenOptions(options), [options])

    const setSelectedValues = React.useCallback(
      (nextValues: string[]) => {
        if (!isControlled) {
          setInternalValue(nextValues)
        }
        onValueChange(nextValues)
      },
      [isControlled, onValueChange]
    )

    const getOptionByValue = React.useCallback(
      (value: string) => allOptions.find((option) => option.value === value),
      [allOptions]
    )

    const toggleOption = React.useCallback(
      (optionValue: string) => {
        const option = getOptionByValue(optionValue)
        if (!option || option.disabled) return

        const nextValues = selectedValues.includes(optionValue)
          ? selectedValues.filter((v) => v !== optionValue)
          : [...selectedValues, optionValue]

        setSelectedValues(nextValues)

        if (closeOnSelect) {
          setOpen(false)
        }
      },
      [closeOnSelect, getOptionByValue, selectedValues, setSelectedValues]
    )

    const clear = React.useCallback(() => {
      setSelectedValues([])
    }, [setSelectedValues])

    const toggleAll = React.useCallback(() => {
      const enabledOptions = allOptions.filter((option) => !option.disabled)
      const enabledValues = enabledOptions.map((option) => option.value)

      const isAllSelected =
        enabledValues.length > 0 &&
        enabledValues.every((value) => selectedValues.includes(value))

      setSelectedValues(isAllSelected ? [] : enabledValues)
    }, [allOptions, selectedValues, setSelectedValues])

    const reset = React.useCallback(() => {
      setSelectedValues(defaultValue)
      setOpen(false)
    }, [defaultValue, setSelectedValues])

    React.useImperativeHandle(
      ref,
      () => ({
        reset,
        getSelectedValues: () => selectedValues,
        setSelectedValues,
        clear,
        focus: () => buttonRef.current?.focus(),
      }),
      [clear, reset, selectedValues, setSelectedValues]
    )

    const visibleSelected = selectedValues.slice(0, maxCount)
    const hiddenCount = Math.max(selectedValues.length - maxCount, 0)

    const renderOptionItem = (option: MultiSelectOption) => {
      const isSelected = selectedValues.includes(option.value)
      const Icon = option.icon

      return (
        <CommandItem
          key={option.value}
          onSelect={() => toggleOption(option.value)}
          disabled={option.disabled}
          className="cursor-pointer"
        >
          <div
            className={cn(
              "mr-2 flex size-4 items-center justify-center rounded-sm border border-input",
              isSelected
                ? "border-primary bg-primary text-primary-foreground"
                : "opacity-50 [&_svg]:invisible"
            )}
          >
            <Check className="size-3.5" />
          </div>

          {Icon ? <Icon className="mr-2 size-4 text-muted-foreground" /> : null}

          <span className="flex-1 truncate">{option.label}</span>
        </CommandItem>
      )
    }

    return (
      <Popover open={open} onOpenChange={setOpen} modal={modalPopover}>
        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "min-h-8 w-full justify-between px-3 font-normal",
              className
            )}
            {...props}
          >
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1 text-left">
              {selectedValues.length > 0 ? (
                <>
                  {visibleSelected.map((value) => {
                    const option = getOptionByValue(value)
                    if (!option) return null

                    return (
                      <Badge
                        key={value}
                        variant="secondary"
                        className="gap-1 pr-1"
                      >
                        <span className="max-w-[120px] truncate">
                          {option.label}
                        </span>
                        <span
                          role="button"
                          tabIndex={0}
                          className="rounded-sm p-0.5 hover:bg-muted"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleOption(value)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault()
                              e.stopPropagation()
                              toggleOption(value)
                            }
                          }}
                          aria-label={`Remove ${option.label}`}
                        >
                          <X className="size-3" />
                        </span>
                      </Badge>
                    )
                  })}

                  {hiddenCount > 0 ? (
                    <Badge variant="secondary" className="gap-1">
                      +{hiddenCount}
                    </Badge>
                  ) : null}
                </>
              ) : (
                <span className="truncate text-muted-foreground">
                  {placeholder}
                </span>
              )}
            </div>

            <div className="ml-2 flex items-center">
              {selectedValues.length > 0 ? (
                <>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      clear()
                    }}
                    aria-label="Clear selection"
                  >
                    <X className="size-4" />
                  </button>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                </>
              ) : null}
              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            {searchable ? <CommandInput placeholder="Search..." /> : null}

            <CommandList>
              <CommandEmpty>{emptyIndicator}</CommandEmpty>

              {!hideSelectAll ? (
                <>
                  <CommandGroup>
                    <CommandItem
                      onSelect={toggleAll}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "mr-2 flex size-4 items-center justify-center rounded-sm border border-input",
                          allOptions.length > 0 &&
                            allOptions
                              .filter((option) => !option.disabled)
                              .every((option) =>
                                selectedValues.includes(option.value)
                              )
                            ? "border-primary bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Check className="size-3.5" />
                      </div>
                      <span>Select all</span>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                </>
              ) : null}

              {isGroupedOptions(options) ? (
                options.map((group) => (
                  <CommandGroup key={group.heading} heading={group.heading}>
                    {group.options.map(renderOptionItem)}
                  </CommandGroup>
                ))
              ) : (
                <CommandGroup>{options.map(renderOptionItem)}</CommandGroup>
              )}

              <CommandSeparator />

              <CommandGroup>
                <div className="flex items-center">
                  {selectedValues.length > 0 ? (
                    <>
                      <CommandItem
                        onSelect={clear}
                        className="flex-1 justify-center"
                      >
                        Clear
                      </CommandItem>
                      <Separator orientation="vertical" className="h-4" />
                    </>
                  ) : null}
                  <CommandItem
                    onSelect={() => setOpen(false)}
                    className="flex-1 justify-center"
                  >
                    Close
                  </CommandItem>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

MultiSelect.displayName = "MultiSelect"

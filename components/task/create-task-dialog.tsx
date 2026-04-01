"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { CreateTaskContent } from "./create-task-content"
import CreateTaskWithAIDialog from "./create-task-with-ai-content"

type CreateTaskDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateTaskDialog({
  open,
  onOpenChange,
}: CreateTaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList>
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="ai-generation">AI Generation</TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <CreateTaskContent onOpenChange={onOpenChange} />
          </TabsContent>

          <TabsContent value="ai-generation">
            <CreateTaskWithAIDialog onOpenChange={onOpenChange} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

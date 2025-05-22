import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useModal } from "@/hook/useModal";
import { Button } from "@/components/ui/button";

export default function Modal() {
  const { modalState, closeModal } = useModal();
  const { showModal, title, content } = modalState;

  return (
    <Dialog
      open={showModal}
      onOpenChange={closeModal}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {title}
          </DialogTitle>
          <DialogDescription>
            {content}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

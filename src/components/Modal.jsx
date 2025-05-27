import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useModal } from "@/hook/useModal";
import { Button } from "@/components/ui/button";

export default function Modal() {
  const { modalState } = useModal();
  const { showModal, title, content, onClose, onNo, modalType } = modalState;

  return (
    <Dialog
      open={showModal}
      onOpenChange={onClose}
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
          {modalType === "yesno" && (
            <>
              <Button type="button" variant="outline" onClick={onNo} className="cursor-pointer">
                No
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">
                Yes
              </Button>
            </>
          )}
          {modalType === "info" && (
            <Button type="button" variant="secondary" onClick={onClose} className="cursor-pointer">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

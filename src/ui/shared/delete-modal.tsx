import type { DialogProps } from "@radix-ui/react-dialog";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

export function DeleteModal<T>({
  open,
  onOpenChange,
  onConfirm = () => {},
  onCancel = () => {},
  items,
  getTitle,
}: Pick<DialogProps, "open" | "onOpenChange"> & {
  onConfirm?: () => void;
  onCancel?: () => void;
  items?: T[];
  getTitle?: (item: T) => string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete these items?
          </DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        {items && getTitle && (
          <ul className="list-decimal list-inside">
            {items.map((item, i) => (
              <li key={i}>{getTitle(item)}</li>
            ))}
          </ul>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={onConfirm}>Confirm</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
